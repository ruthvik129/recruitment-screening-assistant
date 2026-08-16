import React, { FC, useState } from 'react';
import { Job, Resume, Evaluation } from '../types';
import { 
  Sparkles, 
  Play, 
  Layers, 
  FileText, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Zap, 
  Users, 
  CheckSquare, 
  Square,
  ArrowRight,
  ShieldCheck,
  Plus,
  FileUp,
  Loader2
} from 'lucide-react';
import { parseUploadedDocument } from '../utils/fileParser';

interface ScreeningStudioProps {
  jobs: Job[];
  resumes: Resume[];
  onEvaluationComplete: (evaluation: Evaluation) => void;
  onBatchComplete: (evaluations: Evaluation[]) => void;
  onSelectJobForManage?: () => void;
  onSelectResumeForManage?: () => void;
}

export const ScreeningStudio: FC<ScreeningStudioProps> = ({
  jobs,
  resumes,
  onEvaluationComplete,
  onBatchComplete,
}) => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  
  // Single mode state
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || '');
  const [isCustomJob, setIsCustomJob] = useState(false);
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [customJobDesc, setCustomJobDesc] = useState('');
  const [isCustomResume, setIsCustomResume] = useState(false);
  const [customCandidateName, setCustomCandidateName] = useState('');
  const [customResumeText, setCustomResumeText] = useState('');

  // Upload helpers state
  const [isParsingResumeFile, setIsParsingResumeFile] = useState(false);
  const [resumeFileError, setResumeFileError] = useState<string | null>(null);
  const [resumeFileSuccess, setResumeFileSuccess] = useState<string | null>(null);
  const [isResumeDragging, setIsResumeDragging] = useState(false);

  const [isParsingJobFile, setIsParsingJobFile] = useState(false);
  const [jobFileError, setJobFileError] = useState<string | null>(null);
  const [jobFileSuccess, setJobFileSuccess] = useState<string | null>(null);

  // Batch mode state
  const [batchJobId, setBatchJobId] = useState<string>(jobs[0]?.id || '');
  const [selectedBatchResumeIds, setSelectedBatchResumeIds] = useState<string[]>(
    resumes.map(r => r.id)
  );

  // Loading & Progress states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeJob = jobs.find(j => j.id === selectedJobId);
  const activeResume = resumes.find(r => r.id === selectedResumeId);

  // Custom Resume Upload handlers
  const handleResumeFileUpload = async (file: File) => {
    setResumeFileError(null);
    setResumeFileSuccess(null);
    setIsParsingResumeFile(true);

    try {
      const parsed = await parseUploadedDocument(file);
      setCustomResumeText(parsed.text);
      if (!customCandidateName && parsed.candidateNameSuggestion) {
        setCustomCandidateName(parsed.candidateNameSuggestion);
      }
      setResumeFileSuccess(`Extracted ${parsed.text.length} chars from ${parsed.fileName}`);
    } catch (err: any) {
      setResumeFileError(err?.message || 'Failed to read document.');
    } finally {
      setIsParsingResumeFile(false);
    }
  };

  // Custom Job Upload handlers
  const handleJobFileUpload = async (file: File) => {
    setJobFileError(null);
    setJobFileSuccess(null);
    setIsParsingJobFile(true);

    try {
      const parsed = await parseUploadedDocument(file);
      setCustomJobDesc(parsed.text);
      if (!customJobTitle) {
        const cleanTitle = parsed.fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setCustomJobTitle(cleanTitle);
      }
      setJobFileSuccess(`Extracted ${parsed.text.length} chars from ${parsed.fileName}`);
    } catch (err: any) {
      setJobFileError(err?.message || 'Failed to read document.');
    } finally {
      setIsParsingJobFile(false);
    }
  };

  // Quick preset loader for fast demonstration
  const handleLoadPreset = (presetType: 'strong' | 'weak' | 'ai') => {
    setIsCustomJob(false);
    setIsCustomResume(false);
    if (presetType === 'strong') {
      const targetJob = jobs.find(j => j.id === 'job-senior-fullstack-001') || jobs[0];
      const targetResume = resumes.find(r => r.id === 'resume-alex-rivera-001') || resumes[0];
      if (targetJob) setSelectedJobId(targetJob.id);
      if (targetResume) setSelectedResumeId(targetResume.id);
    } else if (presetType === 'weak') {
      const targetJob = jobs.find(j => j.id === 'job-senior-fullstack-001') || jobs[0];
      const targetResume = resumes.find(r => r.id === 'resume-jordan-chen-002') || resumes[1] || resumes[0];
      if (targetJob) setSelectedJobId(targetJob.id);
      if (targetResume) setSelectedResumeId(targetResume.id);
    } else if (presetType === 'ai') {
      const targetJob = jobs.find(j => j.id === 'job-lead-ai-engineer-002') || jobs[1] || jobs[0];
      const targetResume = resumes.find(r => r.id === 'resume-maya-patel-003') || resumes[2] || resumes[0];
      if (targetJob) setSelectedJobId(targetJob.id);
      if (targetResume) setSelectedResumeId(targetResume.id);
    }
  };

  const handleToggleBatchResume = (id: string) => {
    if (selectedBatchResumeIds.includes(id)) {
      setSelectedBatchResumeIds(selectedBatchResumeIds.filter(item => item !== id));
    } else {
      setSelectedBatchResumeIds([...selectedBatchResumeIds, id]);
    }
  };

  const handleSelectAllBatch = () => {
    if (selectedBatchResumeIds.length === resumes.length) {
      setSelectedBatchResumeIds([]);
    } else {
      setSelectedBatchResumeIds(resumes.map(r => r.id));
    }
  };

  // Run Single Evaluation
  const handleRunEvaluation = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      let payload: any = {};
      if (isCustomJob) {
        if (!customJobDesc.trim()) {
          throw new Error('Please enter a Job Description.');
        }
        payload.job_title = customJobTitle || 'Custom Job Position';
        payload.job_description = customJobDesc;
      } else {
        if (!selectedJobId) throw new Error('Please select a Job.');
        payload.job_id = selectedJobId;
      }

      if (isCustomResume) {
        if (!customResumeText.trim()) {
          throw new Error('Please enter Resume text.');
        }
        payload.candidate_name = customCandidateName || 'Anonymous Candidate';
        payload.resume_text = customResumeText;
      } else {
        if (!selectedResumeId) throw new Error('Please select a Candidate Resume.');
        payload.resume_id = selectedResumeId;
      }

      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to complete screening evaluation.');
      }

      const result: Evaluation = await res.json();
      clearInterval(stepInterval);
      setLoadingStep(4);
      setTimeout(() => {
        setIsLoading(false);
        onEvaluationComplete(result);
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsLoading(false);
      setErrorMsg(err.message || 'An error occurred during evaluation.');
    }
  };

  // Run Batch Evaluation
  const handleRunBatch = async () => {
    if (!batchJobId) {
      setErrorMsg('Please select a Job for batch screening.');
      return;
    }
    if (selectedBatchResumeIds.length === 0) {
      setErrorMsg('Please select at least one candidate resume to screen.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setLoadingStep(1);

    try {
      const res = await fetch('/api/batch-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: batchJobId,
          resume_ids: selectedBatchResumeIds,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Batch screening failed.');
      }

      const data = await res.json();
      setIsLoading(false);
      onBatchComplete(data.evaluations || []);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Batch evaluation error.');
    }
  };

  return (
    <div id="screening-studio" className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Top Banner & Mode Toggle */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Top subtle highlight gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Screening Engine Active (Gemini 3.7 Flash)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Objective Candidate Screening & Evidence Evaluation
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Screen candidates against exact job specifications using the 10 Golden Rules. 
            Scores are calculated across 5 weighted pillars (Required Skills 35%, Experience 25%, Responsibilities 20%, Required Quals 10%, Preferred 10%) with direct evidentiary citations.
          </p>

          {/* Mode Switcher */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/90 p-1 rounded-xl border border-slate-800 inline-flex">
              <button
                id="btn-single-mode"
                onClick={() => setMode('single')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  mode === 'single'
                    ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Single Candidate Evaluation</span>
              </button>
              <button
                id="btn-batch-mode"
                onClick={() => setMode('batch')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  mode === 'batch'
                    ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Batch Multi-Candidate Screening</span>
              </button>
            </div>

            {/* Quick Demo Presets */}
            {mode === 'single' && (
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-slate-400 text-[11px] hidden sm:inline">Try Preset:</span>
                <button
                  onClick={() => handleLoadPreset('strong')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-emerald-300 border border-slate-800 text-[11px] font-medium transition"
                >
                  ⚡ Senior Full Stack (Strong Fit)
                </button>
                <button
                  onClick={() => handleLoadPreset('weak')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-amber-300 border border-slate-800 text-[11px] font-medium transition"
                >
                  ⚡ Junior vs Senior (Weak Fit)
                </button>
                <button
                  onClick={() => handleLoadPreset('ai')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-indigo-300 border border-slate-800 text-[11px] font-medium transition"
                >
                  ⚡ Lead AI Engineer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SINGLE MODE */}
      {mode === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Job Selection & Preview */}
          <div className="lg:col-span-6 bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm sm:text-base">1. Job Description</h3>
              </div>
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setIsCustomJob(false)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    !isCustomJob ? 'bg-indigo-600 font-semibold text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  From Library
                </button>
                <button
                  onClick={() => setIsCustomJob(true)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    isCustomJob ? 'bg-indigo-600 font-semibold text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Custom JD
                </button>
              </div>
            </div>

            {!isCustomJob ? (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Select Job Requisition
                </label>
                <select
                  id="select-job-dropdown"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-slate-100"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.job_title} {job.department ? `(${job.department})` : ''}
                    </option>
                  ))}
                </select>

                {activeJob && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Job Description Preview</span>
                      <span className="font-mono text-[11px]">{activeJob.job_description.length} chars</span>
                    </div>
                    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 max-h-72 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
                      {activeJob.job_description}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Job Title / Role Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Backend Architect"
                    value={customJobTitle}
                    onChange={(e) => setCustomJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Import Job Description from File */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-dashed border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-slate-300 text-xs">
                    {isParsingJobFile ? (
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                    ) : (
                      <FileUp className="w-4 h-4 text-indigo-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-200">Import JD from document</span>
                      <span className="block text-[10px] text-slate-500">.pdf, .doc, .docx, .txt (no .md)</span>
                    </div>
                  </div>
                  <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer shadow-xs whitespace-nowrap transition">
                    Browse File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleJobFileUpload(file);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {jobFileError && (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{jobFileError}</span>
                  </div>
                )}
                {jobFileSuccess && (
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{jobFileSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Job Description (Requirements, Responsibilities & Skills)
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Paste full job description with required skills, experience, and qualifications..."
                    value={customJobDesc}
                    onChange={(e) => setCustomJobDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Resume Selection & Preview */}
          <div className="lg:col-span-6 bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm sm:text-base">2. Candidate Resume</h3>
              </div>
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setIsCustomResume(false)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    !isCustomResume ? 'bg-indigo-600 font-semibold text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  From Library
                </button>
                <button
                  onClick={() => setIsCustomResume(true)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    isCustomResume ? 'bg-indigo-600 font-semibold text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Upload / Paste
                </button>
              </div>
            </div>

            {!isCustomResume ? (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Select Candidate Profile
                </label>
                <select
                  id="select-resume-dropdown"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-slate-100"
                >
                  {resumes.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.candidate_name || 'Unnamed Candidate'} {res.role_title ? `— ${res.role_title}` : ''}
                    </option>
                  ))}
                </select>

                {activeResume && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Resume Text Preview</span>
                      <span className="font-mono text-[11px]">{activeResume.resume_text.length} chars</span>
                    </div>
                    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 max-h-72 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
                      {activeResume.resume_text}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Candidate Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Taylor Morgan"
                    value={customCandidateName}
                    onChange={(e) => setCustomCandidateName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Drag & Drop / Upload resume helper */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsResumeDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsResumeDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsResumeDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleResumeFileUpload(file);
                  }}
                  className={`p-3.5 rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center text-center space-y-1.5 ${
                    isResumeDragging
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-slate-300">
                    {isParsingResumeFile ? (
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    ) : (
                      <FileUp className="w-4 h-4 text-indigo-400" />
                    )}
                    <span className="font-semibold text-xs text-white">
                      {isParsingResumeFile ? 'Extracting text...' : 'Upload Resume File'}
                    </span>
                  </div>

                  <p className="text-[10.5px] text-slate-400">
                    Accepts <span className="text-indigo-300 font-medium">PDF</span>, <span className="text-indigo-300 font-medium">DOC / DOCX</span>, or <span className="text-indigo-300 font-medium">TXT</span>.
                    <span className="block text-amber-400/90 text-[10px] font-mono">Markdown (.md) files are not accepted.</span>
                  </p>

                  <label className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer shadow-xs transition active:scale-95">
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Browse Document</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleResumeFileUpload(file);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>

                  {resumeFileError && (
                    <div className="w-full mt-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center space-x-1.5 text-left">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{resumeFileError}</span>
                    </div>
                  )}

                  {resumeFileSuccess && (
                    <div className="w-full mt-1.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center space-x-1.5 text-left">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{resumeFileSuccess}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Resume Text / Content *
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Paste candidate resume, work history, skills, and certifications..."
                    value={customResumeText}
                    onChange={(e) => setCustomResumeText(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Screening Action Bar */}
          <div className="lg:col-span-12 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Ready to Screen Candidate</h4>
                <p className="text-xs text-slate-400">
                  Evaluates only explicit evidence using conservative anti-bias scoring.
                </p>
              </div>
            </div>

            <button
              id="btn-run-screening"
              onClick={handleRunEvaluation}
              disabled={isLoading}
              className={`w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition flex items-center justify-center space-x-2 ${
                isLoading
                  ? 'bg-slate-700 cursor-not-allowed opacity-70'
                  : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Candidate...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-white" />
                  <span>Execute AI Screening Evaluation</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* BATCH MODE */}
      {mode === 'batch' && (
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">Batch Multi-Candidate Screening</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select one Job Description and screen multiple resumes in a single pipeline. Results will be saved and ranked.
            </p>
          </div>

          {/* Job Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Target Job Requisition
            </label>
            <select
              value={batchJobId}
              onChange={(e) => setBatchJobId(e.target.value)}
              className="w-full sm:w-1/2 px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 font-medium text-slate-100"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.job_title} ({job.department || 'General'})
                </option>
              ))}
            </select>
          </div>

          {/* Resumes Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Select Resumes to Screen ({selectedBatchResumeIds.length} of {resumes.length} selected)
              </span>
              <button
                onClick={handleSelectAllBatch}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {selectedBatchResumeIds.length === resumes.length ? 'Deselect All' : 'Select All Resumes'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {resumes.map((res) => {
                const isSelected = selectedBatchResumeIds.includes(res.id);
                return (
                  <div
                    key={res.id}
                    onClick={() => handleToggleBatchResume(res.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-200 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 text-indigo-400">
                      {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white">{res.candidate_name || 'Candidate'}</div>
                      <div className="text-slate-400 text-[11px]">{res.role_title || 'Applicant'}</div>
                      <div className="text-slate-500 text-[10px] mt-1">{res.resume_text.slice(0, 70)}...</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={handleRunBatch}
              disabled={isLoading || selectedBatchResumeIds.length === 0}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] transition flex items-center space-x-2 ${
                isLoading || selectedBatchResumeIds.length === 0
                  ? 'bg-slate-700 cursor-not-allowed opacity-60'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Batch Screening...</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Screen {selectedBatchResumeIds.length} Candidate(s)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Loading Modal / Step Progress */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-800 text-center space-y-6">
            
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 mx-auto flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <Sparkles className="w-8 h-8 animate-pulse text-indigo-400" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">AI Screening in Progress</h3>
              <p className="text-xs text-slate-400 mt-1">Applying 10-rule scoring framework and extracting evidence...</p>
            </div>

            {/* Step list */}
            <div className="space-y-3 text-left text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className={`flex items-center space-x-2.5 ${loadingStep >= 1 ? 'text-indigo-300 font-semibold' : 'text-slate-500'}`}>
                {loadingStep > 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin shrink-0" />
                )}
                <span>1. Parsing Required & Preferred Job Criteria</span>
              </div>

              <div className={`flex items-center space-x-2.5 ${loadingStep >= 2 ? 'text-indigo-300 font-semibold' : 'text-slate-500'}`}>
                {loadingStep > 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : loadingStep === 2 ? (
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>2. Verifying Resume Evidence & Anti-Bias Rules</span>
              </div>

              <div className={`flex items-center space-x-2.5 ${loadingStep >= 3 ? 'text-indigo-300 font-semibold' : 'text-slate-500'}`}>
                {loadingStep > 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : loadingStep === 3 ? (
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>3. Calculating 5-Pillar Weighted Match Score</span>
              </div>

              <div className={`flex items-center space-x-2.5 ${loadingStep >= 4 ? 'text-indigo-300 font-semibold' : 'text-slate-500'}`}>
                {loadingStep >= 4 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>4. Formatting Strengths, Gaps & Matrix Report</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
