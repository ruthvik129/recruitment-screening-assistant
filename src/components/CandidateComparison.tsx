import React, { FC, useState } from 'react';
import { Evaluation, Job, RequirementStatusType } from '../types';
import { 
  GitCompare, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  User, 
  Briefcase, 
  ArrowLeft,
  Sparkles,
  Trophy,
  ShieldAlert
} from 'lucide-react';

interface CandidateComparisonProps {
  evaluations: Evaluation[];
  jobs: Job[];
  preselectedIds?: string[];
  onBack?: () => void;
  onSelectEvaluation?: (evaluation: Evaluation) => void;
}

export const CandidateComparison: FC<CandidateComparisonProps> = ({
  evaluations,
  jobs,
  preselectedIds = [],
  onBack,
  onSelectEvaluation,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(
    evaluations[0]?.job_id || jobs[0]?.id || ''
  );

  // Filter candidates relevant to the chosen job or preselected
  const relevantEvaluations = evaluations.filter(e => e.job_id === selectedJobId);

  const [chosenEvalIds, setChosenEvalIds] = useState<string[]>(() => {
    if (preselectedIds.length > 0) return preselectedIds.slice(0, 4);
    return relevantEvaluations.slice(0, 3).map(e => e.id);
  });

  const comparedEvaluations = evaluations.filter(e => chosenEvalIds.includes(e.id));

  const handleToggleCandidate = (id: string) => {
    if (chosenEvalIds.includes(id)) {
      setChosenEvalIds(chosenEvalIds.filter(item => item !== id));
    } else {
      if (chosenEvalIds.length >= 4) {
        alert('Maximum of 4 candidates can be compared simultaneously.');
        return;
      }
      setChosenEvalIds([...chosenEvalIds, id]);
    }
  };

  const getRecBadge = (rec: string) => {
    switch (rec) {
      case 'Strong Match':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">Strong Match</span>;
      case 'Match':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">Match</span>;
      case 'Partial Match':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">Partial Match</span>;
      case 'Weak Match':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">Weak Match</span>;
    }
  };

  const getStatusIcon = (status: RequirementStatusType) => {
    switch (status) {
      case 'met':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'not_met':
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'unclear':
      default:
        return <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div id="candidate-comparison" className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Side-by-Side Candidate Comparison</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare objective scores, strength profiles, and requirement satisfaction matrices.
            </p>
          </div>
        </div>

        {/* Job selector */}
        <div className="flex items-center space-x-2 text-xs w-full sm:w-auto">
          <span className="font-semibold text-slate-300 whitespace-nowrap">Filter by Job:</span>
          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              const evalsForNewJob = evaluations.filter(ev => ev.job_id === e.target.value);
              setChosenEvalIds(evalsForNewJob.slice(0, 3).map(ev => ev.id));
            }}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg focus:ring-1 focus:ring-indigo-500 text-slate-100 font-medium"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.job_title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidate Selector Badges */}
      <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-md">
        <div className="text-xs font-semibold text-slate-300 mb-2">
          Select Candidates to Compare (choose 2 to 4):
        </div>
        <div className="flex flex-wrap gap-2">
          {evaluations.map((ev) => {
            const isChosen = chosenEvalIds.includes(ev.id);
            return (
              <button
                key={ev.id}
                onClick={() => handleToggleCandidate(ev.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center space-x-2 ${
                  isChosen
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>{ev.candidate_name || 'Candidate'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isChosen ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {ev.match_score} pts
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      {comparedEvaluations.length >= 2 ? (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-md overflow-hidden">
          
          {/* Header Row of Candidates */}
          <div className={`grid grid-cols-${comparedEvaluations.length} divide-x divide-slate-800 border-b border-slate-800 bg-slate-950/60`}>
            {comparedEvaluations.map((ev, i) => (
              <div key={ev.id} className="p-5 text-center space-y-3">
                <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 font-mono">
                  <span>Candidate #{i + 1}</span>
                  {i === 0 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                </div>

                <h3 className="font-bold text-white text-base">{ev.candidate_name || 'Anonymous'}</h3>
                
                {/* Score badge */}
                <div className="inline-flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-slate-950 border-2 border-indigo-500/40 shadow-xs font-extrabold text-2xl text-indigo-300 mx-auto">
                  <span>{ev.match_score}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 -mt-1">/100</span>
                </div>

                <div>
                  {getRecBadge(ev.recommendation)}
                </div>

                {onSelectEvaluation && (
                  <button
                    onClick={() => onSelectEvaluation(ev)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline block mx-auto"
                  >
                    View Full Report →
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Section: Executive Fit Summary */}
          <div className="p-4 bg-slate-950/80 font-bold text-xs uppercase tracking-wider text-slate-300 border-b border-slate-800">
            Executive Fit Summary
          </div>
          <div className={`grid grid-cols-${comparedEvaluations.length} divide-x divide-slate-800 border-b border-slate-800`}>
            {comparedEvaluations.map((ev) => (
              <div key={ev.id} className="p-4 text-xs text-slate-300 leading-relaxed font-sans">
                {ev.summary}
              </div>
            ))}
          </div>

          {/* Section: Key Strengths Count & Top Highlights */}
          <div className="p-4 bg-slate-950/80 font-bold text-xs uppercase tracking-wider text-slate-300 border-b border-slate-800 flex items-center justify-between">
            <span>Key Strengths & Evidence</span>
          </div>
          <div className={`grid grid-cols-${comparedEvaluations.length} divide-x divide-slate-800 border-b border-slate-800`}>
            {comparedEvaluations.map((ev) => (
              <div key={ev.id} className="p-4 space-y-2 text-xs">
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30 mb-2">
                  {ev.strengths?.length || 0} Core Strengths
                </span>
                {ev.strengths?.slice(0, 3).map((str, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div className="font-bold text-emerald-400 mb-0.5">{str.area}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-2">{str.evidence}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Section: Gaps & Missing Evidence */}
          <div className="p-4 bg-slate-950/80 font-bold text-xs uppercase tracking-wider text-slate-300 border-b border-slate-800">
            Identified Gaps & Unclear Qualifications
          </div>
          <div className={`grid grid-cols-${comparedEvaluations.length} divide-x divide-slate-800 border-b border-slate-800`}>
            {comparedEvaluations.map((ev) => (
              <div key={ev.id} className="p-4 space-y-2 text-xs">
                <span className="inline-block px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/30 mb-2">
                  {ev.gaps?.length || 0} Identified Gaps
                </span>
                {ev.gaps?.slice(0, 3).map((gap, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-rose-400">{gap.area}</span>
                      <span className="text-[9px] uppercase font-bold text-rose-300 bg-rose-950/60 border border-rose-500/30 px-1.5 py-0.2 rounded">
                        {gap.importance}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2">{gap.evidence}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="bg-slate-900/40 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
          <GitCompare className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Select at least 2 candidates to compare</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click the candidate pills above to see side-by-side scoring, strengths, and qualification analysis.
          </p>
        </div>
      )}

    </div>
  );
};
