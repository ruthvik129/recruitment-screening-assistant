import React, { FC, useState } from 'react';
import { Job, Evaluation } from '../types';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Play, 
  Users, 
  Calendar, 
  Search, 
  Sparkles, 
  X,
  FileText,
  Upload,
  FileUp,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { parseUploadedDocument } from '../utils/fileParser';

interface JobsManagerProps {
  jobs: Job[];
  evaluations: Evaluation[];
  onAddJob: (job: { job_title: string; job_description: string; department?: string }) => Promise<void>;
  onUpdateJob: (id: string, job: { job_title: string; job_description: string; department?: string }) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;
  onScreenForJob: (jobId: string) => void;
}

export const JobsManager: FC<JobsManagerProps> = ({
  jobs,
  evaluations,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  onScreenForJob,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isParsingFile, setIsParsingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileSuccess, setFileSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openCreateModal = () => {
    setEditingJob(null);
    setFormTitle('');
    setFormDepartment('');
    setFormDesc('');
    setFileError(null);
    setFileSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormTitle(job.job_title);
    setFormDepartment(job.department || '');
    setFormDesc(job.job_description);
    setFileError(null);
    setFileSuccess(null);
    setIsModalOpen(true);
  };

  const processFile = async (file: File) => {
    setFileError(null);
    setFileSuccess(null);
    setIsParsingFile(true);

    try {
      const parsed = await parseUploadedDocument(file);
      setFormDesc(parsed.text);
      if (!formTitle) {
        const cleanTitle = parsed.fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setFormTitle(cleanTitle);
      }
      setFileSuccess(`Extracted ${parsed.text.length} characters from ${parsed.fileName}`);
    } catch (err: any) {
      console.error('Job file parsing error:', err);
      setFileError(err?.message || 'Failed to read document.');
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingJob) {
        await onUpdateJob(editingJob.id, {
          job_title: formTitle,
          department: formDepartment,
          job_description: formDesc,
        });
      } else {
        await onAddJob({
          job_title: formTitle,
          department: formDepartment,
          job_description: formDesc,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.department && j.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      j.job_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="jobs-manager" className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Job Requisitions & Descriptions</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage roles, extract required qualifications, and screen candidate pools.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search job requisitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(99,102,241,0.4)] transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Job Requisition</span>
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => {
          const jobEvals = evaluations.filter((e) => e.job_id === job.id);
          const avgScore =
            jobEvals.length > 0
              ? Math.round(jobEvals.reduce((acc, curr) => acc + curr.match_score, 0) / jobEvals.length)
              : null;

          return (
            <div
              key={job.id}
              className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xs hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                      {job.department || 'General'}
                    </span>
                    <h3 className="text-base font-bold text-white leading-snug">{job.job_title}</h3>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-500">
                    <button
                      onClick={() => openEditModal(job)}
                      className="p-1.5 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                      title="Edit Job"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteJob(job.id)}
                      className="p-1.5 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Delete Job"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-sans">
                  {job.job_description}
                </p>
              </div>

              {/* Bottom stats and action */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{jobEvals.length} Screened</span>
                  </span>
                  {avgScore !== null && (
                    <span>• Avg Match: <strong className="text-indigo-300">{avgScore}%</strong></span>
                  )}
                </div>

                <button
                  onClick={() => onScreenForJob(job.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold transition"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Screen Candidates</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-800 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingJob ? 'Edit Job Requisition' : 'Create New Job Requisition'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Architect"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 text-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Department / Team (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Platform Infrastructure"
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 text-slate-100"
                />
              </div>

              {/* Upload JD File Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) await processFile(file);
                }}
                className={`p-3.5 rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center text-center space-y-1.5 ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2 text-slate-300">
                  {isParsingFile ? (
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  ) : (
                    <FileUp className="w-4 h-4 text-indigo-400" />
                  )}
                  <span className="font-semibold text-xs text-white">
                    {isParsingFile ? 'Extracting text from document...' : 'Import Job Description from File'}
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-400">
                  Drag & drop or browse. Supports <strong className="text-indigo-300">PDF (.pdf)</strong>, <strong className="text-indigo-300">Word (.doc, .docx)</strong>, and <strong className="text-indigo-300">Plain Text (.txt)</strong>.
                  <span className="block text-amber-400/90 text-[10px] mt-0.5 font-mono">Note: Markdown (.md) files are not accepted.</span>
                </p>

                <label className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-lg border border-slate-700 cursor-pointer text-xs shadow-xs transition active:scale-95">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Choose Document</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {fileError && (
                  <div className="w-full mt-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center space-x-1.5 text-left">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}

                {fileSuccess && (
                  <div className="w-full mt-1.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center space-x-1.5 text-left">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{fileSuccess}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Full Job Description & Requirements *
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Include role overview, required skills, preferred qualifications, and responsibilities..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 text-slate-100 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-[0_0_12px_rgba(99,102,241,0.4)] transition font-semibold"
                >
                  {isSubmitting ? 'Saving...' : editingJob ? 'Save Changes' : 'Create Requisition'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
