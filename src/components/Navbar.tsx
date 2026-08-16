import { FC } from 'react';
import { 
  Sparkles, 
  FileText, 
  Users, 
  ClipboardCheck, 
  GitCompare, 
  RotateCcw,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'evaluations' | 'comparison' | 'jobs' | 'resumes';
  setActiveTab: (tab: 'studio' | 'evaluations' | 'comparison' | 'jobs' | 'resumes') => void;
  evaluationCount: number;
  jobCount: number;
  resumeCount: number;
  onResetSamples: () => void;
  onOpenRules: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  evaluationCount,
  jobCount,
  resumeCount,
  onResetSamples,
  onOpenRules
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">ScreenExpert <span className="text-indigo-400">AI</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  Screening Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Objective, Evidence-Based Resume Verification</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              id="nav-tab-studio"
              onClick={() => setActiveTab('studio')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'studio'
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Screening Studio</span>
            </button>

            <button
              id="nav-tab-evaluations"
              onClick={() => setActiveTab('evaluations')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'evaluations'
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Evaluations</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'evaluations' ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {evaluationCount}
              </span>
            </button>

            <button
              id="nav-tab-comparison"
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'comparison'
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Candidates</span>
            </button>

            <button
              id="nav-tab-jobs"
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'jobs'
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Jobs ({jobCount})</span>
            </button>

            <button
              id="nav-tab-resumes"
              onClick={() => setActiveTab('resumes')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'resumes'
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Resumes ({resumeCount})</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-rules-modal"
              onClick={onOpenRules}
              title="View 10 Screening Rules & Scoring Weights"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl border border-indigo-500/30 transition shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">10 Screening Rules</span>
            </button>

            <button
              id="btn-reset-samples"
              onClick={onResetSamples}
              title="Reset Database to Sample Data"
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-xl border border-slate-800 hover:border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg ${
              activeTab === 'studio' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900 border border-slate-800'
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setActiveTab('evaluations')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg ${
              activeTab === 'evaluations' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900 border border-slate-800'
            }`}
          >
            Evaluations ({evaluationCount})
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg ${
              activeTab === 'comparison' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900 border border-slate-800'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg ${
              activeTab === 'jobs' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900 border border-slate-800'
            }`}
          >
            Jobs ({jobCount})
          </button>
          <button
            onClick={() => setActiveTab('resumes')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg ${
              activeTab === 'resumes' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900 border border-slate-800'
            }`}
          >
            Resumes ({resumeCount})
          </button>
        </div>

      </div>
    </header>
  );
};
