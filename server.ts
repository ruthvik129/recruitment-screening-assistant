import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_JOBS, INITIAL_RESUMES, INITIAL_EVALUATIONS } from './src/sampleData.ts';
import { Job, Resume, Evaluation } from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Persistence Store Setup
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreData {
  jobs: Job[];
  resumes: Resume[];
  evaluations: Evaluation[];
}

function loadStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        jobs: Array.isArray(parsed.jobs) ? parsed.jobs : INITIAL_JOBS,
        resumes: Array.isArray(parsed.resumes) ? parsed.resumes : INITIAL_RESUMES,
        evaluations: Array.isArray(parsed.evaluations) ? parsed.evaluations : INITIAL_EVALUATIONS,
      };
    }
  } catch (err) {
    console.error('Error loading store, using initial seed:', err);
  }

  const initial: StoreData = {
    jobs: INITIAL_JOBS,
    resumes: INITIAL_RESUMES,
    evaluations: INITIAL_EVALUATIONS,
  };
  saveStore(initial);
  return initial;
}

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store:', err);
  }
}

let store = loadStore();

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. API evaluations may fail if called without key.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Prompt Template strictly matching user specifications
const SCREENING_SYSTEM_INSTRUCTION = `You are an expert recruitment screening assistant.

Your task is to evaluate how well a candidate's resume matches a specific job description.

IMPORTANT RULES:

1. Evaluate only information explicitly present in the job description and resume.
2. Do not invent, assume, or infer experience that is not supported by the resume.
3. Do not penalize a candidate for information that is simply absent unless the job description explicitly requires it.
4. Distinguish between REQUIRED and PREFERRED qualifications.
5. Prioritize demonstrated experience and responsibilities over simple keyword matches.
6. Consider equivalent terminology and transferable experience.
   Example: "AWS Lambda" and "serverless AWS functions" may represent related experience.
7. Do not use candidate name, gender, age, nationality, location, university prestige, or other potentially discriminatory attributes when determining the match score.
8. A skill mentioned once without evidence of meaningful usage should not automatically be considered fully satisfied.
9. When making a judgment, provide evidence from the resume.
10. Be conservative when evidence is ambiguous.

SCORING FRAMEWORK:

Calculate an overall match score from 0–100.

Consider:
- Required technical/functional skills: 35%
- Relevant professional experience: 25%
- Responsibilities alignment: 20%
- Required qualifications/certifications: 10%
- Preferred qualifications/skills: 10%

A candidate should not receive a high score merely because many keywords appear in the resume.

RECOMMENDATION:
90–100 = Strong Match
75–89 = Match
60–74 = Partial Match
Below 60 = Weak Match

You must output strictly conforming JSON matching the provided schema.`;

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/data', (req, res) => {
  res.json(store);
});

app.post('/api/reset-samples', (req, res) => {
  store = {
    jobs: INITIAL_JOBS,
    resumes: INITIAL_RESUMES,
    evaluations: INITIAL_EVALUATIONS,
  };
  saveStore(store);
  res.json(store);
});

// Jobs CRUD
app.post('/api/jobs', (req, res) => {
  const { job_title, job_description, department } = req.body;
  if (!job_title || !job_description) {
    return res.status(400).json({ error: 'Job title and description are required.' });
  }
  const newJob: Job = {
    id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    job_title: job_title.trim(),
    job_description: job_description.trim(),
    department: department ? department.trim() : undefined,
    created_at: new Date().toISOString(),
  };
  store.jobs.unshift(newJob);
  saveStore(store);
  res.status(201).json(newJob);
});

app.put('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  const { job_title, job_description, department } = req.body;
  const index = store.jobs.findIndex(j => j.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Job not found.' });
  }
  store.jobs[index] = {
    ...store.jobs[index],
    job_title: job_title ? job_title.trim() : store.jobs[index].job_title,
    job_description: job_description ? job_description.trim() : store.jobs[index].job_description,
    department: department !== undefined ? department.trim() : store.jobs[index].department,
  };
  saveStore(store);
  res.json(store.jobs[index]);
});

app.delete('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  store.jobs = store.jobs.filter(j => j.id !== id);
  store.evaluations = store.evaluations.filter(e => e.job_id !== id);
  saveStore(store);
  res.json({ success: true, id });
});

// Resumes CRUD
app.post('/api/resumes', (req, res) => {
  const { candidate_name, resume_text, role_title } = req.body;
  if (!resume_text) {
    return res.status(400).json({ error: 'Resume text is required.' });
  }
  const newResume: Resume = {
    id: `resume-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    candidate_name: candidate_name ? candidate_name.trim() : undefined,
    role_title: role_title ? role_title.trim() : undefined,
    resume_text: resume_text.trim(),
    created_at: new Date().toISOString(),
  };
  store.resumes.unshift(newResume);
  saveStore(store);
  res.status(201).json(newResume);
});

app.put('/api/resumes/:id', (req, res) => {
  const { id } = req.params;
  const { candidate_name, resume_text, role_title } = req.body;
  const index = store.resumes.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Resume not found.' });
  }
  store.resumes[index] = {
    ...store.resumes[index],
    candidate_name: candidate_name !== undefined ? candidate_name.trim() : store.resumes[index].candidate_name,
    role_title: role_title !== undefined ? role_title.trim() : store.resumes[index].role_title,
    resume_text: resume_text ? resume_text.trim() : store.resumes[index].resume_text,
  };
  saveStore(store);
  res.json(store.resumes[index]);
});

app.delete('/api/resumes/:id', (req, res) => {
  const { id } = req.params;
  store.resumes = store.resumes.filter(r => r.id !== id);
  store.evaluations = store.evaluations.filter(e => e.resume_id !== id);
  saveStore(store);
  res.json({ success: true, id });
});

// Evaluations CRUD & AI Evaluation Engine
app.delete('/api/evaluations/:id', (req, res) => {
  const { id } = req.params;
  store.evaluations = store.evaluations.filter(e => e.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});

// AI Screening evaluation helper
async function performEvaluation(
  jobDescription: string,
  resumeText: string,
  jobTitle?: string,
  candidateName?: string
) {
  const userPrompt = `JOB DESCRIPTION:
${jobTitle ? `Title: ${jobTitle}\n` : ''}${jobDescription}

CANDIDATE RESUME:
${candidateName ? `Candidate: ${candidateName}\n` : ''}${resumeText}`;

  const ai = getAi();
  const modelName = 'gemini-3.7-flash';

  const response = await ai.models.generateContent({
    model: modelName,
    contents: userPrompt,
    config: {
      systemInstruction: SCREENING_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          match_score: {
            type: Type.INTEGER,
            description: 'Overall match score from 0 to 100 calculated using the 5-part scoring framework.',
          },
          recommendation: {
            type: Type.STRING,
            description: 'Strong Match (90-100), Match (75-89), Partial Match (60-74), or Weak Match (below 60)',
          },
          summary: {
            type: Type.STRING,
            description: 'A concise explanation of the overall fit.',
          },
          strengths: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                area: { type: Type.STRING, description: 'Skill or experience area where candidate shines' },
                evidence: { type: Type.STRING, description: 'Specific evidence quoted or cited from the resume' },
              },
              required: ['area', 'evidence'],
            },
          },
          gaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                area: { type: Type.STRING, description: 'Missing or weak area' },
                importance: { type: Type.STRING, description: 'required or preferred' },
                evidence: { type: Type.STRING, description: 'What is missing, weak, or unclear' },
              },
              required: ['area', 'importance', 'evidence'],
            },
          },
          requirement_analysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                requirement: { type: Type.STRING, description: 'Specific requirement extracted from the job description' },
                importance: { type: Type.STRING, description: 'required or preferred' },
                status: { type: Type.STRING, description: 'met, partial, not_met, or unclear' },
                evidence: { type: Type.STRING, description: 'Specific evidence from the resume or explanation why missing' },
              },
              required: ['requirement', 'importance', 'status', 'evidence'],
            },
          },
        },
        required: ['match_score', 'recommendation', 'summary', 'strengths', 'gaps', 'requirement_analysis'],
      },
    },
  });

  const rawText = response.text || '{}';
  const parsed = JSON.parse(rawText);

  // Normalize recommendation if score and label differ slightly
  let matchScore = typeof parsed.match_score === 'number' ? Math.min(100, Math.max(0, parsed.match_score)) : 50;
  let recommendation = parsed.recommendation;
  if (!recommendation) {
    if (matchScore >= 90) recommendation = 'Strong Match';
    else if (matchScore >= 75) recommendation = 'Match';
    else if (matchScore >= 60) recommendation = 'Partial Match';
    else recommendation = 'Weak Match';
  }

  return {
    match_score: matchScore,
    recommendation,
    summary: parsed.summary || 'Evaluation completed.',
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
    requirement_analysis: Array.isArray(parsed.requirement_analysis) ? parsed.requirement_analysis : [],
    model_name: modelName,
  };
}

// Single Screening Evaluation
app.post('/api/evaluate', async (req, res) => {
  try {
    const { job_id, resume_id, job_title, job_description, candidate_name, resume_text } = req.body;

    let targetJobDesc = job_description;
    let targetJobTitle = job_title;
    let targetResumeText = resume_text;
    let targetCandidateName = candidate_name;

    let actualJobId = job_id;
    let actualResumeId = resume_id;

    // Resolve or auto-create job if ID not provided or text passed
    if (job_id) {
      const existingJob = store.jobs.find(j => j.id === job_id);
      if (existingJob) {
        targetJobDesc = existingJob.job_description;
        targetJobTitle = existingJob.job_title;
      }
    } else if (targetJobDesc) {
      const createdJob: Job = {
        id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        job_title: targetJobTitle || 'Untitled Job',
        job_description: targetJobDesc,
        created_at: new Date().toISOString(),
      };
      store.jobs.unshift(createdJob);
      actualJobId = createdJob.id;
    }

    // Resolve or auto-create resume if ID not provided or text passed
    if (resume_id) {
      const existingResume = store.resumes.find(r => r.id === resume_id);
      if (existingResume) {
        targetResumeText = existingResume.resume_text;
        targetCandidateName = existingResume.candidate_name;
      }
    } else if (targetResumeText) {
      const createdResume: Resume = {
        id: `resume-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        candidate_name: targetCandidateName || 'Anonymous Candidate',
        resume_text: targetResumeText,
        created_at: new Date().toISOString(),
      };
      store.resumes.unshift(createdResume);
      actualResumeId = createdResume.id;
    }

    if (!targetJobDesc || !targetResumeText) {
      return res.status(400).json({ error: 'Both Job Description and Resume Text are required for evaluation.' });
    }

    const evaluationResult = await performEvaluation(
      targetJobDesc,
      targetResumeText,
      targetJobTitle,
      targetCandidateName
    );

    const newEvaluation: Evaluation = {
      id: `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      job_id: actualJobId || 'custom-job',
      resume_id: actualResumeId || 'custom-resume',
      match_score: evaluationResult.match_score,
      recommendation: evaluationResult.recommendation,
      summary: evaluationResult.summary,
      strengths: evaluationResult.strengths,
      gaps: evaluationResult.gaps,
      requirement_analysis: evaluationResult.requirement_analysis,
      model_name: evaluationResult.model_name,
      created_at: new Date().toISOString(),
      job_title: targetJobTitle,
      candidate_name: targetCandidateName,
    };

    store.evaluations.unshift(newEvaluation);
    saveStore(store);

    res.status(201).json(newEvaluation);
  } catch (error: any) {
    console.error('Error performing evaluation:', error);
    res.status(500).json({
      error: error?.message || 'Failed to complete candidate evaluation using AI assistant.',
    });
  }
});

// Batch Screening Evaluation for multiple candidates against a job
app.post('/api/batch-evaluate', async (req, res) => {
  try {
    const { job_id, resume_ids } = req.body;
    if (!job_id || !Array.isArray(resume_ids) || resume_ids.length === 0) {
      return res.status(400).json({ error: 'job_id and an array of resume_ids are required.' });
    }

    const job = store.jobs.find(j => j.id === job_id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const results: Evaluation[] = [];
    for (const resumeId of resume_ids) {
      const resume = store.resumes.find(r => r.id === resumeId);
      if (!resume) continue;

      try {
        const evaluationResult = await performEvaluation(
          job.job_description,
          resume.resume_text,
          job.job_title,
          resume.candidate_name
        );

        const newEval: Evaluation = {
          id: `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          job_id: job.id,
          resume_id: resume.id,
          match_score: evaluationResult.match_score,
          recommendation: evaluationResult.recommendation,
          summary: evaluationResult.summary,
          strengths: evaluationResult.strengths,
          gaps: evaluationResult.gaps,
          requirement_analysis: evaluationResult.requirement_analysis,
          model_name: evaluationResult.model_name,
          created_at: new Date().toISOString(),
          job_title: job.job_title,
          candidate_name: resume.candidate_name,
        };

        store.evaluations.unshift(newEval);
        results.push(newEval);
      } catch (subErr) {
        console.error(`Failed to evaluate resume ${resumeId}:`, subErr);
      }
    }

    saveStore(store);
    res.json({ evaluated: results.length, evaluations: results });
  } catch (error: any) {
    console.error('Error in batch evaluation:', error);
    res.status(500).json({ error: error?.message || 'Failed batch evaluation.' });
  }
});

// Vite middleware & static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Recruitment Screening Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

start();
