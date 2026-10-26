import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import {
  getProblems,
  addProblem,
  updateProblemStatus,
  getProposals,
  addProposal,
  getUserProfile,
  updateUserProfile,
  getThreads,
  addMessageToThread,
  getNotifications,
  markAllNotificationsRead,
  getUsers,
  getUserById,
  saveUser,
  getConnectionRequests,
  addConnectionRequest,
  updateConnectionRequestStatus,
  getDatabaseStats,
} from './src/db/database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Dev server in AI Studio must always bind to port 3000
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ======================== DATABASE REST API ========================

// 1. Problems Endpoints
app.get('/api/problems', (_req, res) => {
  try {
    const problems = getProblems();
    res.json(problems);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch problems from database' });
  }
});

app.post('/api/problems', (req, res) => {
  try {
    const problemData = req.body;
    if (!problemData.title || !problemData.organization || !problemData.description) {
      return res.status(400).json({ error: 'Missing required problem fields' });
    }
    const created = addProblem({
      ...problemData,
      id: problemData.id || `pb-${Date.now()}`,
      postedTime: problemData.postedTime || 'Just now',
      interestedCount: problemData.interestedCount || 0,
      status: problemData.status || 'Open',
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save problem to database' });
  }
});

app.patch('/api/problems/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = updateProblemStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update problem status' });
  }
});

// 2. Proposals Endpoints
app.get('/api/proposals', (_req, res) => {
  try {
    const proposals = getProposals();
    res.json(proposals);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

app.post('/api/proposals', (req, res) => {
  try {
    const proposalData = req.body;
    if (!proposalData.problemId || !proposalData.solutionSummary) {
      return res.status(400).json({ error: 'Missing required proposal fields' });
    }
    const created = addProposal({
      ...proposalData,
      id: proposalData.id || `prop-${Date.now()}`,
      submittedAt: proposalData.submittedAt || 'Just now',
      status: proposalData.status || 'Submitted',
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to submit proposal' });
  }
});

// 3. User Profile Endpoints
app.get('/api/user-profile', (_req, res) => {
  try {
    const profile = getUserProfile();
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

app.put('/api/user-profile', (req, res) => {
  try {
    const updated = updateUserProfile(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// 4. Chat Threads Endpoints
app.get('/api/threads', (_req, res) => {
  try {
    const threads = getThreads();
    res.json(threads);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch chat threads' });
  }
});

app.post('/api/threads/:id/messages', (req, res) => {
  try {
    const { id } = req.params;
    const { text, sender } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Message text is required' });
    }
    const updatedThread = addMessageToThread(id, text, sender || 'user');
    if (!updatedThread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Trigger simulated owner response if sender was user
    if (sender !== 'owner') {
      setTimeout(() => {
        addMessageToThread(
          id,
          `Thank you for your update! We have noted this and will check with the plant team.`,
          'owner'
        );
      }, 1500);
    }

    res.json(updatedThread);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// 5. Notifications Endpoints
app.get('/api/notifications', (_req, res) => {
  try {
    const notifications = getNotifications();
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.post('/api/notifications/read-all', (_req, res) => {
  try {
    markAllNotificationsRead();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark notifications read' });
  }
});

// 6. Users Endpoints (Personal Information in Database)
app.get('/api/users', (_req, res) => {
  try {
    const users = getUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch users from database' });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const user = getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/users', (req, res) => {
  try {
    const saved = saveUser(req.body);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// 7. Connection & Communication Requests Endpoints (Permission-gated messaging)
app.get('/api/connection-requests', (_req, res) => {
  try {
    const requests = getConnectionRequests();
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch connection requests' });
  }
});

app.post('/api/connection-requests', (req, res) => {
  try {
    const { problemId, problemTitle, senderId, senderName, senderEmail, senderRole, senderInstitution, ownerId, ownerName, ownerEmail, intentType, message } = req.body;
    if (!problemId || !senderName || !ownerName || !message) {
      return res.status(400).json({ error: 'Missing required connection request fields' });
    }

    const created = addConnectionRequest({
      id: req.body.id || `req-${Date.now()}`,
      problemId,
      problemTitle: problemTitle || 'Problem Challenge',
      senderId: senderId || 'usr-anon',
      senderName,
      senderEmail: senderEmail || '',
      senderRole: senderRole || 'builder',
      senderInstitution: senderInstitution || '',
      senderDegree: req.body.senderDegree || '',
      senderDepartment: req.body.senderDepartment || '',
      senderSkills: req.body.senderSkills || [],
      senderBio: req.body.senderBio || '',
      senderGithub: req.body.senderGithub || '',
      senderLinkedin: req.body.senderLinkedin || '',
      senderPhone: req.body.senderPhone || '',
      ownerId: ownerId || '',
      ownerName,
      ownerEmail: ownerEmail || '',
      intentType: intentType || 'interested',
      message,
      status: 'pending',
      createdAt: 'Just now',
    });

    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create connection request' });
  }
});

app.patch('/api/connection-requests/:id/approve', (req, res) => {
  try {
    const { id } = req.params;
    const { responseMessage } = req.body;
    const updated = updateConnectionRequestStatus(id, 'approved', responseMessage);
    if (!updated) {
      return res.status(404).json({ error: 'Connection request not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to approve connection request' });
  }
});

app.patch('/api/connection-requests/:id/decline', (req, res) => {
  try {
    const { id } = req.params;
    const { responseMessage } = req.body;
    const updated = updateConnectionRequestStatus(id, 'declined', responseMessage);
    if (!updated) {
      return res.status(404).json({ error: 'Connection request not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to decline connection request' });
  }
});

// 8. Database Health & Diagnostics Endpoint (Confirm local DB on laptop)
app.get('/api/database/stats', (_req, res) => {
  try {
    const stats = getDatabaseStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve database statistics' });
  }
});

// ======================== AI ASSISTANT ENDPOINTS (GEMINI 2.5 FLASH) ========================

// 1. AI Doubt Solver Endpoint
app.post('/api/ai/doubt-solver', async (req, res) => {
  try {
    const { question, history, problemContext } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const systemPrompt = `You are ProblemBridge AI, the knowledgeable, helpful, and encouraging engineering assistant for the "ProblemBridge" platform.
ProblemBridge bridges real-world organizations (MSME textile mills, polyclinics, hospitals, farmer producer collectives, municipal bodies) with talented engineering students, makers, and developers.

Core Platform Principles:
1. Every registered user can post operational problems or apply to solve them.
2. Problems have clear honorarium budgets (e.g. ₹15,000 to ₹75,000+).
3. Problem owners provide test access, hardware sensors, and mentor guidance.
4. Builders submit architecture proposals with timeline (weeks), team size, and component bill of materials.
5. All deliverables must be functional working prototypes (circuits, ESP32 firmware, web/mobile apps, edge AI models).

Guidelines for your answers:
- Provide clear, direct, and practical answers.
- Clear up doubts about how to post problems, how honorariums are paid, how to register, what tech stacks to use (ESP32, React, Arduino, Python, etc.), and how to form student teams.
- Keep tone professional, engineering-grounded, empathetic, and encouraging.
- Limit responses to 2-3 focused paragraphs or bullet points so users can easily read on mobile or desktop.
${problemContext ? `Active context on current problem: ${JSON.stringify(problemContext)}` : ''}`;

    if (aiClient) {
      try {
        const contents: any[] = [];
        
        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }

        contents.push({
          role: 'user',
          parts: [{ text: question }],
        });

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        const answerText = response.text || '';
        if (answerText) {
          return res.json({
            answer: answerText,
            source: 'gemini',
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call encountered an error, falling back to built-in knowledge base:', geminiError?.message);
      }
    }

    // High quality domain fallback
    const q = question.toLowerCase();
    let fallbackAnswer = '';

    if (q.includes('post') && (q.includes('problem') || q.includes('challenge') || q.includes('how'))) {
      fallbackAnswer = `**Posting a Problem on ProblemBridge is easy and open to everyone!**\n\n1. Click **"+ Post Problem"** in the top navigation.\n2. Fill in the problem title, organization, field location, operational bottleneck, target honorarium (₹), and required skills.\n3. Hit **Publish Challenge**! Your challenge will immediately go live for student builders and developers to submit technical proposals.`;
    } else if (q.includes('money') || q.includes('honorarium') || q.includes('budget') || q.includes('payment') || q.includes('paid')) {
      fallbackAnswer = `**How Honorariums & Payments Work:**\n\n- Every posted problem includes an agreed honorarium (ranging from ₹10,000 to ₹75,000+) paid directly to builders upon achieving agreed project milestones.\n- Usually, honorariums are broken into milestone disbursements: 20% on architecture approval, 40% on bench prototype demonstration, and 40% on on-site deployment and handover.\n- Organizations also reimburse hardware components or provide sensor test kits.`;
    } else {
      fallbackAnswer = `**Welcome to ProblemBridge!**\n\nProblemBridge connects organizations with students and developers to turn real operational headaches into working hardware and software solutions.\n\n- **To explore problems:** Browse the catalog and filter by categories or required skills.\n- **To submit a proposal:** Click on any challenge card and choose "Submit Solution Proposal".\n- **To post a problem:** Click "+ Post Problem" in the top bar. All registered users have posting privileges!`;
    }

    return res.json({
      answer: fallbackAnswer,
      source: 'domain_knowledge',
    });
  } catch (err: any) {
    console.error('Error in /api/ai/doubt-solver:', err);
    res.status(500).json({ error: 'Failed to process AI doubt solver request' });
  }
});

// 2. AI Problem Assistant: Formulate & Clarify Problem
app.post('/api/ai/formulate-problem', async (req, res) => {
  try {
    const { roughDescription, organizationType } = req.body;
    if (!roughDescription) {
      return res.status(400).json({ error: 'Rough description is required' });
    }

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are an expert technical product manager on ProblemBridge. Given this rough operational problem description from an organization (${organizationType || 'General'}): "${roughDescription}", generate a refined problem formulation in JSON format with:
- refinedTitle (concise, high-impact title)
- painPoint (clear 2-3 sentence statement of the operational bottleneck)
- suggestedCategory (e.g. Healthcare, Agriculture, Technology, Environment, Public Infrastructure)
- suggestedSkills (array of 3-5 technical skills e.g. ["ESP32", "React", "Python"])
- deliverables (array of 3 specific tangible deliverables e.g. ["Sensor PCB", "Dashboard", "Field Alert System"])
- deliverableType (one of: 'Hardware Prototype', 'Web & Mobile App', 'Firmware & Cloud', 'Full-Stack Solution', 'Edge AI Model')
Respond with JSON only.`,
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        if (text) {
          const parsed = JSON.parse(text);
          return res.json(parsed);
        }
      } catch (err) {
        console.warn('AI formulate problem fallback:', err);
      }
    }

    // Default structure
    res.json({
      refinedTitle: 'Operational Monitoring & Alert Automation System',
      painPoint: roughDescription,
      suggestedCategory: 'Technology',
      suggestedSkills: ['Embedded Systems', 'IoT', 'Cloud Dashboard'],
      deliverables: ['Telemetry unit', 'Alert notifications', 'Web status monitor'],
      deliverableType: 'Full-Stack Solution',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to formulate problem' });
  }
});

// 3. AI Solution Assistant: Structure Proposal
app.post('/api/ai/structure-proposal', async (req, res) => {
  try {
    const { problemTitle, problemDescription, solverSkills } = req.body;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are a senior engineering mentor. Help a student builder draft a structured proposal for the challenge: "${problemTitle}".
Context: "${problemDescription}".
Builder skills: "${(solverSkills || []).join(', ')}".
Return JSON with:
- solutionSummary: (structured 3-paragraph technical proposal: 1. Architecture, 2. Hardware/Software Stack, 3. Testing & Delivery)
- suggestedTechStack: (array of 4-6 specific libraries/tools)
- estimatedWeeks: (realistic integer between 2 and 8)
Respond with JSON only.`,
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        if (text) {
          return res.json(JSON.parse(text));
        }
      } catch (err) {
        console.warn('AI proposal structurer fallback:', err);
      }
    }

    res.json({
      solutionSummary: `We propose a modular solution combining edge telemetry with a real-time reactive dashboard.\n\nPhase 1 focuses on hardware sensor interfacing and firmware calibration.\nPhase 2 establishes bidirectional sync with alert thresholds.\nPhase 3 delivers field deployment documentation and handover.`,
      suggestedTechStack: ['ESP32', 'MQTT', 'React', 'TypeScript', 'Node.js'],
      estimatedWeeks: 4,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to structure proposal' });
  }
});

// 4. AI Candidate Profile Analysis for Problem Owners
app.post('/api/ai/analyze-candidate', async (req, res) => {
  try {
    const { candidate, problem } = req.body;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Analyze this candidate solver for the problem: "${problem?.title || 'Engineering Challenge'}".
Candidate Profile:
- Name: ${candidate?.senderName || candidate?.fullName || 'Candidate'}
- Institution: ${candidate?.senderInstitution || candidate?.institution || 'Engineering College'}
- Degree & Department: ${candidate?.senderDegree || candidate?.degree || ''} ${candidate?.senderDepartment || candidate?.department || ''}
- Skills: ${(candidate?.senderSkills || candidate?.skills || []).join(', ')}
- Bio: ${candidate?.senderBio || candidate?.bio || 'Passionate builder'}
- Github: ${candidate?.senderGithub || candidate?.githubUrl || 'N/A'}

Problem Requirements:
- Description: ${problem?.description || ''}
- Deliverables: ${(problem?.deliverables || []).join(', ')}
- Required Skills: ${(problem?.skills || []).join(', ')}

Provide an objective assessment in JSON format with:
- matchScore: integer percentage (0-100)
- keyStrengths: array of 3 bullet points
- challengeAreas: array of 2 potential gaps or questions to ask
- recommendedAction: 'Strong Match - Approve Connection' or 'Moderate Fit - Schedule Discussion' or 'Alternative Match'
- interviewQuestions: array of 3 technical questions for the owner to ask this candidate
Respond with JSON only.`,
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        if (text) {
          return res.json(JSON.parse(text));
        }
      } catch (err) {
        console.warn('Candidate analysis AI fallback:', err);
      }
    }

    res.json({
      matchScore: 88,
      keyStrengths: [
        'Direct coursework and hands-on skills in core required tools',
        'Demonstrated commitment via institutional credentials and project portfolio',
        'Strong alignment with the proposed timeline and deliverables',
      ],
      challengeAreas: [
        'Verify hardware bench testing availability during college hours',
        'Clarify team member roles if applying as a multi-person crew',
      ],
      recommendedAction: 'Strong Match - Approve Connection',
      interviewQuestions: [
        'How do you plan to handle power brownouts or sensor calibration in the field?',
        'Have you worked with this specific telemetry protocol in a production prototype?',
        'What is your expected timeline for the initial prototype demonstration?',
      ],
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze candidate profile' });
  }
});

// Mount Vite or serve static assets
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ProblemBridge server running on http://localhost:${PORT}`);
  });
}

startServer();

