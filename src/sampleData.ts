import { Job, Resume, Evaluation } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-senior-fullstack-001',
    job_title: 'Senior Full Stack Engineer (React & Node.js)',
    department: 'Core Platform Engineering',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    job_description: `Role Overview:
We are looking for a Senior Full Stack Engineer to lead the development of our high-scale cloud applications. You will design, build, and deploy reliable web services and user interfaces.

Required Qualifications & Skills:
- 5+ years of professional full-stack software development experience.
- Deep expertise in TypeScript, React, and modern state management.
- Strong backend development experience with Node.js and Express or Fastify.
- Proven hands-on experience designing relational databases and writing complex SQL (PostgreSQL preferred).
- Hands-on experience architecting and deploying microservices or serverless applications (AWS Lambda / ECS / Cloud Run).
- Proficiency with CI/CD pipelines (GitHub Actions, GitLab CI) and automated testing frameworks (Jest, Playwright).
- Strong track record of owning end-to-end features from technical design through production deployment and monitoring.

Preferred Qualifications:
- Experience with GraphQL API design.
- Hands-on experience with Redis caching and event messaging (RabbitMQ, Kafka).
- Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience.
- Experience mentoring junior engineers and leading code reviews.

Key Responsibilities:
- Architect, build, and maintain robust client-facing web applications and backend APIs.
- Optimize database queries, API response latencies, and frontend web vitals.
- Collaborate with Product and Design teams to translate business requirements into clean technical architectures.
- Ensure 99.9% uptime by establishing automated testing, observability, and alerting protocols.`
  },
  {
    id: 'job-lead-ai-engineer-002',
    job_title: 'Lead AI / ML Solutions Engineer',
    department: 'Applied Intelligence',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    job_description: `Role Overview:
We are seeking an experienced Lead AI / ML Solutions Engineer to architect production LLM pipelines, RAG systems, and AI-driven automation services.

Required Qualifications:
- 4+ years of professional engineering experience with Python and ML frameworks (PyTorch, TensorFlow, Hugging Face).
- Proven experience building and deploying generative AI / LLM applications in production (OpenAI API, Gemini API, Anthropic, or open-weight models).
- Deep understanding of Retrieval-Augmented Generation (RAG), vector databases (Pinecone, Qdrant, Milvus, pgvector), and embedding strategies.
- Experience building scalable REST/gRPC backend services (FastAPI, Python AsyncIO, Docker).
- Hands-on experience with cloud infrastructure (AWS/GCP/Azure) and ML deployment tools (Ray, Triton, SageMaker, or Vertex AI).

Preferred Qualifications:
- Master's or Ph.D. in Computer Science, Machine Learning, Computational Linguistics, or related quantitative field.
- Experience with model fine-tuning (LoRA, QLoRA) and prompt evaluation frameworks.
- Background in high-throughput data processing (Apache Spark, Kafka).

Key Responsibilities:
- Lead technical design and implementation of enterprise AI agent workflows and knowledge retrieval pipelines.
- Establish evaluation benchmarks, latency optimizations, and hallucination reduction guardrails for LLMs.
- Partner with security and platform teams to ensure data privacy, compliance, and enterprise governance.`
  },
  {
    id: 'job-devops-sre-003',
    job_title: 'Senior DevOps & Reliability Engineer (SRE)',
    department: 'Infrastructure & Cloud',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    job_description: `Role Overview:
Join our Infrastructure team as a Senior DevOps / SRE Engineer ensuring the scalability, reliability, and security of our multi-region Kubernetes clusters and cloud infrastructure.

Required Qualifications:
- 4+ years of dedicated DevOps, SRE, or Cloud Infrastructure engineering experience.
- Strong proficiency with Kubernetes (EKS/GKE) administration, Helm charts, and container orchestration.
- Advanced Infrastructure as Code (IaC) experience using Terraform or OpenTofu.
- Deep hands-on experience with AWS cloud services (VPC, IAM, EKS, RDS, S3, CloudWatch).
- Strong Linux systems administration and scripting abilities (Bash, Python, or Go).
- Experience configuring centralized monitoring, logging, and tracing (Prometheus, Grafana, Datadog, OpenTelemetry).

Preferred Qualifications:
- AWS Certified Solutions Architect or CKA (Certified Kubernetes Administrator) certification.
- Experience with zero-trust networking, service mesh (Istio, Linkerd), and SOC2 compliance automation.
- Experience managing multi-region failover and disaster recovery drills.

Key Responsibilities:
- Manage and scale production Kubernetes clusters hosting hundreds of microservices.
- Automate cloud infrastructure provisioning through version-controlled Terraform modules.
- Reduce MTTR and improve system resilience by instituting automated SLO tracking and incident post-mortems.`
  }
];

export const INITIAL_RESUMES: Resume[] = [
  {
    id: 'resume-alex-rivera-001',
    candidate_name: 'Alex Rivera',
    role_title: 'Senior Full Stack Engineer',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    resume_text: `ALEX RIVERA
Email: alex.rivera@example.com | Portfolio: alexrivera.dev | LinkedIn: linkedin.com/in/alex-rivera-dev

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with over 6 years of experience designing and scaling web applications, microservices, and distributed backend systems. Expert in TypeScript, React, Node.js, PostgreSQL, and AWS serverless architectures. Proven history of mentoring engineering teams and delivering 99.95% SLA services.

CORE TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL
- Frontend: React 18, Next.js, Redux Toolkit, Tailwind CSS, Playwright, Jest
- Backend: Node.js, Express, Fastify, NestJS, REST APIs, GraphQL, tRPC
- Data & Cloud: PostgreSQL, DynamoDB, Redis, AWS (Lambda, ECS, S3, CloudFront, API Gateway), Docker
- DevOps & Tools: GitHub Actions CI/CD, Terraform, Datadog, Jest, Git

PROFESSIONAL EXPERIENCE

Senior Full Stack Engineer | Apex Cloud Solutions (2022 – Present)
- Architected and deployed a multi-tenant enterprise dashboard serving 120,000+ daily active users using React, TypeScript, and Node.js microservices.
- Re-architected legacy monolithic services into AWS serverless functions (Lambda with TypeScript and PostgreSQL Aurora), reducing infrastructure costs by 34% and cutting p95 response latencies from 420ms to 110ms.
- Designed schema migrations, indexing strategies, and optimized complex SQL queries in PostgreSQL handling over 8M transactions daily.
- Implemented robust CI/CD pipelines via GitHub Actions with automated unit tests (Jest) and end-to-end regression suites (Playwright), maintaining 92% code coverage.
- Mentored a cohort of 5 mid-level engineers and established team-wide code review standards and architecture RFC processes.

Full Stack Software Engineer | Horizon Fintech Labs (2019 – 2022)
- Built customer-facing financial dashboards using React, Redux, and Node.js / Express backend microservices.
- Integrated GraphQL endpoints with Redis caching layer, improving data retrieval speeds by 45%.
- Implemented automated payment processing pipelines adhering to PCI-DSS compliance standards.
- Actively participated in on-call rotations, maintaining 99.9% uptime across production services.

EDUCATION & CERTIFICATIONS
- B.S. in Computer Science | University of California (2015 – 2019)
- AWS Certified Solutions Architect – Associate (2023)`
  },
  {
    id: 'resume-jordan-chen-002',
    candidate_name: 'Jordan Chen',
    role_title: 'Junior Frontend Developer',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    resume_text: `JORDAN CHEN
Email: j.chen@example.com | GitHub: github.com/jordanchen-code

SUMMARY
Enthusiastic Web Developer with 1.5 years of experience building responsive frontend interfaces using HTML, CSS, JavaScript, and React. Passionate about modern UI/UX design and eager to grow full-stack engineering skills.

TECHNICAL SKILLS
- Frontend: React, JavaScript, HTML5, CSS3, Tailwind CSS, Vite
- Basic Backend: Node.js (basics), Express (beginner tutorials), MongoDB
- Tools: Git, VS Code, npm, Figma

EXPERIENCE
Junior Frontend Developer | PixelCraft Studio (2024 – Present)
- Developed responsive marketing landing pages and client UI components using React and Tailwind CSS.
- Collaborated with UI designers to implement pixel-perfect user interfaces across mobile and desktop devices.
- Refactored legacy JavaScript code to modern React components, improving page load speeds by 20%.

Web Development Intern | Nova Web Agency (2023 – 2024)
- Built interactive web pages and fixed CSS/HTML responsiveness bugs for 12+ client websites.
- Assisted in integrating third-party contact form APIs and analytics tracking scripts.

EDUCATION & PROJECTS
- Associate Degree in Web Development | City College (2021 – 2023)
- Personal E-commerce project: Built a single-page shopping cart with React and local storage.`
  },
  {
    id: 'resume-maya-patel-003',
    candidate_name: 'Maya Patel',
    role_title: 'Senior AI & Machine Learning Engineer',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    resume_text: `MAYA PATEL, M.S.
Email: maya.patel.ai@example.com | GitHub: github.com/mayapatel-ai | Google Scholar: scholar.google.com/mayapatel

SUMMARY
Senior AI / Machine Learning Engineer with 5+ years of experience architecting deep learning solutions, LLM systems, and enterprise RAG pipelines. Specialized in Python, PyTorch, vector databases, and scalable inference backends on AWS/GCP.

TECHNICAL PROFICIENCIES
- ML/AI: Python, PyTorch, Hugging Face Transformers, LangChain, LlamaIndex, vLLM, DeepSpeed
- Generative AI: Fine-tuning (LoRA, QLoRA), Prompt Optimization, Evaluation Frameworks (Ragas, TruLens)
- Vector DBs & Search: Qdrant, Pinecone, Milvus, pgvector, FAISS, hybrid sparse/dense search
- Backend & Cloud: FastAPI, Docker, Ray Serve, Triton Inference Server, AWS (SageMaker, EKS, S3), GCP Vertex AI

EXPERIENCE
Senior AI Engineer | Cognitive Nexus Technologies (2022 – Present)
- Architected enterprise multi-agent RAG system querying over 4 million unstructured legal and technical documents with sub-second retrieval latency using Qdrant vector database and hybrid search.
- Fine-tuned domain-specific open-weight models (Llama-3 and Mistral) using QLoRA, achieving 28% higher accuracy on internal domain benchmarks while reducing token costs by 60%.
- Designed and deployed high-throughput FastAPI inference microservices with Ray Serve on AWS EKS, handling 400+ requests per second with strict P99 latency SLA (<250ms).
- Built automated LLM hallucination and safety evaluation pipelines using custom synthetic benchmark datasets.

Machine Learning Engineer | DataVision Labs (2020 – 2022)
- Developed NLP classification pipelines and BERT-based entity extraction services in PyTorch.
- Automated ML training workflows using Kubeflow pipelines and Docker containers on GCP.
- Collaborated with software engineers to expose ML predictions via asynchronous REST APIs.

EDUCATION
- M.S. in Computer Science (Specialization in Machine Learning) | Stanford University (2018 – 2020)
- B.S. in Computer Engineering | Georgia Tech (2014 – 2018)`
  }
];

export const INITIAL_EVALUATIONS: Evaluation[] = [
  {
    id: 'eval-alex-rivera-fullstack',
    job_id: 'job-senior-fullstack-001',
    resume_id: 'resume-alex-rivera-001',
    job_title: 'Senior Full Stack Engineer (React & Node.js)',
    candidate_name: 'Alex Rivera',
    match_score: 94,
    recommendation: 'Strong Match',
    model_name: 'gemini-3.7-flash',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    summary: 'Candidate is an exceptional fit for the Senior Full Stack Engineer role, demonstrating 6+ years of full-stack experience with deep mastery in TypeScript, React, Node.js, PostgreSQL, and AWS serverless architectures. They possess a proven record of leading architectural migrations, optimizing large-scale relational databases, mentoring engineers, and maintaining strict CI/CD and reliability standards.',
    strengths: [
      {
        area: 'Senior Full-Stack & TypeScript/React Expertise',
        evidence: 'Candidate has 6+ years of professional experience building multi-tenant web applications with React 18, TypeScript, and Redux Toolkit for 120,000+ DAU.'
      },
      {
        area: 'Serverless & Node.js Microservices Architecture',
        evidence: 'Re-architected monolithic services into AWS serverless functions (Lambda, Node.js, PostgreSQL Aurora), cutting p95 response latencies from 420ms to 110ms.'
      },
      {
        area: 'Relational Database & SQL Optimization',
        evidence: 'Proven experience designing PostgreSQL schema migrations, indexing strategies, and optimizing queries handling over 8M daily transactions.'
      },
      {
        area: 'CI/CD, Testing & Technical Leadership',
        evidence: 'Implemented GitHub Actions pipelines with Jest and Playwright (92% coverage); mentored a cohort of 5 engineers and established RFC standards.'
      }
    ],
    gaps: [
      {
        area: 'Event Messaging Platforms (Kafka / RabbitMQ)',
        importance: 'preferred',
        evidence: 'While candidate demonstrates experience with Redis caching and GraphQL, explicit experience with distributed message brokers like Kafka or RabbitMQ is not mentioned in the resume.'
      }
    ],
    requirement_analysis: [
      {
        requirement: '5+ years of professional full-stack software development experience',
        importance: 'required',
        status: 'met',
        evidence: 'Resume documents 6+ years across Apex Cloud Solutions (2022-Present) and Horizon Fintech Labs (2019-2022).'
      },
      {
        requirement: 'Deep expertise in TypeScript, React, and modern state management',
        importance: 'required',
        status: 'met',
        evidence: 'Demonstrated extensive usage of React 18, TypeScript, Redux Toolkit, and Next.js in production enterprise applications.'
      },
      {
        requirement: 'Strong backend development experience with Node.js and Express / Fastify',
        importance: 'required',
        status: 'met',
        evidence: 'Extensive production experience building backend microservices with Node.js, Express, Fastify, and NestJS.'
      },
      {
        requirement: 'Relational database design and complex SQL optimization (PostgreSQL)',
        importance: 'required',
        status: 'met',
        evidence: 'Designed PostgreSQL schemas, migrations, and indexing strategies handling 8M+ daily transactions at Apex Cloud Solutions.'
      },
      {
        requirement: 'Serverless or microservices architecture deployment (AWS Lambda / ECS)',
        importance: 'required',
        status: 'met',
        evidence: 'Directly migrated legacy services to AWS Lambda serverless functions and ECS with TypeScript.'
      },
      {
        requirement: 'CI/CD pipelines and automated testing frameworks (Jest, Playwright)',
        importance: 'required',
        status: 'met',
        evidence: 'Created GitHub Actions CI/CD workflows and end-to-end automated testing suites with Jest and Playwright maintaining 92% coverage.'
      },
      {
        requirement: 'GraphQL API design & Redis caching',
        importance: 'preferred',
        status: 'met',
        evidence: 'Integrated GraphQL endpoints with a Redis caching layer at Horizon Fintech Labs, improving data retrieval speeds by 45%.'
      },
      {
        requirement: 'B.S. in Computer Science or equivalent',
        importance: 'preferred',
        status: 'met',
        evidence: 'Earned B.S. in Computer Science from University of California (2015-2019).'
      },
      {
        requirement: 'Distributed Event Messaging (RabbitMQ / Kafka)',
        importance: 'preferred',
        status: 'not_met',
        evidence: 'No mention of RabbitMQ or Kafka in candidate experience or technical skill listings.'
      }
    ]
  },
  {
    id: 'eval-jordan-chen-fullstack',
    job_id: 'job-senior-fullstack-001',
    resume_id: 'resume-jordan-chen-002',
    job_title: 'Senior Full Stack Engineer (React & Node.js)',
    candidate_name: 'Jordan Chen',
    match_score: 38,
    recommendation: 'Weak Match',
    model_name: 'gemini-3.7-flash',
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    summary: 'Candidate does not meet the core seniority and technical depth required for the Senior Full Stack Engineer position. With only 1.5 years of total professional experience primarily focused on frontend layout styling (HTML/CSS/React), the candidate lacks required 5+ years seniority, complex PostgreSQL database optimization, production Node.js microservices architecture, serverless AWS deployments, and automated CI/CD pipeline management.',
    strengths: [
      {
        area: 'Fundamental Frontend & React Skills',
        evidence: 'Demonstrated experience developing responsive web components with React, Tailwind CSS, and JavaScript.'
      }
    ],
    gaps: [
      {
        area: 'Years of Professional Experience (Seniority)',
        importance: 'required',
        evidence: 'Job requires 5+ years of senior-level experience; candidate has only 1.5 years of junior frontend work.'
      },
      {
        area: 'Production Backend & Microservices (Node.js)',
        importance: 'required',
        evidence: 'Resume only lists beginner/tutorial-level knowledge of Node.js with no demonstrated production backend services.'
      },
      {
        area: 'Relational Database & SQL (PostgreSQL)',
        importance: 'required',
        evidence: 'No evidence of SQL, PostgreSQL, query optimization, or relational schema design.'
      },
      {
        area: 'Cloud Infrastructure & Serverless (AWS Lambda)',
        importance: 'required',
        evidence: 'No evidence of AWS Lambda, ECS, Cloud Run, or serverless cloud architecture.'
      },
      {
        area: 'CI/CD & Automated Testing (Jest, Playwright)',
        importance: 'required',
        evidence: 'No mention of CI/CD pipelines, automated testing, Jest, or Playwright.'
      }
    ],
    requirement_analysis: [
      {
        requirement: '5+ years of professional full-stack software development experience',
        importance: 'required',
        status: 'not_met',
        evidence: 'Candidate has 1.5 years of junior frontend experience (2023-Present).'
      },
      {
        requirement: 'Deep expertise in TypeScript, React, and modern state management',
        importance: 'required',
        status: 'partial',
        evidence: 'Uses React and JavaScript for UI components, but lacks demonstrated TypeScript and advanced state management depth.'
      },
      {
        requirement: 'Strong backend development experience with Node.js',
        importance: 'required',
        status: 'not_met',
        evidence: 'Only lists basic Node.js tutorials; no production backend development demonstrated.'
      },
      {
        requirement: 'Relational database design and complex SQL optimization (PostgreSQL)',
        importance: 'required',
        status: 'not_met',
        evidence: 'Resume lists beginner MongoDB; no SQL or PostgreSQL experience present.'
      },
      {
        requirement: 'Serverless / Cloud deployment (AWS Lambda / ECS)',
        importance: 'required',
        status: 'not_met',
        evidence: 'No cloud deployment or AWS experience found in resume.'
      },
      {
        requirement: 'CI/CD pipelines and automated testing frameworks',
        importance: 'required',
        status: 'not_met',
        evidence: 'No evidence of GitHub Actions, Jest, Playwright, or test suites.'
      }
    ]
  }
];
