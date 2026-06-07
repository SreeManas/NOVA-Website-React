// ============================================
// NOVA Community Platform — Mock Data Configuration
// ============================================
// All data is static for v1 (frontend-only).
// Architecture supports future migration to Notion API / backend.

import type {
  CommunityStats,
  Discussion,
  CommunityEvent,
  Notification,
  CommunityHighlight,
  PendingIdRequest,
  ReportedDiscussion,
  NovaIdProfile,
  MemberBadge,
} from '../domain/models/CommunityModels';

// ── Community Stats ──

export const communityStats: CommunityStats = {
  members: 1245,
  discussions: 328,
  eventsHosted: 52,
  opportunitiesShared: 143,
};

// ── Discussions ──

export const discussions: Discussion[] = [
  {
    id: 'disc-001',
    title: 'How should I prepare for Smart India Hackathon?',
    content: `SIH is coming up and I want to make sure our team is well-prepared. We're a group of 6 from IT department.

Key questions:
1. What tech stacks have worked well in past editions?
2. How early should we start working on our prototype?
3. Any tips for the presentation round?

Would love to hear from seniors who've participated before! 🚀`,
    authorId: 'NOVA245113',
    authorName: 'Arjun Reddy',
    category: 'hackathons',
    createdAt: '2026-06-03T10:30:00Z',
    replies: [
      {
        id: 'reply-001',
        authorId: 'NOVA245089',
        authorName: 'Priya Sharma',
        content: 'Start with problem understanding first. We made the mistake of jumping to code too early in SIH 2025. Spend at least 2 days just on the problem statement and user research.',
        createdAt: '2026-06-03T11:15:00Z',
        likes: 12,
      },
      {
        id: 'reply-002',
        authorId: 'NOVA245045',
        authorName: 'Karthik Menon',
        content: 'React + FastAPI worked great for us. Keep your tech stack simple — judges care more about the solution than fancy tech. Also, have a solid demo video ready as backup.',
        createdAt: '2026-06-03T12:00:00Z',
        likes: 8,
      },
      {
        id: 'reply-003',
        authorId: 'NOVA245190',
        authorName: 'Sneha Patel',
        content: 'Presentation matters A LOT. Practice your pitch at least 5 times. Keep it under 7 minutes and focus on the problem-solution fit, not the code architecture.',
        createdAt: '2026-06-03T14:30:00Z',
        likes: 15,
      },
    ],
    likes: 43,
    isPinned: true,
  },
  {
    id: 'disc-002',
    title: 'Best free resources for learning DSA in 2026?',
    content: `I'm a 2nd year student starting my DSA preparation for placements. Looking for resources that are:

- Free or affordable
- Have good problem sets
- Cover both theory and practice

Currently I know basic arrays and strings. Need to build up to trees, graphs, and DP.

What worked for you? 📚`,
    authorId: 'NOVA245201',
    authorName: 'Rahul Krishna',
    category: 'placements',
    createdAt: '2026-06-02T09:00:00Z',
    replies: [
      {
        id: 'reply-004',
        authorId: 'NOVA245067',
        authorName: 'Divya Lakshmi',
        content: 'Striver\'s A2Z DSA sheet is hands down the best structured resource. Pair it with NeetCode 150 for interview-specific problems. Both free!',
        createdAt: '2026-06-02T09:45:00Z',
        likes: 22,
      },
      {
        id: 'reply-005',
        authorId: 'NOVA245113',
        authorName: 'Arjun Reddy',
        content: 'I used Striver + CSES problem set. The CSES problems are really good for building intuition, especially for DP and graphs.',
        createdAt: '2026-06-02T10:30:00Z',
        likes: 11,
      },
    ],
    likes: 67,
    isPinned: false,
  },
  {
    id: 'disc-003',
    title: 'Looking for React teammates for a college project',
    content: `Working on a project management tool as my mini project. Need 2 more people who know:

- React (with hooks)
- Basic Node.js
- Git/GitHub workflow

The project is due by July end. We meet twice a week in the library after 4 PM.

DM me or reply here if interested! 💻`,
    authorId: 'NOVA245156',
    authorName: 'Meera Rao',
    category: 'projects',
    createdAt: '2026-06-01T16:00:00Z',
    replies: [
      {
        id: 'reply-006',
        authorId: 'NOVA245178',
        authorName: 'Varun Iyer',
        content: 'Interested! I have experience with React and have contributed to a few open source projects. Will DM you.',
        createdAt: '2026-06-01T16:30:00Z',
        likes: 3,
      },
    ],
    likes: 18,
    isPinned: false,
  },
  {
    id: 'disc-004',
    title: 'Cybersecurity career path — where to start?',
    content: `I'm fascinated by cybersecurity but overwhelmed by the breadth of the field. Should I start with:

- Web application security?
- Network security?
- Malware analysis?
- Bug bounty hunting?

I know basic Python and Linux. What's the most practical path for a college student? 🔒`,
    authorId: 'NOVA245220',
    authorName: 'Aditya Kumar',
    category: 'cybersecurity',
    createdAt: '2026-05-30T13:00:00Z',
    replies: [
      {
        id: 'reply-007',
        authorId: 'NOVA245045',
        authorName: 'Karthik Menon',
        content: 'Start with TryHackMe — their learning paths are structured perfectly for beginners. Complete the "Pre Security" and "Jr Penetration Tester" paths first.',
        createdAt: '2026-05-30T14:00:00Z',
        likes: 19,
      },
      {
        id: 'reply-008',
        authorId: 'NOVA245089',
        authorName: 'Priya Sharma',
        content: 'Web app security is the most practical entry point. Learn OWASP Top 10, then try HackTheBox. Bug bounties can come later once you have solid fundamentals.',
        createdAt: '2026-05-30T15:30:00Z',
        likes: 14,
      },
    ],
    likes: 31,
    isPinned: false,
  },
  {
    id: 'disc-005',
    title: 'Getting started with Hugging Face and open-source AI',
    content: `Wanted to share my experience contributing to Hugging Face Transformers library.

Key takeaways:
1. Start by fixing documentation issues — they're the easiest first PRs
2. Read the contribution guidelines thoroughly
3. Join their Discord for community support
4. Look for "good first issue" tags

The community is super welcoming. Happy to help anyone who wants to start! 🤗`,
    authorId: 'NOVA245089',
    authorName: 'Priya Sharma',
    category: 'open-source',
    createdAt: '2026-05-28T11:00:00Z',
    replies: [
      {
        id: 'reply-009',
        authorId: 'NOVA245201',
        authorName: 'Rahul Krishna',
        content: 'This is so helpful! I\'ve been wanting to start contributing but was intimidated. Documentation PRs sound like a great first step.',
        createdAt: '2026-05-28T12:00:00Z',
        likes: 7,
      },
    ],
    likes: 55,
    isPinned: false,
  },
  {
    id: 'disc-006',
    title: 'AI/ML study group — who wants to join?',
    content: `Starting a weekly AI/ML study group. Plan:

Week 1-4: Python + NumPy foundations
Week 5-8: Machine Learning basics (scikit-learn)
Week 9-12: Deep Learning (PyTorch)
Week 13-16: Projects + paper reading

We'll meet every Saturday 10 AM in CSE Lab 3. Materials will be shared on our WhatsApp group.

Drop your name if interested! 🧠`,
    authorId: 'NOVA245067',
    authorName: 'Divya Lakshmi',
    category: 'ai-ml',
    createdAt: '2026-05-25T08:00:00Z',
    replies: [
      {
        id: 'reply-010',
        authorId: 'NOVA245220',
        authorName: 'Aditya Kumar',
        content: 'Count me in! I\'ve been doing Andrew Ng\'s course on my own but study groups are so much better for staying consistent.',
        createdAt: '2026-05-25T09:00:00Z',
        likes: 5,
      },
      {
        id: 'reply-011',
        authorId: 'NOVA245156',
        authorName: 'Meera Rao',
        content: 'Interested! Can we also cover some NLP basics? I\'m working on a text classification project and could use guidance.',
        createdAt: '2026-05-25T10:30:00Z',
        likes: 4,
      },
    ],
    likes: 38,
    isPinned: false,
  },
  {
    id: 'disc-007',
    title: 'Web dev roadmap for absolute beginners',
    content: `Compiled a roadmap based on my journey. Sharing for fellow freshers:

**Month 1**: HTML + CSS (build 3 static sites)
**Month 2**: JavaScript fundamentals (DOM, events, async)
**Month 3**: React basics (components, hooks, routing)
**Month 4**: Backend intro (Node.js + Express)
**Month 5**: Database (MongoDB or PostgreSQL)
**Month 6**: Full-stack project

Free resources for each stage in the thread below 👇`,
    authorId: 'NOVA245178',
    authorName: 'Varun Iyer',
    category: 'web-development',
    createdAt: '2026-05-22T15:00:00Z',
    replies: [
      {
        id: 'reply-012',
        authorId: 'NOVA245201',
        authorName: 'Rahul Krishna',
        content: 'This is gold! Saving this. Would you recommend The Odin Project or freeCodeCamp for the first month?',
        createdAt: '2026-05-22T16:00:00Z',
        likes: 9,
      },
    ],
    likes: 72,
    isPinned: true,
  },
  {
    id: 'disc-008',
    title: 'Internship experience at Infosys — AMA',
    content: `Just completed my summer internship at Infosys Hyderabad. Here are some quick facts:

- Role: Full Stack Developer Intern
- Duration: 2 months
- Tech: React + Spring Boot + MySQL
- Stipend: ₹15,000/month

Ask me anything about the experience, interview process, or what they look for in interns! 💼`,
    authorId: 'NOVA245045',
    authorName: 'Karthik Menon',
    category: 'placements',
    createdAt: '2026-05-20T10:00:00Z',
    replies: [
      {
        id: 'reply-013',
        authorId: 'NOVA245156',
        authorName: 'Meera Rao',
        content: 'How was the interview process? Was it through campus placement or did you apply directly?',
        createdAt: '2026-05-20T11:00:00Z',
        likes: 6,
      },
      {
        id: 'reply-014',
        authorId: 'NOVA245045',
        authorName: 'Karthik Menon',
        content: 'Applied through InfyTQ platform. Had an online test (aptitude + coding), then a technical interview, then HR. Prep DSA basics and know your projects well.',
        createdAt: '2026-05-20T12:00:00Z',
        likes: 11,
      },
    ],
    likes: 46,
    isPinned: false,
  },
];

// ── Events ──

export const communityEvents: CommunityEvent[] = [
  {
    id: 'evt-001',
    title: 'AI Study Circle — Week 3',
    description: 'Continuing our deep dive into machine learning fundamentals. This week we cover decision trees, random forests, and ensemble methods with hands-on coding exercises.',
    agenda: [
      '10:00 AM — Recap of Week 2 (Linear/Logistic Regression)',
      '10:30 AM — Decision Trees: Theory & Implementation',
      '11:15 AM — Random Forests & Ensemble Methods',
      '12:00 PM — Hands-on: Build a classifier on real dataset',
      '12:45 PM — Q&A and next week preview',
    ],
    type: 'study-circle',
    date: '2026-06-08',
    time: '10:00 AM',
    host: 'Divya Lakshmi',
    hostNovaId: 'NOVA245067',
    participants: 24,
    maxParticipants: 40,
    status: 'upcoming',
    tags: ['AI/ML', 'Python', 'scikit-learn'],
  },
  {
    id: 'evt-002',
    title: 'Resume Review Session',
    description: 'Get your resume reviewed by NOVA mentors and alumni. Bring your latest resume and receive personalized feedback on format, content, and ATS optimization.',
    agenda: [
      '2:00 PM — Common resume mistakes (presentation)',
      '2:30 PM — One-on-one review sessions begin',
      '4:00 PM — Resume templates & resources sharing',
      '4:30 PM — Q&A wrap-up',
    ],
    type: 'resume-review',
    date: '2026-06-10',
    time: '2:00 PM',
    host: 'Karthik Menon',
    hostNovaId: 'NOVA245045',
    participants: 18,
    maxParticipants: 25,
    status: 'upcoming',
    tags: ['Career', 'Placements', 'Resume'],
  },
  {
    id: 'evt-003',
    title: 'Cybersecurity Meetup — CTF Introduction',
    description: 'Introduction to Capture The Flag competitions. Learn the basics of web exploitation, cryptography, and forensics through hands-on challenges.',
    agenda: [
      '5:00 PM — What are CTFs? Overview & platforms',
      '5:30 PM — Web exploitation basics (OWASP)',
      '6:15 PM — Cryptography fundamentals',
      '7:00 PM — Live mini-CTF challenge',
      '7:45 PM — Resources and next steps',
    ],
    type: 'tech-meetup',
    date: '2026-06-12',
    time: '5:00 PM',
    host: 'Priya Sharma',
    hostNovaId: 'NOVA245089',
    participants: 32,
    maxParticipants: 50,
    status: 'upcoming',
    tags: ['Cybersecurity', 'CTF', 'Ethical Hacking'],
  },
  {
    id: 'evt-004',
    title: 'Mock Interview Marathon',
    description: 'Practice technical interviews with peers and mentors. Rounds include DSA problem solving, system design basics, and behavioral questions.',
    agenda: [
      '10:00 AM — Registration & pairing',
      '10:30 AM — Round 1: DSA (45 min)',
      '11:30 AM — Round 2: System Design basics (30 min)',
      '12:15 PM — Round 3: Behavioral (20 min)',
      '1:00 PM — Feedback session & tips',
    ],
    type: 'mock-interview',
    date: '2026-06-15',
    time: '10:00 AM',
    host: 'Arjun Reddy',
    hostNovaId: 'NOVA245113',
    participants: 14,
    maxParticipants: 20,
    status: 'upcoming',
    tags: ['Placements', 'DSA', 'Interviews'],
  },
  {
    id: 'evt-005',
    title: 'Hackathon Prep Workshop — SIH 2026',
    description: 'Everything you need to know to prepare for Smart India Hackathon 2026. From team formation to prototype building to final presentation.',
    agenda: [
      '3:00 PM — SIH overview & timeline',
      '3:30 PM — How to pick the right problem statement',
      '4:15 PM — Tech stack recommendations',
      '5:00 PM — Building an MVP in 36 hours',
      '5:45 PM — Presentation & demo tips',
      '6:15 PM — Past winners showcase',
    ],
    type: 'hackathon-prep',
    date: '2026-06-18',
    time: '3:00 PM',
    host: 'Arjun Reddy',
    hostNovaId: 'NOVA245113',
    participants: 45,
    maxParticipants: 60,
    status: 'upcoming',
    tags: ['SIH', 'Hackathon', 'Innovation'],
  },
  {
    id: 'evt-006',
    title: 'Open Source Sprint — First PR',
    description: 'Hands-on session to make your first open source contribution. We\'ll walk through finding projects, understanding codebases, and submitting pull requests.',
    agenda: [
      '11:00 AM — Why open source matters',
      '11:30 AM — Finding beginner-friendly projects',
      '12:00 PM — Git workflow for contributions',
      '12:45 PM — Hands-on: Fork, fix, PR',
      '1:30 PM — Showcase & celebrate first PRs',
    ],
    type: 'open-source-sprint',
    date: '2026-06-20',
    time: '11:00 AM',
    host: 'Varun Iyer',
    hostNovaId: 'NOVA245178',
    participants: 20,
    maxParticipants: 35,
    status: 'upcoming',
    tags: ['Open Source', 'GitHub', 'Git'],
  },
  {
    id: 'evt-007',
    title: 'React Workshop — Building with Hooks',
    description: 'Deep dive into React hooks — useState, useEffect, useContext, custom hooks. Build a complete mini-project by the end of the session.',
    agenda: [
      '4:00 PM — React fundamentals recap',
      '4:30 PM — useState & useEffect patterns',
      '5:15 PM — useContext for state management',
      '6:00 PM — Building custom hooks',
      '6:45 PM — Project: Build a task manager',
    ],
    type: 'study-circle',
    date: '2026-05-25',
    time: '4:00 PM',
    host: 'Meera Rao',
    hostNovaId: 'NOVA245156',
    participants: 30,
    maxParticipants: 30,
    status: 'completed',
    tags: ['React', 'JavaScript', 'Web Dev'],
  },
  {
    id: 'evt-008',
    title: 'DSA Bootcamp — Arrays & Strings',
    description: 'First session of our placement-focused DSA bootcamp. Covers two-pointer technique, sliding window, and prefix sums.',
    agenda: [
      '9:00 AM — Arrays: fundamentals & patterns',
      '9:45 AM — Two-pointer technique',
      '10:30 AM — Sliding window problems',
      '11:15 AM — Prefix sums & hashing',
      '12:00 PM — Practice problem set distribution',
    ],
    type: 'study-circle',
    date: '2026-05-18',
    time: '9:00 AM',
    host: 'Karthik Menon',
    hostNovaId: 'NOVA245045',
    participants: 38,
    maxParticipants: 40,
    status: 'completed',
    tags: ['DSA', 'Placements', 'Coding'],
  },
];

// ── Notifications ──

export const notifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'event-reminder',
    title: 'Event Tomorrow',
    message: 'AI Study Circle — Week 3 starts tomorrow at 10:00 AM in CSE Lab 3.',
    timestamp: '2026-06-07T18:00:00Z',
    isRead: false,
    actionUrl: '/community',
  },
  {
    id: 'notif-002',
    type: 'id-approved',
    title: 'NOVA ID Approved',
    message: 'Your NOVA ID application has been approved! Welcome to the community.',
    timestamp: '2026-06-06T10:00:00Z',
    isRead: false,
    actionUrl: '/community',
  },
  {
    id: 'notif-003',
    type: 'discussion-reply',
    title: 'New Reply',
    message: 'Priya Sharma replied to your discussion "How should I prepare for SIH?"',
    timestamp: '2026-06-05T14:30:00Z',
    isRead: false,
    actionUrl: '/community',
  },
  {
    id: 'notif-004',
    type: 'new-opportunity',
    title: 'New Opportunity',
    message: 'Google Summer of Code 2027 applications are now open!',
    timestamp: '2026-06-04T09:00:00Z',
    isRead: true,
    actionUrl: '/launchpad',
  },
  {
    id: 'notif-005',
    type: 'badge-earned',
    title: 'Badge Earned',
    message: 'You earned the "Top Contributor" badge for your community contributions!',
    timestamp: '2026-06-03T16:00:00Z',
    isRead: true,
    actionUrl: '/community',
  },
  {
    id: 'notif-006',
    type: 'event-reminder',
    title: 'Event Reminder',
    message: 'Resume Review Session is in 2 days. Don\'t forget to bring your resume!',
    timestamp: '2026-06-03T10:00:00Z',
    isRead: true,
    actionUrl: '/community',
  },
  {
    id: 'notif-007',
    type: 'level-up',
    title: 'Level Up!',
    message: 'Congratulations! You\'ve reached Contributor level. Keep going!',
    timestamp: '2026-06-02T12:00:00Z',
    isRead: true,
    actionUrl: '/community',
  },
  {
    id: 'notif-008',
    type: 'discussion-reply',
    title: 'New Reply',
    message: 'Karthik Menon replied to "Best free resources for learning DSA"',
    timestamp: '2026-06-01T15:00:00Z',
    isRead: true,
    actionUrl: '/community',
  },
];

// ── Community Highlights ──

export const communityHighlights: CommunityHighlight[] = [
  {
    label: 'Top Contributor',
    title: 'Priya Sharma',
    subtitle: '24 discussions · 89 replies',
    icon: 'fas fa-trophy',
  },
  {
    label: 'Most Active Discussion',
    title: 'Web dev roadmap for beginners',
    subtitle: '72 likes · 12 replies',
    icon: 'fas fa-fire',
  },
  {
    label: 'Event of the Week',
    title: 'AI Study Circle',
    subtitle: '24 participants joined',
    icon: 'fas fa-star',
  },
];

// ── Mock Approved Profile ──

export const mockApprovedProfile: NovaIdProfile = {
  novaId: 'NOVA245113',
  fullName: 'Arjun Reddy',
  department: 'IT',
  year: '3rd',
  joinedAt: 'June 2026',
  status: 'approved',
  applicationId: 'NOVA-APP-00113',
  gamification: {
    level: 'contributor',
    badges: [
      {
        id: 'badge-001',
        label: 'First Discussion',
        icon: 'fas fa-comment',
        description: 'Created your first discussion post',
        earnedAt: '2026-05-15',
      },
      {
        id: 'badge-002',
        label: 'Hackathon Champion',
        icon: 'fas fa-trophy',
        description: 'Participated in a hackathon event',
        earnedAt: '2026-05-20',
      },
      {
        id: 'badge-003',
        label: 'Event Host',
        icon: 'fas fa-calendar-check',
        description: 'Hosted a community event',
        earnedAt: '2026-06-01',
      },
    ],
    points: {
      discussionsCreated: 30,
      repliesPosted: 45,
      eventsJoined: 60,
      likesReceived: 43,
      total: 178,
    },
    nextLevelAt: 250,
  },
};

// ── Available Badges ──

export const allBadges: MemberBadge[] = [
  { id: 'b-01', label: 'Top Contributor', icon: 'fas fa-crown', description: 'Among the top 10% of community contributors', earnedAt: '' },
  { id: 'b-02', label: 'Hackathon Champion', icon: 'fas fa-trophy', description: 'Participated in a hackathon event', earnedAt: '' },
  { id: 'b-03', label: 'Event Host', icon: 'fas fa-calendar-check', description: 'Hosted a community event', earnedAt: '' },
  { id: 'b-04', label: 'Community Mentor', icon: 'fas fa-graduation-cap', description: 'Helped 10+ students in discussions', earnedAt: '' },
  { id: 'b-05', label: 'First Discussion', icon: 'fas fa-comment', description: 'Created your first discussion post', earnedAt: '' },
  { id: 'b-06', label: 'Open Source Hero', icon: 'fas fa-code-branch', description: 'Contributed to open source projects', earnedAt: '' },
  { id: 'b-07', label: 'Streak Master', icon: 'fas fa-fire', description: 'Active for 7 consecutive days', earnedAt: '' },
  { id: 'b-08', label: 'Knowledge Sharer', icon: 'fas fa-book-open', description: 'Shared 5+ resources with the community', earnedAt: '' },
];

// ── Moderation Data ──

export const pendingIdRequests: PendingIdRequest[] = [
  {
    applicationId: 'NOVA-APP-00247',
    fullName: 'Sai Pranav',
    department: 'CSE',
    year: '2nd',
    rollNumber: '24R11A0547',
    motivation: 'I want to connect with like-minded peers and participate in hackathons.',
    submittedAt: '2026-06-05T14:00:00Z',
  },
  {
    applicationId: 'NOVA-APP-00248',
    fullName: 'Lakshmi Sravani',
    department: 'AIML',
    year: '1st',
    rollNumber: '25R11A7312',
    motivation: 'Passionate about AI/ML and want to learn from seniors and community mentors.',
    submittedAt: '2026-06-05T16:30:00Z',
  },
  {
    applicationId: 'NOVA-APP-00249',
    fullName: 'Mohammed Faizan',
    department: 'ECE',
    year: '3rd',
    rollNumber: '23R11A0419',
    motivation: 'Interested in IoT and embedded systems. Want to find project collaborators.',
    submittedAt: '2026-06-06T09:00:00Z',
  },
];

export const reportedDiscussions: ReportedDiscussion[] = [
  {
    discussionId: 'disc-rpt-01',
    title: 'Selling old textbooks — contact me',
    authorName: 'Unknown User',
    reportCount: 4,
    reason: 'Spam / Off-topic',
  },
  {
    discussionId: 'disc-rpt-02',
    title: 'This professor is terrible...',
    authorName: 'Anonymous',
    reportCount: 7,
    reason: 'Inappropriate / Harassment',
  },
];

// ── Discussion Category Metadata ──

export const discussionCategories: Array<{
  id: string;
  label: string;
  icon: string;
  color: string;
}> = [
  { id: 'all', label: 'All', icon: 'fas fa-globe', color: '#94a3b8' },
  { id: 'general', label: 'General', icon: 'fas fa-comments', color: '#8b5cf6' },
  { id: 'hackathons', label: 'Hackathons', icon: 'fas fa-laptop-code', color: '#f59e0b' },
  { id: 'placements', label: 'Placements', icon: 'fas fa-briefcase', color: '#3b82f6' },
  { id: 'ai-ml', label: 'AI/ML', icon: 'fas fa-brain', color: '#ec4899' },
  { id: 'web-development', label: 'Web Dev', icon: 'fas fa-code', color: '#10b981' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: 'fas fa-shield-alt', color: '#ef4444' },
  { id: 'projects', label: 'Projects', icon: 'fas fa-project-diagram', color: '#06b6d4' },
  { id: 'open-source', label: 'Open Source', icon: 'fas fa-code-branch', color: '#84cc16' },
];

// ── Event Type Metadata ──

export const eventTypeLabels: Record<string, { label: string; icon: string; color: string }> = {
  'study-circle': { label: 'Study Circle', icon: 'fas fa-book', color: '#8b5cf6' },
  'tech-meetup': { label: 'Tech Meetup', icon: 'fas fa-users', color: '#3b82f6' },
  'resume-review': { label: 'Resume Review', icon: 'fas fa-file-alt', color: '#f59e0b' },
  'mock-interview': { label: 'Mock Interview', icon: 'fas fa-user-tie', color: '#ec4899' },
  'hackathon-prep': { label: 'Hackathon Prep', icon: 'fas fa-rocket', color: '#ef4444' },
  'open-source-sprint': { label: 'Open Source Sprint', icon: 'fas fa-code-branch', color: '#10b981' },
};

// ── Member Level Metadata ──

export const memberLevels: Array<{
  id: string;
  label: string;
  icon: string;
  color: string;
  minPoints: number;
  description: string;
}> = [
  { id: 'explorer', label: 'Explorer', icon: 'fas fa-compass', color: '#94a3b8', minPoints: 0, description: 'Just getting started' },
  { id: 'contributor', label: 'Contributor', icon: 'fas fa-hand-holding-heart', color: '#3b82f6', minPoints: 100, description: 'Actively contributing to the community' },
  { id: 'mentor', label: 'Mentor', icon: 'fas fa-graduation-cap', color: '#8b5cf6', minPoints: 500, description: 'Guiding others in their journey' },
  { id: 'core-member', label: 'Core Member', icon: 'fas fa-star', color: '#f59e0b', minPoints: 1000, description: 'NOVA leadership & impact' },
];

// ── Points Configuration ──

export const pointsConfig: Array<{ action: string; points: number; icon: string }> = [
  { action: 'Discussions Created', points: 10, icon: 'fas fa-comment-dots' },
  { action: 'Replies Posted', points: 5, icon: 'fas fa-reply' },
  { action: 'Events Joined', points: 20, icon: 'fas fa-calendar-check' },
  { action: 'Likes Received', points: 1, icon: 'fas fa-heart' },
];
