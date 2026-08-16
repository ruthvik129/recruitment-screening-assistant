export type RecommendationType = 'Strong Match' | 'Match' | 'Partial Match' | 'Weak Match';

export type ImportanceType = 'required' | 'preferred';

export type RequirementStatusType = 'met' | 'partial' | 'not_met' | 'unclear';

export interface Strength {
  area: string;
  evidence: string;
}

export interface Gap {
  area: string;
  importance: ImportanceType;
  evidence: string;
}

export interface RequirementAnalysis {
  requirement: string;
  importance: ImportanceType;
  status: RequirementStatusType;
  evidence: string;
}

export interface Job {
  id: string;
  job_title: string;
  job_description: string;
  department?: string;
  created_at: string;
}

export interface Resume {
  id: string;
  candidate_name?: string;
  resume_text: string;
  role_title?: string;
  created_at: string;
}

export interface Evaluation {
  id: string;
  job_id: string;
  resume_id: string;
  match_score: number; // 0–100
  recommendation: RecommendationType;
  summary: string;
  strengths: Strength[];
  gaps: Gap[];
  requirement_analysis: RequirementAnalysis[];
  model_name: string;
  created_at: string;
  // Optional enriched properties for display
  job_title?: string;
  candidate_name?: string;
}

export interface ScreeningRequest {
  job_id?: string;
  resume_id?: string;
  job_title: string;
  job_description: string;
  candidate_name?: string;
  resume_text: string;
}

export interface EvaluationScoreBreakdown {
  requiredSkillsScore: number; // weight: 35%
  experienceScore: number; // weight: 25%
  responsibilitiesScore: number; // weight: 20%
  requiredQualificationsScore: number; // weight: 10%
  preferredQualificationsScore: number; // weight: 10%
}
