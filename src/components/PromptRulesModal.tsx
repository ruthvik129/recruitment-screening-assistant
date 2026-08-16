import { FC } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Scale, Target, Percent } from 'lucide-react';

interface PromptRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptRulesModal: FC<PromptRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-800 overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Screening Assistant Evaluation Framework</h3>
              <p className="text-xs text-slate-400">Strict Rules, Weightings & Fairness Guardrails</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Scoring Framework (Weights) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4.5">
            <div className="flex items-center space-x-2 text-indigo-300 font-semibold mb-3.5">
              <Percent className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Overall Match Score Framework (0–100)</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 shadow-xs">
                <div className="text-xl font-bold text-indigo-400">35%</div>
                <div className="font-semibold text-slate-200 mt-0.5">Required Skills</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Core technical & functional competencies</div>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 shadow-xs">
                <div className="text-xl font-bold text-indigo-400">25%</div>
                <div className="font-semibold text-slate-200 mt-0.5">Professional Experience</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Seniority, depth & project longevity</div>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 shadow-xs">
                <div className="text-xl font-bold text-indigo-400">20%</div>
                <div className="font-semibold text-slate-200 mt-0.5">Responsibilities Alignment</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Demonstrated ownership & daily impact</div>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 shadow-xs">
                <div className="text-xl font-bold text-indigo-400">10%</div>
                <div className="font-semibold text-slate-200 mt-0.5">Required Quals / Certs</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Mandatory degrees, licenses & certs</div>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 shadow-xs">
                <div className="text-xl font-bold text-indigo-400">10%</div>
                <div className="font-semibold text-slate-200 mt-0.5">Preferred Qualifications</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Bonus domains & nice-to-haves</div>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 shadow-xs flex flex-col justify-center">
                <div className="font-semibold text-emerald-400">Anti-Keyword Gaming</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Keyword counts alone do not produce high scores.</div>
              </div>
            </div>
          </div>

          {/* Recommendation Thresholds */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recommendation Tiers</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <span className="font-bold block text-emerald-400">Strong Match</span>
                <span className="text-slate-400 text-[11px]">90 – 100 score</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <span className="font-bold block text-blue-400">Match</span>
                <span className="text-slate-400 text-[11px]">75 – 89 score</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <span className="font-bold block text-amber-400">Partial Match</span>
                <span className="text-slate-400 text-[11px]">60 – 74 score</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <span className="font-bold block text-rose-400">Weak Match</span>
                <span className="text-slate-400 text-[11px]">Below 60 score</span>
              </div>
            </div>
          </div>

          {/* 10 Strict Evaluation Rules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              <span>10 Strict Screening Rules</span>
            </h4>
            <ol className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start space-x-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <span className="font-bold text-indigo-400 min-w-[20px]">1.</span>
                <span><strong className="text-slate-100">Explicit Information Only:</strong> Evaluate only information explicitly present in the job description and resume.</span>
              </li>
              <li className="flex items-start space-x-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <span className="font-bold text-indigo-400 min-w-[20px]">2.</span>
                <span><strong className="text-slate-100">No Speculation:</strong> Do not invent, assume, or infer experience that is not supported by the resume.</span>
              </li>
              <li className="flex items-start space-x-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <span className="font-bold text-indigo-400 min-w-[20px]">3.</span>
                <span><strong className="text-slate-100">No Absentee Penalty:</strong> Do not penalize a candidate for information that is simply absent unless the job description explicitly requires it.</span>
              </li>
              <li className="flex items-start space-x-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <span className="font-bold text-indigo-400 min-w-[20px]">4.</span>
                <span><strong className="text-slate-100">Requirement Tiering:</strong> Explicitly distinguish between REQUIRED and PREFERRED qualifications.</span>
              </li>
              <li className="flex items-start space-x-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <span className="font-bold text-indigo-400 min-w-[20px]">5.</span>
                <span><strong className="text-slate-100">Demonstrated Depth:</strong> Prioritize demonstrated experience and responsibilities over simple keyword matches.</span>
              </li>
              <li className="flex items-start space-x-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <span className="font-bold text-indigo-400 min-w-[20px]">6.</span>
                <span><strong className="text-slate-100">Transferable Equivalence:</strong> Consider equivalent terminology and transferable experience (e.g., "AWS Lambda" and "serverless AWS functions").</span>
              </li>
              <li className="flex items-start space-x-2.5 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/20">
                <span className="font-bold text-emerald-400 min-w-[20px]">7.</span>
                <span><strong className="text-emerald-300">Fairness & Anti-Bias:</strong> Do not use candidate name, gender, age, nationality, location, university prestige, or other potentially discriminatory attributes.</span>
              </li>
              <li className="flex items-start space-x-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <span className="font-bold text-indigo-400 min-w-[20px]">8.</span>
                <span><strong className="text-slate-100">Meaningful Evidence Standard:</strong> A skill mentioned once without evidence of meaningful usage is not automatically considered fully satisfied.</span>
              </li>
              <li className="flex items-start space-x-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <span className="font-bold text-indigo-400 min-w-[20px]">9.</span>
                <span><strong className="text-slate-100">Evidentiary Proof:</strong> Every judgment must provide direct evidence quoted or cited from the resume.</span>
              </li>
              <li className="flex items-start space-x-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <span className="font-bold text-indigo-400 min-w-[20px]">10.</span>
                <span><strong className="text-slate-100">Conservative Ambiguity Rule:</strong> Be conservative when evidence is ambiguous.</span>
              </li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-[0_0_12px_rgba(99,102,241,0.4)] transition"
          >
            Understood & Close
          </button>
        </div>

      </div>
    </div>
  );
};
