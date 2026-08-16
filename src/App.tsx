import React, { useState, useEffect } from 'react';
import { Job, Resume, Evaluation } from './types';
import { Navbar } from './components/Navbar';
import { ScreeningStudio } from './components/ScreeningStudio';
import { EvaluationDetail } from './components/EvaluationDetail';
import { EvaluationHistory } from './components/EvaluationHistory';
import { CandidateComparison } from './components/CandidateComparison';
import { JobsManager } from './components/JobsManager';
import { ResumesManager } from './components/ResumesManager';
import { PromptRulesModal } from './components/PromptRulesModal';
import { INITIAL_JOBS, INITIAL_RESUMES, INITIAL_EVALUATIONS } from './sampleData';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [resumes, setResumes] = useState<Resume[]>(INITIAL_RESUMES);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(INITIAL_EVALUATIONS);
  
  const [activeTab, setActiveTab] = useState<'studio' | 'evaluations' | 'comparison' | 'jobs' | 'resumes' | 'detail'>('studio');
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(INITIAL_EVALUATIONS[0] || null);
  const [comparisonCandidateIds, setComparisonCandidateIds] = useState<string[]>([]);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load store on startup
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const data = await res.json();
          if (data.jobs) setJobs(data.jobs);
          if (data.resumes) setResumes(data.resumes);
          if (data.evaluations) {
            setEvaluations(data.evaluations);
            if (data.evaluations.length > 0 && !selectedEvaluation) {
              setSelectedEvaluation(data.evaluations[0]);
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch server data, using local initial state:', err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // CRUD for Jobs
  const handleAddJob = async (newJob: { job_title: string; job_description: string; department?: string }) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      if (res.ok) {
        const created = await res.json();
        setJobs(prev => [created, ...prev]);
      }
    } catch (err) {
      console.error('Error adding job:', err);
    }
  };

  const handleUpdateJob = async (id: string, updated: { job_title: string; job_description: string; department?: string }) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(prev => prev.map(j => j.id === id ? data : j));
      }
    } catch (err) {
      console.error('Error updating job:', err);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job requisition?')) return;
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      setJobs(prev => prev.filter(j => j.id !== id));
      setEvaluations(prev => prev.filter(e => e.job_id !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  // CRUD for Resumes
  const handleAddResume = async (newResume: { candidate_name?: string; role_title?: string; resume_text: string }) => {
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResume),
      });
      if (res.ok) {
        const created = await res.json();
        setResumes(prev => [created, ...prev]);
      }
    } catch (err) {
      console.error('Error adding resume:', err);
    }
  };

  const handleUpdateResume = async (id: string, updated: { candidate_name?: string; role_title?: string; resume_text: string }) => {
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(prev => prev.map(r => r.id === id ? data : r));
      }
    } catch (err) {
      console.error('Error updating resume:', err);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate resume?')) return;
    try {
      await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      setResumes(prev => prev.filter(r => r.id !== id));
      setEvaluations(prev => prev.filter(e => e.resume_id !== id));
    } catch (err) {
      console.error('Error deleting resume:', err);
    }
  };

  // Delete evaluation
  const handleDeleteEvaluation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this screening evaluation?')) return;
    try {
      await fetch(`/api/evaluations/${id}`, { method: 'DELETE' });
      setEvaluations(prev => prev.filter(e => e.id !== id));
      if (selectedEvaluation?.id === id) {
        setActiveTab('evaluations');
        setSelectedEvaluation(null);
      }
    } catch (err) {
      console.error('Error deleting evaluation:', err);
    }
  };

  // Reset database to initial samples
  const handleResetSamples = async () => {
    if (!confirm('Reset all jobs, resumes, and evaluations to default sample data?')) return;
    try {
      const res = await fetch('/api/reset-samples', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
        setResumes(data.resumes);
        setEvaluations(data.evaluations);
        setSelectedEvaluation(data.evaluations[0] || null);
        setActiveTab('studio');
      }
    } catch (err) {
      console.error('Error resetting samples:', err);
    }
  };

  // Navigation handlers
  const handleEvaluationComplete = (newEval: Evaluation) => {
    setEvaluations(prev => [newEval, ...prev]);
    setSelectedEvaluation(newEval);
    setActiveTab('detail');
  };

  const handleBatchComplete = (newEvals: Evaluation[]) => {
    setEvaluations(prev => [...newEvals, ...prev]);
    setActiveTab('evaluations');
  };

  const handleSelectEvaluationView = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setActiveTab('detail');
  };

  const handleCompareSelected = (evalIds: string[]) => {
    setComparisonCandidateIds(evalIds);
    setActiveTab('comparison');
  };

  const handleScreenForJob = (jobId: string) => {
    setActiveTab('studio');
  };

  const handleScreenResume = (resumeId: string) => {
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab === 'detail' ? 'evaluations' : activeTab}
        setActiveTab={setActiveTab}
        evaluationCount={evaluations.length}
        jobCount={jobs.length}
        resumeCount={resumes.length}
        onResetSamples={handleResetSamples}
        onOpenRules={() => setIsRulesModalOpen(true)}
      />

      {/* Main View Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {activeTab === 'studio' && (
          <ScreeningStudio
            jobs={jobs}
            resumes={resumes}
            onEvaluationComplete={handleEvaluationComplete}
            onBatchComplete={handleBatchComplete}
            onSelectJobForManage={() => setActiveTab('jobs')}
            onSelectResumeForManage={() => setActiveTab('resumes')}
          />
        )}

        {activeTab === 'evaluations' && (
          <EvaluationHistory
            evaluations={evaluations}
            jobs={jobs}
            onSelectEvaluation={handleSelectEvaluationView}
            onDeleteEvaluation={handleDeleteEvaluation}
            onCompareSelected={handleCompareSelected}
          />
        )}

        {activeTab === 'detail' && selectedEvaluation && (
          <EvaluationDetail
            evaluation={selectedEvaluation}
            onBack={() => setActiveTab('evaluations')}
            onDelete={handleDeleteEvaluation}
          />
        )}

        {activeTab === 'comparison' && (
          <CandidateComparison
            evaluations={evaluations}
            jobs={jobs}
            preselectedIds={comparisonCandidateIds}
            onBack={() => setActiveTab('evaluations')}
            onSelectEvaluation={handleSelectEvaluationView}
          />
        )}

        {activeTab === 'jobs' && (
          <JobsManager
            jobs={jobs}
            evaluations={evaluations}
            onAddJob={handleAddJob}
            onUpdateJob={handleUpdateJob}
            onDeleteJob={handleDeleteJob}
            onScreenForJob={handleScreenForJob}
          />
        )}

        {activeTab === 'resumes' && (
          <ResumesManager
            resumes={resumes}
            evaluations={evaluations}
            onAddResume={handleAddResume}
            onUpdateResume={handleUpdateResume}
            onDeleteResume={handleDeleteResume}
            onScreenResume={handleScreenResume}
          />
        )}

      </main>

      {/* 10 Rules & Scoring Weights Modal */}
      <PromptRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-[#020617] border-t border-slate-800/80 text-slate-500 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-slate-400 font-medium">ScreenExpert AI Engine &bull; System Status: Active</span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">Powered by Google Gemini 3.7 Flash & 10 Anti-Bias Verification Rules</span>
        </div>
      </footer>

    </div>
  );
}
