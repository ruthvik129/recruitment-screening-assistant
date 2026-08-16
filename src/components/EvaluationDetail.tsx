import React, { FC, useState } from 'react';
import { 
  Evaluation, 
  RequirementAnalysis, 
  ImportanceType, 
  RequirementStatusType 
} from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  Trash2, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft,
  Search,
  Filter,
  FileText,
  User,
  Briefcase
} from 'lucide-react';

interface EvaluationDetailProps {
  evaluation: Evaluation;
  onBack?: () => void;
  onDelete?: (id: string) => void;
}

export const EvaluationDetail: FC<EvaluationDetailProps> = ({ evaluation, onBack, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | RequirementStatusType>('all');
  const [importanceFilter, setImportanceFilter] = useState<'all' | ImportanceType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Recommendation color mapping for Immersive UI
  const getRecommendationStyles = (rec: string) => {
    switch (rec) {
      case 'Strong Match':
        return {
          bg: 'from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30',
          badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
          accent: 'text-emerald-400',
          ring: 'border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
        };
      case 'Match':
        return {
          bg: 'from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/30',
          badge: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.3)]',
          accent: 'text-indigo-400',
          ring: 'border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]',
        };
      case 'Partial Match':
        return {
          bg: 'from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/30',
          badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
          accent: 'text-amber-400',
          ring: 'border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
        };
      case 'Weak Match':
      default:
        return {
          bg: 'from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/30',
          badge: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
          accent: 'text-rose-400',
          ring: 'border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
        };
    }
  };

  const recStyles = getRecommendationStyles(evaluation.recommendation);

  const getStatusBadge = (status: RequirementStatusType) => {
    switch (status) {
      case 'met':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
            <span>MET</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]"></span>
            <span>PARTIAL</span>
          </span>
        );
      case 'not_met':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]"></span>
            <span>NOT MET</span>
          </span>
        );
      case 'unclear':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>UNCLEAR</span>
          </span>
        );
    }
  };

  // Requirement filtering
  const filteredRequirements = (evaluation.requirement_analysis || []).filter((req) => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesImportance = importanceFilter === 'all' || req.importance === importanceFilter;
    const matchesSearch = searchQuery === '' || 
      req.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.evidence.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesImportance && matchesSearch;
  });

  const totalReqs = evaluation.requirement_analysis?.length || 0;
  const metCount = evaluation.requirement_analysis?.filter(r => r.status === 'met').length || 0;
  const partialCount = evaluation.requirement_analysis?.filter(r => r.status === 'partial').length || 0;
  const notMetCount = evaluation.requirement_analysis?.filter(r => r.status === 'not_met').length || 0;

  const handleCopyReport = () => {
    const markdown = `# Candidate Screening Evaluation Report
**Candidate:** ${evaluation.candidate_name || 'Anonymous Candidate'}
**Job:** ${evaluation.job_title || 'Target Job'}
**Match Score:** ${evaluation.match_score}/100
**Recommendation:** ${evaluation.recommendation}
**Evaluated At:** ${new Date(evaluation.created_at).toLocaleString()}
**Model:** ${evaluation.model_name}

---

## Executive Summary
${evaluation.summary}

---

## Key Strengths
${evaluation.strengths.map(s => `- **${s.area}**: ${s.evidence}`).join('\n')}

---

## Gaps & Missing Evidence
${evaluation.gaps.map(g => `- **[${g.importance.toUpperCase()}] ${g.area}**: ${g.evidence}`).join('\n')}

---

## Requirement Breakdown
${evaluation.requirement_analysis.map(r => `- **[${r.importance.toUpperCase()} - ${r.status.toUpperCase()}]** ${r.requirement}\n  *Evidence:* ${r.evidence}`).join('\n\n')}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(evaluation, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `evaluation-${evaluation.candidate_name || 'candidate'}-${evaluation.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="evaluation-detail-container" className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Top Header / Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/70 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700/60 transition"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Screening Evaluation Report</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700">
                {evaluation.model_name}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <strong className="text-slate-200">{evaluation.candidate_name || 'Candidate'}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-300">{evaluation.job_title || 'Job Requisition'}</span>
              </span>
              <span>•</span>
              <span>{new Date(evaluation.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-xl border border-slate-700/80 transition"
            title="Copy formatted summary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Report'}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-xl border border-slate-700/80 transition"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-xl border border-slate-700/80 transition"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(evaluation.id)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/30 transition"
              title="Delete evaluation record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hero Match Score Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border bg-gradient-to-br ${recStyles.bg} shadow-2xl relative overflow-hidden`}>
        {/* Top subtle highlight */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Circular Score Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
            <div className="relative flex items-center justify-center">
              <div className={`w-32 h-32 rounded-full border-4 ${recStyles.ring} flex flex-col items-center justify-center bg-slate-900 shadow-inner`}>
                <span className="text-4xl font-black tracking-tight text-white">{evaluation.match_score}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">out of 100</span>
              </div>
            </div>
            <div className="mt-4">
              <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${recStyles.badge}`}>
                {evaluation.recommendation}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Weighted across 5 screening pillars
            </p>
          </div>

          {/* Executive Fit Summary */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">Executive Fit Summary</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-200 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
              {evaluation.summary}
            </p>
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-1 text-center">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-lg font-bold text-emerald-400">{evaluation.strengths?.length || 0}</div>
                <div className="text-[11px] font-medium text-slate-400">Key Strengths</div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-lg font-bold text-rose-400">{evaluation.gaps?.length || 0}</div>
                <div className="text-[11px] font-medium text-slate-400">Identified Gaps</div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-lg font-bold text-indigo-400">{metCount} / {totalReqs}</div>
                <div className="text-[11px] font-medium text-slate-400">Reqs Satisfied</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 5-Pillar Weighted Framework Transparency */}
      <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">5-Pillar Scoring Weight Distribution</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">10 Strict Screening Rules</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span>Pillar 1</span>
              <span className="font-bold text-indigo-400">35%</span>
            </div>
            <div className="font-semibold text-slate-200 mt-1">Required Skills</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Core technical ability</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span>Pillar 2</span>
              <span className="font-bold text-indigo-400">25%</span>
            </div>
            <div className="font-semibold text-slate-200 mt-1">Experience Depth</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Years & seniority</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span>Pillar 3</span>
              <span className="font-bold text-indigo-400">20%</span>
            </div>
            <div className="font-semibold text-slate-200 mt-1">Responsibilities</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Ownership alignment</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span>Pillar 4</span>
              <span className="font-bold text-indigo-400">10%</span>
            </div>
            <div className="font-semibold text-slate-200 mt-1">Required Quals</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Degrees & certs</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span>Pillar 5</span>
              <span className="font-bold text-indigo-400">10%</span>
            </div>
            <div className="font-semibold text-slate-200 mt-1">Preferred Skills</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Bonus competencies</div>
          </div>
        </div>
      </div>

      {/* Strengths & Gaps Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Strengths */}
        <div className="bg-emerald-500/5 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 shadow-md flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-emerald-300">Key Strengths & Evidence</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {evaluation.strengths?.length || 0} Identified
            </span>
          </div>

          {evaluation.strengths && evaluation.strengths.length > 0 ? (
            <div className="space-y-3 flex-1">
              {evaluation.strengths.map((strength, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-xs">
                  <div className="font-bold text-emerald-300 text-sm mb-1.5">{strength.area}</div>
                  <div className="text-slate-300 leading-relaxed bg-slate-900/90 p-3 rounded-lg border border-slate-800 font-sans">
                    <span className="font-semibold text-emerald-400">Evidence: </span>
                    {strength.evidence}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">No explicit strengths listed.</div>
          )}
        </div>

        {/* Gaps & Missing Evidence */}
        <div className="bg-rose-500/5 backdrop-blur-md p-5 rounded-2xl border border-rose-500/20 shadow-md flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-rose-300">Gaps & Missing Evidence</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {evaluation.gaps?.length || 0} Identified
            </span>
          </div>

          {evaluation.gaps && evaluation.gaps.length > 0 ? (
            <div className="space-y-3 flex-1">
              {evaluation.gaps.map((gap, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/20 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-200 text-sm">{gap.area}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      gap.importance === 'required'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {gap.importance}
                    </span>
                  </div>
                  <div className="text-slate-300 leading-relaxed bg-slate-900/90 p-3 rounded-lg border border-slate-800 font-sans">
                    <span className="font-semibold text-rose-400">Missing / Unclear: </span>
                    {gap.evidence}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-emerald-400 text-xs font-medium">
              No critical gaps identified for this role.
            </div>
          )}
        </div>

      </div>

      {/* Requirement-by-Requirement Analysis Matrix */}
      <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
        
        {/* Matrix Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Requirement-Level Analysis Matrix</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Granular breakdown verifying each job specification against candidate resume evidence.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Filter requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${
                statusFilter === 'all' ? 'bg-indigo-600 font-semibold text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({totalReqs})
            </button>
            <button
              onClick={() => setStatusFilter('met')}
              className={`px-3 py-1 rounded-lg transition ${
                statusFilter === 'met' ? 'bg-emerald-500/20 border border-emerald-500/40 font-semibold text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Met ({metCount})
            </button>
            <button
              onClick={() => setStatusFilter('partial')}
              className={`px-3 py-1 rounded-lg transition ${
                statusFilter === 'partial' ? 'bg-amber-500/20 border border-amber-500/40 font-semibold text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Partial ({partialCount})
            </button>
            <button
              onClick={() => setStatusFilter('not_met')}
              className={`px-3 py-1 rounded-lg transition ${
                statusFilter === 'not_met' ? 'bg-rose-500/20 border border-rose-500/40 font-semibold text-rose-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Not Met ({notMetCount})
            </button>
          </div>

          {/* Importance Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setImportanceFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${
                importanceFilter === 'all' ? 'bg-indigo-600 font-semibold text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setImportanceFilter('required')}
              className={`px-3 py-1 rounded-lg transition ${
                importanceFilter === 'required' ? 'bg-indigo-500/20 border border-indigo-500/40 font-semibold text-indigo-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Required Only
            </button>
            <button
              onClick={() => setImportanceFilter('preferred')}
              className={`px-3 py-1 rounded-lg transition ${
                importanceFilter === 'preferred' ? 'bg-slate-800 font-semibold text-slate-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Preferred Only
            </button>
          </div>
        </div>

        {/* Matrix Rows */}
        <div className="space-y-3">
          {filteredRequirements.length > 0 ? (
            filteredRequirements.map((req, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition bg-slate-950/60 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(req.status)}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      req.importance === 'required' 
                        ? 'border border-indigo-500/50 bg-indigo-500/10 text-indigo-300' 
                        : 'border border-slate-700 bg-slate-800 text-slate-400'
                    }`}>
                      {req.importance}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Item #{idx + 1}</span>
                </div>

                <div className="font-semibold text-slate-200 text-sm mb-2">
                  {req.requirement}
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">Evidentiary Finding: </span>
                  {req.evidence}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              No requirements match the selected filter criteria.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
