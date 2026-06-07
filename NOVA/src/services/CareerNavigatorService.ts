// ============================================
// Career Navigator Service — Strategy Pattern
// ============================================
// Architecture:
//   ICareerNavigatorService (interface)
//     ├── RuleBasedNavigatorService  (v1 — ships today)
//     └── LLMNavigatorService        (v2 — future Gemini/OpenAI integration)
//
// Factory: createNavigatorService() returns the appropriate implementation.
// To migrate to LLM, set VITE_AI_BACKEND_URL in .env — zero UI changes needed.
// ============================================

import type {
  ICareerNavigatorService,
  StudentProfile,
  CareerPlan,
  LearningPathItem,
  PlanResource,
  ProjectIdea,
  TimelinePhase,
  CareerGoal,
} from '../components/launchpad/types';
import { roadmapDomains } from '../configs/roadmapConfig';
import { opportunities } from '../configs/opportunitiesConfig';

// ============================================
// Goal → Domain mapping
// ============================================
const GOAL_DOMAIN_MAP: Record<CareerGoal, string> = {
  'software-engineer': 'web-dev',
  'ai-engineer': 'ai-ml',
  'app-developer': 'web-dev',
  'cybersecurity-engineer': 'cybersecurity',
  'data-scientist': 'ai-ml',
  'open-to-explore': 'web-dev',
};

// ============================================
// Goal → Display name
// ============================================
const GOAL_LABELS: Record<CareerGoal, string> = {
  'software-engineer': 'Software Engineer',
  'ai-engineer': 'AI Engineer',
  'app-developer': 'App Developer',
  'cybersecurity-engineer': 'Cybersecurity Engineer',
  'data-scientist': 'Data Scientist',
  'open-to-explore': 'Tech Professional',
};

// ============================================
// Opportunity tag relevance by goal
// ============================================
const GOAL_TAGS: Record<CareerGoal, string[]> = {
  'software-engineer': ['web', 'javascript', 'software-engineering', 'open-source', 'git', 'github', 'coding', 'interview-prep'],
  'ai-engineer': ['ai', 'machine-learning', 'deep-learning', 'nlp', 'python', 'generative-ai'],
  'app-developer': ['web', 'javascript', 'building', 'product', 'startup'],
  'cybersecurity-engineer': ['cybersecurity', 'ctf', 'hacking', 'networking', 'security'],
  'data-scientist': ['ai', 'machine-learning', 'python', 'data', 'analytics'],
  'open-to-explore': ['beginner-friendly', 'workshops', 'innovation', 'coding'],
};

// ============================================
// Project idea templates
// ============================================
const PROJECT_TEMPLATES: Record<string, ProjectIdea[]> = {
  'web-dev': [
    { title: 'Personal Portfolio Website', description: 'Build a responsive portfolio showcasing your projects, skills, and blog posts using React and CSS animations.', skills: ['React', 'CSS', 'Responsive Design'], difficulty: 'beginner' },
    { title: 'Real-time Chat Application', description: 'Create a full-stack chat app with WebSocket support, user authentication, and message persistence.', skills: ['Node.js', 'WebSockets', 'MongoDB'], difficulty: 'intermediate' },
    { title: 'E-commerce Platform', description: 'Build a complete e-commerce site with product catalog, cart, payment integration, and admin dashboard.', skills: ['React', 'Express', 'PostgreSQL', 'Stripe'], difficulty: 'advanced' },
  ],
  'ai-ml': [
    { title: 'Sentiment Analysis Dashboard', description: 'Build a web dashboard that analyzes the sentiment of text reviews using pre-trained NLP models.', skills: ['Python', 'scikit-learn', 'Flask'], difficulty: 'beginner' },
    { title: 'Image Classification App', description: 'Train a CNN to classify images and serve predictions via a REST API with a React frontend.', skills: ['PyTorch', 'FastAPI', 'React'], difficulty: 'intermediate' },
    { title: 'Recommendation Engine', description: 'Build a collaborative filtering recommendation system with real-time suggestions and evaluation metrics.', skills: ['Python', 'Pandas', 'Matrix Factorization'], difficulty: 'advanced' },
  ],
  'cybersecurity': [
    { title: 'Password Strength Analyzer', description: 'Create a tool that evaluates password strength, detects common patterns, and suggests improvements.', skills: ['Python', 'Regex', 'Cryptography'], difficulty: 'beginner' },
    { title: 'Network Traffic Analyzer', description: 'Build a packet sniffer that captures and visualizes network traffic patterns, detecting anomalies.', skills: ['Python', 'Scapy', 'Wireshark'], difficulty: 'intermediate' },
    { title: 'Vulnerability Scanner', description: 'Develop an automated scanner that detects common web vulnerabilities (XSS, SQLi) in target applications.', skills: ['Python', 'Web Security', 'OWASP'], difficulty: 'advanced' },
  ],
};

// ============================================
// V1: Rule-Based Implementation
// ============================================
export class RuleBasedNavigatorService implements ICareerNavigatorService {
  async generatePlan(profile: StudentProfile): Promise<CareerPlan> {
    // Simulate realistic processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const domainId = GOAL_DOMAIN_MAP[profile.careerGoal];
    const goalLabel = GOAL_LABELS[profile.careerGoal];
    const domain = roadmapDomains.find(d => d.id === domainId);

    if (!domain) {
      throw new Error(`Domain not found for goal: ${profile.careerGoal}`);
    }

    const summary = this.buildSummary(profile, goalLabel, domain.title);
    const learningPath = this.buildLearningPath(profile, domain);
    const suggestedResources = this.buildResources(domain);
    const suggestedOpportunities = this.matchOpportunities(profile);
    const suggestedProjects = this.selectProjects(domainId, profile);
    const timeline = this.buildTimeline(profile, goalLabel);

    return {
      summary,
      learningPath,
      recommendedRoadmap: domainId,
      suggestedResources,
      suggestedOpportunities,
      suggestedProjects,
      timeline,
    };
  }

  private buildSummary(profile: StudentProfile, goalLabel: string, domainTitle: string): string {
    const yearNum = parseInt(profile.year);
    const semestersLeft = Math.max(1, (4 - yearNum + 1) * 2);
    const interestList = profile.interests.slice(0, 3).join(', ');

    if (yearNum <= 2) {
      return `As a ${profile.year} year student interested in ${interestList}, you have ${semestersLeft} semesters to build a strong foundation for your career as a ${goalLabel}. I recommend starting with the ${domainTitle} roadmap — focus on fundamentals first, then progressively tackle intermediate and advanced topics. Your curiosity is your biggest asset right now.`;
    }
    return `As a ${profile.year} year student with interests in ${interestList}, you're at the perfect stage to accelerate your journey toward becoming a ${goalLabel}. With ${semestersLeft} semesters remaining, focus on building real projects and gaining practical experience through internships and hackathons. The ${domainTitle} roadmap will guide your skill development.`;
  }

  private buildLearningPath(profile: StudentProfile, domain: typeof roadmapDomains[0]): LearningPathItem[] {
    const yearNum = parseInt(profile.year);
    const startIndex = yearNum <= 2 ? 0 : 2;

    return domain.nodes.slice(startIndex).map((node, index) => ({
      order: index + 1,
      skill: node.title,
      why: `${node.description.split('.')[0]}. This is ${node.level}-level and takes approximately ${node.duration}.`,
      timeframe: this.getTimeframe(index, yearNum),
    }));
  }

  private getTimeframe(index: number, yearNum: number): string {
    if (yearNum >= 4) {
      return index < 2 ? 'This month' : `Month ${index}`;
    }
    const month = index + 1;
    return month <= 2 ? `Month ${month}` : `Month ${month}-${month + 1}`;
  }

  private buildResources(domain: typeof roadmapDomains[0]): PlanResource[] {
    const resources: PlanResource[] = [];
    for (const node of domain.nodes.slice(0, 4)) {
      if (node.resources.length > 0) {
        const res = node.resources[0];
        resources.push({
          title: res.title,
          url: res.url,
          type: res.type,
          reason: `Recommended for learning ${node.title} — this is a highly-rated ${res.free ? 'free' : 'paid'} ${res.type}.`,
        });
      }
    }
    return resources;
  }

  private matchOpportunities(profile: StudentProfile): string[] {
    const relevantTags = GOAL_TAGS[profile.careerGoal] || [];
    const yearNum = parseInt(profile.year);

    return opportunities
      .filter(opp => {
        // Check eligibility
        if (opp.eligibility.includes('+')) {
          const minYear = parseInt(opp.eligibility);
          if (!isNaN(minYear) && yearNum < minYear) return false;
        }
        // Check deadline is in the future
        if (new Date(opp.deadline) < new Date()) return false;
        return true;
      })
      .map(opp => {
        const tagOverlap = opp.tags.filter(tag => relevantTags.includes(tag)).length;
        return { id: opp.id, score: tagOverlap + (opp.isFeatured ? 2 : 0) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.id);
  }

  private selectProjects(domainId: string, profile: StudentProfile): ProjectIdea[] {
    const templates = PROJECT_TEMPLATES[domainId] || PROJECT_TEMPLATES['web-dev'];
    const yearNum = parseInt(profile.year);

    if (yearNum <= 1) return templates.filter(p => p.difficulty === 'beginner' || p.difficulty === 'intermediate');
    if (yearNum <= 2) return templates.filter(p => p.difficulty === 'intermediate' || p.difficulty === 'beginner');
    return templates;
  }

  private buildTimeline(profile: StudentProfile, goalLabel: string): TimelinePhase[] {
    const yearNum = parseInt(profile.year);

    if (yearNum >= 4) {
      return [
        { phase: 'Month 1-2', focus: 'Skill Intensive', milestones: ['Complete top 3 roadmap topics', 'Build 1 portfolio project', 'Apply to 5 opportunities'] },
        { phase: 'Month 3-4', focus: 'Job Ready', milestones: ['Finish portfolio website', 'Practice DSA daily', `Apply to ${goalLabel} roles`] },
      ];
    }
    if (yearNum >= 3) {
      return [
        { phase: 'Semester 1', focus: 'Deep Dive', milestones: ['Complete roadmap fundamentals', 'Build 1 intermediate project', 'Participate in 1 hackathon'] },
        { phase: 'Semester 2', focus: 'Real Experience', milestones: ['Land an internship or open-source contribution', 'Build 1 advanced project', 'Start technical blogging'] },
        { phase: 'Final Stretch', focus: 'Career Launch', milestones: ['Polish portfolio', 'Network at conferences', `Target ${goalLabel} positions`] },
      ];
    }
    return [
      { phase: 'Semester 1-2', focus: 'Foundations', milestones: ['Complete beginner roadmap nodes', 'Build 2 small projects', 'Join coding communities'] },
      { phase: 'Semester 3-4', focus: 'Growth', milestones: ['Tackle intermediate topics', 'Enter first hackathon', 'Start contributing to open source'] },
      { phase: 'Semester 5-6', focus: 'Expertise', milestones: ['Build advanced projects', 'Land an internship', 'Become a mentor yourself'] },
      { phase: 'Final Year', focus: 'Launch', milestones: ['Complete capstone project', `Prepare for ${goalLabel} interviews`, 'Build professional network'] },
    ];
  }
}

// ============================================
// V2 Stub: LLM-Backed Implementation (Future)
// ============================================
// When VITE_AI_BACKEND_URL is set, this service would:
// 1. POST /api/career-plan with { profile: StudentProfile }
// 2. Backend proxies to Gemini API with structured output schema
// 3. Response is parsed into CareerPlan interface
//
// Prompt template (for documentation):
// "You are a career advisor for engineering students at MVSR Engineering College.
//  Given this student profile: {profile}, generate a personalized career plan
//  with learning path, resources, projects, and timeline.
//  Respond in JSON matching this schema: {CareerPlan interface}"
// ============================================

// ============================================
// Factory — returns appropriate implementation
// ============================================
export function createNavigatorService(): ICareerNavigatorService {
  // Future: check for LLM backend URL
  // const aiUrl = import.meta.env.VITE_AI_BACKEND_URL;
  // if (aiUrl) return new LLMNavigatorService(aiUrl);
  return new RuleBasedNavigatorService();
}
