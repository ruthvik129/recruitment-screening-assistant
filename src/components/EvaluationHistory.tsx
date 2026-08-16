import React, { FC, useState, useMemo } from 'react';
import { Evaluation, Job, RecommendationType } from '../types';
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Trash2, 
  Eye, 
  Download, 
  User, 
  Briefcase, 
  Calendar, 
  Sparkles,
  GitCompare,
  TrendingUp
} from 'lucide-react';

interface EvaluationHistoryProps {
  evaluations: Evaluation[];
  jobs: Job[];
  onSelectEvaluation: (evaluation: Evaluation) => void;
  onDeleteEvaluation: (id: string) => void;
  onCompareSelected?: (evaluationIds: string[]) => void;
}

export const EvaluationHistory: FC<EvaluationHistoryProps> = ({
  evaluations,
  jobs,
  onSelectEvaluation,
  onDeleteEvaluation,
  onCompareSelected,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [recommendationFilter, setRecommendationFilter] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score-desc' | 'score-asc' | 'date-desc' | 'date-asc'>('date-desc');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Filter and sort evaluations
  const filteredEvaluations = useMemo(() => {
    return evaluations
      .filter((ev) => {
        const matchesJob = jobFilter === 'all' || ev.job_id === jobFilter;
        const matchesRec = recommendationFilter === 'all' || ev.recommendation === recommendationFilter;
        const matchesScore = ev.match_score >= minScore;
        const matchesSearch =
          searchQuery === '' ||
          (ev.candidate_name && ev.candidate_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (ev.job_title && ev.job_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          ev.summary.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesJob && matchesRec && matchesScore && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'score-desc') return b.match_score - a.match_score;
        if (sortBy === 'score-asc') return a.match_score - b.match_score;
        if (sortBy === 'date-desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'date-asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return 0;
      });
  }, [evaluations, searchQuery, jobFilter, recommendationFilter, minScore, sortBy]);

  const handleToggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(item => item !== id));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare a maximum of 4 candidate evaluations at once.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'Strong Match':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">Strong Match</span>;
      case 'Match':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">Match</span>;
      case 'Partial Match':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">Partial Match</span>;
      case 'Weak Match':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">Weak Match</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-300 bg-emerald-950/50 border-emerald-500/30';
    if (score >= 75) return 'text-indigo-300 bg-indigo-950/50 border-indigo-500/30';
    if (score >= 60) return 'text-amber-300 bg-amber-950/50 border-amber-500/30';
    return 'text-rose-300 bg-rose-950/50 border-rose-500/30';
  };

  // Export summary CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Candidate Name', 'Job Title', 'Match Score', 'Recommendation', 'Created At', 'Summary'];
    const rows = filteredEvaluations.map(e => [
      `"${e.id}"`,
      `"${e.candidate_name || 'Candidate'}"`,
      `"${e.job_title || 'Job'}"`,
      e.match_score,
      `"${e.recommendation}"`,
      `"${new Date(e.created_at).toISOString()}"`,
      `"${e.summary.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `screenings-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div id="evaluation-history" className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header & Controls */}
      <div className="bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Evaluation Records & Screening History</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review, filter, compare, and export past candidate evaluations.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {selectedForCompare.length >= 2 && onCompareSelected && (
              <button
                onClick={() => onCompareSelected(selectedForCompare)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(99,102,241,0.4)] transition"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Selected ({selectedForCompare.length})</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              disabled={filteredEvaluations.length === 0}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition"
              title="Export filtered list to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          
          {/* Search */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Search Candidates / JDs</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Job Filter */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Filter by Job</label>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Jobs ({evaluations.length})</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.job_title}
                </option>
              ))}
            </select>
          </div>

          {/* Recommendation Filter */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Recommendation Tier</label>
            <select
              value={recommendationFilter}
              onChange={(e) => setRecommendationFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Recommendations</option>
              <option value="Strong Match">Strong Match (90-100)</option>
              <option value="Match">Match (75-89)</option>
              <option value="Partial Match">Partial Match (60-74)</option>
              <option value="Weak Match">Weak Match (&lt;60)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="score-desc">Match Score (High to Low)</option>
              <option value="score-asc">Match Score (Low to High)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Evaluations Cards List */}
      <div className="space-y-3">
        {filteredEvaluations.length > 0 ? (
          filteredEvaluations.map((evaluation) => {
            const isSelectedForCompare = selectedForCompare.includes(evaluation.id);
            const scoreStyle = getScoreColor(evaluation.match_score);

            return (
              <div
                key={evaluation.id}
                className={`bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border transition shadow-xs hover:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isSelectedForCompare ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-800'
                }`}
              >
                {/* Left: Info */}
                <div className="flex items-start space-x-4 flex-1">
                  
                  {/* Compare checkbox */}
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={isSelectedForCompare}
                      onChange={() => handleToggleCompare(evaluation.id)}
                      className="w-4 h-4 text-indigo-500 rounded border-slate-700 bg-slate-950 focus:ring-indigo-500 cursor-pointer"
                      title="Select to compare"
                    />
                  </div>

                  {/* Score badge */}
                  <div className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center font-extrabold text-xl shrink-0 ${scoreStyle}`}>
                    <span>{evaluation.match_score}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 -mt-1">/100</span>
                  </div>

                  {/* Candidate and Job details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-base">
                        {evaluation.candidate_name || 'Anonymous Candidate'}
                      </span>
                      {getRecommendationBadge(evaluation.recommendation)}
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                      <span className="flex items-center space-x-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-300">{evaluation.job_title || 'Target Job'}</span>
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">
                        {new Date(evaluation.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed max-w-3xl">
                      {evaluation.summary}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onSelectEvaluation(evaluation)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>

                  <button
                    onClick={() => onDeleteEvaluation(evaluation.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-slate-900/40 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
            <ClipboardCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No Evaluation Records Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Run candidate evaluations in the Screening Studio to populate your screening records.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
