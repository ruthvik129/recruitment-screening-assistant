import React, { FC, useState } from 'react';
import { Resume, Evaluation } from '../types';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Play, 
  Upload, 
  FileText, 
  Search, 
  X, 
  UserCheck, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileUp,
  Loader2
} from 'lucide-react';
import { parseUploadedDocument } from '../utils/fileParser';

interface ResumesManagerProps {
  resumes: Resume[];
  evaluations: Evaluation[];
  onAddResume: (resume: { candidate_name?: string; role_title?: string; resume_text: string }) => Promise<void>;
  onUpdateResume: (id: string, resume: { candidate_name?: string; role_title?: string; resume_text: string }) => Promise<void>;
  onDeleteResume: (id: string) => Promise<void>;
  onScreenResume: (resumeId: string) => void;
}

export const ResumesManager: FC<ResumesManagerProps> = ({
  resumes,
  evaluations,
  onAddResume,
  onUpdateResume,
  onDeleteResume,
  onScreenResume,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);

  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formText, setFormText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileSuccess, setFileSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openCreateModal = () => {
    setEditingResume(null);
    setFormName('');
    setFormRole('');
    setFormText('');
    setFileError(null);
    setFileSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (resume: Resume) => {
    setEditingResume(resume);
    setFormName(resume.candidate_name || '');
    setFormRole(resume.role_title || '');
    setFormText(resume.resume_text);
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
      setFormText(parsed.text);
      if (!formName && parsed.candidateNameSuggestion) {
        setFormName(parsed.candidateNameSuggestion);
      }
      setFileSuccess(`Extracted ${parsed.text.length} characters from ${parsed.fileName}`);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setFileError(err?.message || 'Failed to read document.');
    } finally {
      setIsParsingFile(false);
    }
  };

  // Handle local document file upload (.pdf, .doc, .docx, .txt)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    // Reset file input value so user can re-upload same file if needed
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingResume) {
        await onUpdateResume(editingResume.id, {
          candidate_name: formName || undefined,
          role_title: formRole || undefined,
          resume_text: formText,
        });
      } else {
        await onAddResume({
          candidate_name: formName || undefined,
          role_title: formRole || undefined,
          resume_text: formText,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredResumes = resumes.filter(
    (r) =>
      (r.candidate_name && r.candidate_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.role_title && r.role_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.resume_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="resumes-manager" className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Candidate Profiles & Resumes</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Store and manage candidate experience records for screening evaluations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search candidate profiles..."
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
            <span>Add Candidate Resume</span>
          </button>
        </div>
      </div>

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResumes.map((resume) => {
          const candidateEvals = evaluations.filter((e) => e.resume_id === resume.id);
          const topScore =
            candidateEvals.length > 0
              ? Math.max(...candidateEvals.map((e) => e.match_score))
              : null;

          return (
            <div
              key={resume.id}
              className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xs hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-white leading-snug">
                      {resume.candidate_name || 'Anonymous Candidate'}
                    </h3>
                    <div className="text-xs text-indigo-400 font-semibold">
                      {resume.role_title || 'Applicant'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-500">
                    <button
                      onClick={() => openEditModal(resume)}
                      className="p-1.5 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                      title="Edit Resume"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteResume(resume.id)}
                      className="p-1.5 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed font-sans bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                  {resume.resume_text}
                </p>
              </div>

              {/* Bottom stats and action */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-400">
                  <span>{candidateEvals.length} Screenings</span>
                  {topScore !== null && (
                    <span className="ml-1.5 text-emerald-400 font-semibold">• Top: {topScore}%</span>
                  )}
                </div>

                <button
                  onClick={() => onScreenResume(resume.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold transition"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Screen</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Resume Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-800 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingResume ? 'Edit Candidate Resume' : 'Add Candidate Resume'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Candidate Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Jordan Miller"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Current / Target Role (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 text-slate-100"
                  />
                </div>
              </div>

              {/* Upload file helper with Drag & Drop */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-4 rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center text-center space-y-2 ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2 text-slate-300">
                  {isParsingFile ? (
                    <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                  ) : (
                    <FileUp className="w-5 h-5 text-indigo-400" />
                  )}
                  <span className="font-semibold text-xs text-white">
                    {isParsingFile ? 'Extracting text from document...' : 'Upload Candidate Resume'}
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-400 max-w-sm">
                  Drag & drop or browse files. Supports <strong className="text-indigo-300">PDF (.pdf)</strong>, <strong className="text-indigo-300">Word (.doc, .docx)</strong>, and <strong className="text-indigo-300">Plain Text (.txt)</strong>.
                  <span className="block text-amber-400/90 text-[10px] mt-0.5 font-mono">Note: Markdown (.md) files are not accepted.</span>
                </p>

                <label className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-lg border border-slate-700 cursor-pointer text-xs shadow-xs transition active:scale-95">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Choose File (.pdf, .doc, .docx, .txt)</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {fileError && (
                  <div className="w-full mt-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center space-x-1.5 text-left">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}

                {fileSuccess && (
                  <div className="w-full mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center space-x-1.5 text-left">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{fileSuccess}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Full Extracted Resume Text *
                </label>
                <textarea
                  rows={9}
                  required
                  placeholder="Paste work experience, technical skills, education, certifications, and project accomplishments..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
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
                  {isSubmitting ? 'Saving...' : editingResume ? 'Save Changes' : 'Save Profile'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
