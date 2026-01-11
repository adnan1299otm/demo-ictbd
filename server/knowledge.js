/**
 * ICT Bangladesh Knowledge Base
 * 
 * This file contains structured knowledge about ICT Bangladesh
 * courses, programs, admissions, and services.
 * 
 * IMPORTANT: Do not infer or merge data. Only store what is explicitly provided.
 */

const knowledge = {
    courses: [
        {
            course_name: "Software Engineering",
            levels: [
                {
                    level: "Level 1",
                    title: "AI-Based Programming Languages",
                    technologies: ["C#", "Python"],
                    description: "Python & C# - API-Based Programming A to Z. This level covers environment setup, programming fundamentals, decision making, data collections and loops, OOP basics (inheritance, encapsulation, abstraction, polymorphism), string manipulation, file and exception handling, and web app development with ASP.NET Core or Python.",
                    skills: "Environment Setup (C# & Python), Programming Fundamentals (Syntax, Variables, User Interaction), Decision Making (Operators & Conditional Logic), Data Collections and Loops, OOP Basics (Classes, Objects, Inheritance, Encapsulation), Abstraction & Polymorphism, String Manipulation and Extension Methods, File & Exception Handling, Web App Development with MVC Pattern",
                    outcome: "Comprehensive programming examination (Total 100 marks: 5 MOQ, 25 MCQ, 70 Written). Students will gain foundational programming skills in C# and Python, understand object-oriented programming concepts, and build basic web applications."
                },
                {
                    level: "Level 2",
                    title: "AI Database Engineering",
                    technologies: ["SQL", "PostgreSQL", "MSSQL"],
                    description: "PostgreSQL, MSSQL, AI Vector Database, Database Administrator, Structured Query Language (SQL) A to Z. This level covers database management systems, SQL Server and PostgreSQL installation and setup, table design, data manipulation, ER diagrams and relationships, views and joins, advanced filtering, real-world database projects, and database administration including user management, import/export, and backup/restore.",
                    skills: "DBMS Overview and Setup (MSSQL Server and PostgreSQL), SQL Basics and Table Design, Data Manipulation (INSERT, UPDATE, DELETE, SELECT), ER Diagram Design and Relationships (One-to-One, One-to-Many, Many-to-Many), Views and Joins (All Types), Advanced SQL Filtering (WHERE, LIKE, IN, BETWEEN), Database Project Design (Ticket System), Database Administration (User Management, Permissions, Backup/Restore, Import/Export)",
                    outcome: "Database project and SQL test (Total 100 marks: 25 MCQ & 75 Written). Students will be able to design relational databases, write complex SQL queries, manage database systems, and implement real-world database solutions."
                },
                {
                    level: "Level 3",
                    title: "AI-Based Software Engineering",
                    technologies: ["Frontend", "Backend", "APIs", "Full-Stack Development"],
                    description: "Software Engineering (SDLC), Database Design, Web Application, UI/UX, Project Design, API Deployment, Mobile Application, Desktop Application, Deployment. This level covers version control with Git & GitHub, SDLC and project architecture, database planning and design, real-world project architecture (N-tier, MVC, Clean Architecture), UI/UX design using Figma, Web API development (.NET/FastAPI), Admin application development, Web application development using React, Mobile app development using Flutter, and project deployment with IIS and hosting configuration.",
                    skills: "Git & GitHub (Version Control, Branching, Merging, Conflict Resolution), SDLC and Architecture Design (N-tier, MVC, Clean Architecture), Database Design (PostgreSQL/SQL, ER Diagram, Security), UI/UX Design using Figma (Responsive and Adaptive Design, Color Theory, Branding), Web API Development (ASP.NET Core / FastAPI, Authentication with JWT, Testing with Postman), Admin Application Development (Admin Templates, Database Integration, Role-Based Access), Web Application Development (React, API Integration, Form Handling), Mobile App Development (Flutter, UI Design, API Integration, CRUD Operations), Project Deployment (IIS, Domain & Hosting Configuration)",
                    outcome: "Final project deployment and career guidelines. Students will be able to design and develop full-stack applications (web and mobile), implement secure APIs, deploy production-ready software, and prepare for software engineering careers including freelancing and job interviews."
                }
            ],
            overall_outcome: "Learners gain strong foundations in programming, databases, and full-stack software engineering."
        },
        {
            course_name: "Generative AI Engineering",
            levels: [
                {
                    level: "Level 4",
                    title: "Generative AI Engineering",
                    technologies: ["RAG", "LLMs", "Vector Databases"],
                    description: "Mastering Generative AI. This level covers Introduction to Artificial Intelligence (history, evolution, narrow vs general vs generative AI, applications), AI Environment Setup (Python, PyTorch, TensorFlow, Transformers, Google Colab, Hugging Face), Large Language Models (GPT, LLaMA, Mistral, Claude, Gemini, training principles, tokenization), Prompt Engineering (zero-shot, few-shot, chain-of-thought, templates), Retrieval-Augmented Generation (RAG workflow, QA systems, knowledge chatbots), Vector Databases (Pinecone, Weaviate, FAISS, Milvus, ChromaDB), Embeddings (Word2Vec, BERT, Sentence Transformers), GenAI Tools (LangChain, LlamaIndex, OpenAI & Anthropic APIs, Hugging Face, Ollama), AI Chatbots (architecture, session memory, personalization, multi-turn conversations, deployment channels), and AI-Based Application Deployment (Docker, FastAPI, Traefik/NGINX, cloud deployment on AWS, Azure, GCP, Render).",
                    skills: "Introduction to AI (History, Evolution, Applications, Case Studies), AI Environment Setup (Python, PyTorch, TensorFlow, Transformers, Google Colab, GPU/CPU), Large Language Models (GPT, LLaMA, Mistral, Claude, Gemini, Training, Tokenization), Prompt Engineering (Zero-shot, Few-shot, Chain-of-thought, Templates, Prompt Injection Mitigation), Retrieval-Augmented Generation (RAG Workflow, Embeddings, Vector Search, QA Systems), Vector Databases (Pinecone, Weaviate, FAISS, Milvus, ChromaDB, Indexing, ANN, Cosine Similarity), Embeddings (Word2Vec, BERT, Sentence Transformers, Semantic Similarity, Clustering), GenAI Tools (LangChain, LlamaIndex, OpenAI/Anthropic APIs, Hugging Face Hub, Ollama, vLLM), AI Chatbots (Architecture, Session Memory, Personalization, Multi-turn Conversations, Deployment Channels), AI Application Deployment (Docker, FastAPI, Traefik/NGINX, SSL, Cloud Deployment)",
                    outcome: "Hands-on chatbot project with RAG, embeddings, and vector database. Fully deployed AI application accessible online. Course completion certificate from ICT Bangladesh. Students will master generative AI concepts, build and deploy production-ready AI chatbots, and gain expertise in modern AI tools and frameworks."
                }
            ],
            overall_outcome: "Learners develop advanced skills in building and deploying Generative AI-powered systems."
        }
    ],

    programs: [
        {
            program_name: "Professional Software Engineering & Generative AI Program",
            description: "A structured professional training program by ICT Bangladesh consisting of Software Engineering (Levels 1–3) followed by advanced Generative AI Engineering (Level 4).",
            structure: [
                "Software Engineering – Level 1 to Level 3",
                "Generative AI Engineering – Level 4"
            ],
            outcome: "Graduates become industry-ready software engineers with advanced Generative AI expertise."
        }
    ],

    admissions: [
        {
            eligibility: "Open to students, professionals, and anyone interested in building a career in Software Engineering or AI.",
            process: "Contact our admissions office or visit us directly to enroll. 50% Scholarship available for eligible candidates.",
            required_documents: "Contact admission office for details: +880 9613-820011 or visit 7200 Lake Ellenor Dr, Suite 108 Orlando, FL-32809 (USA Office) / Local Office."
        }
    ],

    services: [
        {
            service_name: "Software Engineering Training Program",
            description: "A structured professional software engineering training program offered by ICT Bangladesh, organized into progressive levels (Level 1 to Level 4). The program focuses on building strong foundations, practical development skills, real-world problem solving, and industry-ready software engineering capabilities."
        },
        {
            service_name: "Generative AI & AI Engineering Training",
            description: "Specialized training focused on Generative AI concepts, AI-assisted software development, modern AI tools, and applied artificial intelligence for real-world use cases. This service prepares learners to work with contemporary AI technologies alongside software engineering practices."
        }
    ],

    general_info: [
        {
            topic: "About ICT Bangladesh",
            content: "ICT Bangladesh provides software training, IT consulting, and career development programs for students and professionals. Business Type: ICT & Training Services. Main Goal: Provide ICT education and services to build skilled professionals. Target Audience: Students, professionals, job seekers, and IT enthusiasts. Brand Tone: Professional, helpful, and educational. Communication Style: Clear, simple, and informative."
        }
    ]
};

/**
 * Get all knowledge as a formatted string for AI context
 */
function getKnowledgeContext() {
    let context = "# ICT Bangladesh Official Knowledge Base\n\n";

    // Courses
    if (knowledge.courses.length > 0) {
        context += "## Courses\n\n";
        knowledge.courses.forEach(course => {
            context += `### ${course.course_name || 'N/A'}\n`;
            if (course.levels && course.levels.length > 0) {
                course.levels.forEach(lvl => {
                    context += `#### ${lvl.level}: ${lvl.title}\n`;
                    if (lvl.technologies) context += `- Technologies: ${lvl.technologies.join(', ')}\n`;
                    if (lvl.description) context += `- Description: ${lvl.description}\n`;
                    if (lvl.skills) context += `- Skills: ${lvl.skills}\n`;
                    if (lvl.outcome) context += `- Outcome: ${lvl.outcome}\n`;
                    context += "\n";
                });
            }
            if (course.overall_outcome) context += `**Overall Outcome:** ${course.overall_outcome}\n\n`;
        });
    }

    // Programs
    if (knowledge.programs.length > 0) {
        context += "## Programs\n\n";
        knowledge.programs.forEach(program => {
            context += `### ${program.program_name || 'N/A'}\n`;
            if (program.description) context += `- Description: ${program.description}\n`;
            if (program.structure) context += `- Structure: ${program.structure.join(', ')}\n`;
            if (program.outcome) context += `- Outcome: ${program.outcome}\n`;
            context += "\n";
        });
    }

    // Admissions
    if (knowledge.admissions.length > 0) {
        context += "## Admissions\n\n";
        knowledge.admissions.forEach(admission => {
            if (admission.eligibility) context += `- Eligibility: ${admission.eligibility}\n`;
            if (admission.process) context += `- Process: ${admission.process}\n`;
            if (admission.required_documents) context += `- Required Documents: ${admission.required_documents}\n`;
            context += "\n";
        });
    }

    // Services
    if (knowledge.services.length > 0) {
        context += "## Services\n\n";
        knowledge.services.forEach(service => {
            context += `### ${service.service_name || 'N/A'}\n`;
            if (service.description) context += `${service.description}\n`;
            context += "\n";
        });
    }

    // General Information
    if (knowledge.general_info.length > 0) {
        context += "## General Information\n\n";
        knowledge.general_info.forEach(info => {
            context += `### ${info.topic || 'N/A'}\n`;
            if (info.content) context += `${info.content}\n`;
            context += "\n";
        });
    }

    return context;
}

module.exports = { knowledge, getKnowledgeContext };
