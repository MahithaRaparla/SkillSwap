// Seed data for SkillSwap community network

export const DEMO_CATEGORIES = [
  { id: 'programming', name: 'Programming & Tech', icon: 'Code', color: 'indigo' },
  { id: 'design', name: 'Design & UI/UX', icon: 'Palette', color: 'purple' },
  { id: 'business', name: 'Business & Marketing', icon: 'TrendingUp', color: 'emerald' },
  { id: 'creative', name: 'Creative & Media', icon: 'Video', color: 'rose' },
  { id: 'communication', name: 'Communication & Soft Skills', icon: 'MessageSquare', color: 'amber' },
  { id: 'data', name: 'Data Science & AI', icon: 'Database', color: 'cyan' },
  { id: 'other', name: 'Other Skills', icon: 'Sparkles', color: 'slate' }
];

export const DEMO_SKILL_CATALOG = [
  // Programming
  { name: 'JavaScript', category: 'Programming & Tech' },
  { name: 'Python', category: 'Programming & Tech' },
  { name: 'React', category: 'Programming & Tech' },
  { name: 'Node.js', category: 'Programming & Tech' },
  { name: 'Java', category: 'Programming & Tech' },
  { name: 'C++', category: 'Programming & Tech' },
  { name: 'TypeScript', category: 'Programming & Tech' },
  { name: 'SQL', category: 'Programming & Tech' },

  // Design
  { name: 'UI/UX Design', category: 'Design & UI/UX' },
  { name: 'Figma', category: 'Design & UI/UX' },
  { name: 'Graphic Design', category: 'Design & UI/UX' },
  { name: 'Photoshop', category: 'Design & UI/UX' },
  { name: 'User Research', category: 'Design & UI/UX' },

  // Business
  { name: 'Digital Marketing', category: 'Business & Marketing' },
  { name: 'SEO Strategy', category: 'Business & Marketing' },
  { name: 'Entrepreneurship', category: 'Business & Marketing' },
  { name: 'Product Management', category: 'Business & Marketing' },
  { name: 'Finance & Budgeting', category: 'Business & Marketing' },

  // Creative
  { name: 'Video Editing', category: 'Creative & Media' },
  { name: 'Photography', category: 'Creative & Media' },
  { name: 'Content Writing', category: 'Creative & Media' },
  { name: 'Audio Production', category: 'Creative & Media' },

  // Communication
  { name: 'Public Speaking', category: 'Communication & Soft Skills' },
  { name: 'Presentation Skills', category: 'Communication & Soft Skills' },
  { name: 'Leadership & Teamwork', category: 'Communication & Soft Skills' },
  { name: 'Technical Writing', category: 'Communication & Soft Skills' },

  // Data
  { name: 'Data Science', category: 'Data Science & AI' },
  { name: 'Machine Learning', category: 'Data Science & AI' },
  { name: 'Data Analytics', category: 'Data Science & AI' },
  { name: 'PowerBI / Tableau', category: 'Data Science & AI' }
];

export const INITIAL_USERS = [
  {
    id: 'user_alex_rivera',
    username: 'alexrivera',
    email: 'alex@example.com',
    password: 'password123',
    fullName: 'Alex Rivera',
    status: 'Student',
    location: 'San Francisco, CA',
    institution: 'UC Berkeley',
    education: 'B.S. Computer Science (Senior)',
    experience: 'Web Dev Intern at TechCorp',
    bio: 'Passionate about frontend architecture, UI performance, and building accessible web applications. Looking to expand into UI/UX design and Python data processing!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    portfolio: 'https://alexrivera.dev',
    github: 'https://github.com/alexrivera',
    linkedin: 'https://linkedin.com/in/alexrivera',
    interests: ['Programming', 'Design', 'Data Science', 'Public Speaking'],
    joinedDate: '2026-01-15',
    isCurrent: true
  },
  {
    id: 'user_sarah_chen',
    username: 'sarahchen',
    email: 'sarah@example.com',
    password: 'password123',
    fullName: 'Sarah Chen',
    status: 'Professional',
    location: 'Seattle, WA',
    institution: 'Univ. of Washington Alumni',
    education: 'M.S. Human-Computer Interaction',
    experience: 'Lead Product Designer at DesignStudio',
    bio: '10+ years of UI/UX design, design systems, and Figma mastery. Eager to master JavaScript and React to turn my high-fidelity prototypes into live code!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    portfolio: 'https://sarahchendesign.com',
    github: 'https://github.com/sarahchen',
    linkedin: 'https://linkedin.com/in/sarahchen',
    interests: ['Design', 'Programming', 'Video Editing'],
    joinedDate: '2026-02-01'
  },
  {
    id: 'user_marcus_vance',
    username: 'marcusv',
    email: 'marcus@example.com',
    password: 'password123',
    fullName: 'Marcus Vance',
    status: 'Professional',
    location: 'Austin, TX',
    institution: 'UT Austin Alum',
    education: 'B.S. Software Engineering',
    experience: 'Senior Python & Machine Learning Engineer',
    bio: 'Building AI data pipelines and automated tools. Happy to teach Python & Data Analytics in exchange for learning Public Speaking and Figma basics!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    portfolio: 'https://marcusvance.io',
    github: 'https://github.com/marcusvance',
    linkedin: 'https://linkedin.com/in/marcusvance',
    interests: ['Data Science', 'Programming', 'Public Speaking'],
    joinedDate: '2026-02-10'
  },
  {
    id: 'user_elena_rodriguez',
    username: 'elenarodriguez',
    email: 'elena@example.com',
    password: 'password123',
    fullName: 'Elena Rodriguez',
    status: 'Student',
    location: 'Boston, MA',
    institution: 'MIT',
    education: 'M.S. Business Analytics',
    experience: 'Digital Marketing Lead for Student Startup',
    bio: 'Growth strategist, SEO expert, and content writer. Looking for a mentor in Data Analytics and Python scripting for automated marketing analytics.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    portfolio: 'https://elenamarketing.co',
    github: 'https://github.com/elenarodriguez',
    linkedin: 'https://linkedin.com/in/elenarodriguez',
    interests: ['Business', 'Data Science', 'Writing'],
    joinedDate: '2026-02-14'
  },
  {
    id: 'user_david_kim',
    username: 'davidkim',
    email: 'david@example.com',
    password: 'password123',
    fullName: 'David Kim',
    status: 'Professional',
    location: 'New York, NY',
    institution: 'Columbia University',
    education: 'B.A. Film & Digital Media',
    experience: 'Senior Video Editor & Content Creator (100k+ subscribers)',
    bio: 'Professional video editor specializing in Premiere Pro, After Effects, and YouTube content optimization. Wanting to learn React & Web Development.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    portfolio: 'https://davidkimedits.com',
    github: 'https://github.com/davidkimedits',
    linkedin: 'https://linkedin.com/in/davidkimedits',
    interests: ['Creative', 'Video Editing', 'Programming'],
    joinedDate: '2026-02-20'
  },
  {
    id: 'user_priya_patel',
    username: 'priyapatel',
    email: 'priya@example.com',
    password: 'password123',
    fullName: 'Priya Patel',
    status: 'Student',
    location: 'Chicago, IL',
    institution: 'Northwestern University',
    education: 'B.S. Data Science & Statistics',
    experience: 'Undergraduate Research Assistant',
    bio: 'Passionate about machine learning models, SQL, and data visualization in Tableau. I teach Data Science & Python and want to learn UX Research & Public Speaking.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    portfolio: 'https://priyapatel.tech',
    github: 'https://github.com/priyapatel',
    linkedin: 'https://linkedin.com/in/priyapatel',
    interests: ['Data Science', 'Design', 'Public Speaking'],
    joinedDate: '2026-02-25'
  },
  {
    id: 'user_james_wilson',
    username: 'jwilson',
    email: 'james@example.com',
    password: 'password123',
    fullName: 'James Wilson',
    status: 'Professional',
    location: 'San Jose, CA',
    institution: 'Stanford University Alum',
    education: 'M.S. Computer Science',
    experience: 'Staff Java & Cloud Architect',
    bio: 'Cloud architecture expert, Java backend developer, microservices guru. Looking to exchange Java backend mentoring for Frontend React & UI/UX design lessons.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    portfolio: 'https://jameswilson.cloud',
    github: 'https://github.com/jwilsoncloud',
    linkedin: 'https://linkedin.com/in/jameswilson',
    interests: ['Programming', 'Cloud', 'Design'],
    joinedDate: '2026-03-01'
  },
  {
    id: 'user_hannah_abbott',
    username: 'hannaha',
    email: 'hannah@example.com',
    password: 'password123',
    fullName: 'Hannah Abbott',
    status: 'Student',
    location: 'Atlanta, GA',
    institution: 'Georgia Tech',
    education: 'B.S. Industrial Design',
    experience: 'Freelance Illustrator & Figma Enthusiast',
    bio: 'Visual designer specializing in Figma prototyping, vector illustrations, and brand identity. Seeking partners to help me learn JavaScript and Node.js.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    portfolio: 'https://hannahabbott.design',
    github: 'https://github.com/hannahabbott',
    linkedin: 'https://linkedin.com/in/hannahabbott',
    interests: ['Design', 'Creative', 'Programming'],
    joinedDate: '2026-03-02'
  }
];

export const INITIAL_SKILLS = [
  // Alex Rivera (CurrentUser)
  {
    id: 'sk_alex_1',
    userId: 'user_alex_rivera',
    type: 'teach',
    name: 'JavaScript',
    category: 'Programming & Tech',
    proficiency: 'Advanced',
    yearsExperience: 4,
    description: 'DOM manipulation, ES6+, Async/Await, Webpack, and modern client-side architectures.',
    active: true
  },
  {
    id: 'sk_alex_2',
    userId: 'user_alex_rivera',
    type: 'teach',
    name: 'React',
    category: 'Programming & Tech',
    proficiency: 'Advanced',
    yearsExperience: 3,
    description: 'React Hooks, Context API, React Router, Tailwind integration, custom hooks.',
    active: true
  },
  {
    id: 'sk_alex_3',
    userId: 'user_alex_rivera',
    type: 'learn',
    name: 'UI/UX Design',
    category: 'Design & UI/UX',
    priority: 'High',
    targetProficiency: 'Intermediate',
    description: 'Want to understand user journeys, wireframing, layout hierarchy, and accessibility guidelines.',
    active: true
  },
  {
    id: 'sk_alex_4',
    userId: 'user_alex_rivera',
    type: 'learn',
    name: 'Python',
    category: 'Programming & Tech',
    priority: 'Medium',
    targetProficiency: 'Intermediate',
    description: 'Want to write clean Python scripts, work with Pandas, and build simple REST APIs in FastAPI.',
    active: true
  },

  // Sarah Chen
  {
    id: 'sk_sarah_1',
    userId: 'user_sarah_chen',
    type: 'teach',
    name: 'UI/UX Design',
    category: 'Design & UI/UX',
    proficiency: 'Expert',
    yearsExperience: 8,
    description: 'End-to-end product design, wireframing, design systems, usability testing, and design strategy.',
    active: true
  },
  {
    id: 'sk_sarah_2',
    userId: 'user_sarah_chen',
    type: 'teach',
    name: 'Figma',
    category: 'Design & UI/UX',
    proficiency: 'Expert',
    yearsExperience: 6,
    description: 'Advanced auto-layout, interactive components, tokens, variable modes, and team libraries.',
    active: true
  },
  {
    id: 'sk_sarah_3',
    userId: 'user_sarah_chen',
    type: 'learn',
    name: 'React',
    category: 'Programming & Tech',
    priority: 'High',
    targetProficiency: 'Intermediate',
    description: 'Looking to turn Figma UI designs into interactive React component libraries.',
    active: true
  },
  {
    id: 'sk_sarah_4',
    userId: 'user_sarah_chen',
    type: 'learn',
    name: 'JavaScript',
    category: 'Programming & Tech',
    priority: 'High',
    targetProficiency: 'Intermediate',
    description: 'Need assistance with JavaScript logic, state management, and API calls.',
    active: true
  },

  // Marcus Vance
  {
    id: 'sk_marcus_1',
    userId: 'user_marcus_vance',
    type: 'teach',
    name: 'Python',
    category: 'Programming & Tech',
    proficiency: 'Expert',
    yearsExperience: 7,
    description: 'Core Python, OOP, data processing scripts, Pandas, Numpy, and Flask/FastAPI backends.',
    active: true
  },
  {
    id: 'sk_marcus_2',
    userId: 'user_marcus_vance',
    type: 'teach',
    name: 'Data Analytics',
    category: 'Data Science & AI',
    proficiency: 'Advanced',
    yearsExperience: 5,
    description: 'SQL queries, data cleaning, automated reporting pipelines, and interactive dashboards.',
    active: true
  },
  {
    id: 'sk_marcus_3',
    userId: 'user_marcus_vance',
    type: 'learn',
    name: 'Public Speaking',
    category: 'Communication & Soft Skills',
    priority: 'High',
    targetProficiency: 'Intermediate',
    description: 'Preparing for tech conference presentations; need tips on speech delivery and slide structure.',
    active: true
  },

  // Elena Rodriguez
  {
    id: 'sk_elena_1',
    userId: 'user_elena_rodriguez',
    type: 'teach',
    name: 'Digital Marketing',
    category: 'Business & Marketing',
    proficiency: 'Advanced',
    yearsExperience: 4,
    description: 'Social media growth strategy, campaign funnels, customer acquisition, and brand voice.',
    active: true
  },
  {
    id: 'sk_elena_2',
    userId: 'user_elena_rodriguez',
    type: 'learn',
    name: 'Python',
    category: 'Programming & Tech',
    priority: 'High',
    targetProficiency: 'Beginner',
    description: 'Want to automate data collection and web scraping for marketing analytics.',
    active: true
  },

  // David Kim
  {
    id: 'sk_david_1',
    userId: 'user_david_kim',
    type: 'teach',
    name: 'Video Editing',
    category: 'Creative & Media',
    proficiency: 'Expert',
    yearsExperience: 6,
    description: 'Adobe Premiere Pro, After Effects motion graphics, color grading, and storytelling.',
    active: true
  },
  {
    id: 'sk_david_2',
    userId: 'user_david_kim',
    type: 'learn',
    name: 'React',
    category: 'Programming & Tech',
    priority: 'Medium',
    targetProficiency: 'Beginner',
    description: 'Want to build a custom interactive portfolio site for my video editing studio.',
    active: true
  },

  // Priya Patel
  {
    id: 'sk_priya_1',
    userId: 'user_priya_patel',
    type: 'teach',
    name: 'Data Science',
    category: 'Data Science & AI',
    proficiency: 'Advanced',
    yearsExperience: 3,
    description: 'Statistical modeling, exploratory data analysis, data storytelling, and Jupyter workflows.',
    active: true
  },
  {
    id: 'sk_priya_2',
    userId: 'user_priya_patel',
    type: 'learn',
    name: 'UI/UX Design',
    category: 'Design & UI/UX',
    priority: 'High',
    targetProficiency: 'Intermediate',
    description: 'Designing better charts and dashboards for data visualizer applications.',
    active: true
  },

  // James Wilson
  {
    id: 'sk_james_1',
    userId: 'user_james_1',
    type: 'teach',
    name: 'Java',
    category: 'Programming & Tech',
    proficiency: 'Expert',
    yearsExperience: 9,
    description: 'Spring Boot, object-oriented design patterns, enterprise microservices, and backend APIs.',
    active: true
  },
  {
    id: 'sk_james_2',
    userId: 'user_james_1',
    type: 'learn',
    name: 'React',
    category: 'Programming & Tech',
    priority: 'High',
    targetProficiency: 'Intermediate',
    description: 'Want to transition to full-stack dev by learning modern React frontends.',
    active: true
  },

  // Hannah Abbott
  {
    id: 'sk_hannah_1',
    userId: 'user_hannah_abbott',
    type: 'teach',
    name: 'Figma',
    category: 'Design & UI/UX',
    proficiency: 'Advanced',
    yearsExperience: 4,
    description: 'UI prototyping, visual design, custom icons, wireframing, and component libraries.',
    active: true
  },
  {
    id: 'sk_hannah_2',
    userId: 'user_hannah_abbott',
    type: 'learn',
    name: 'JavaScript',
    category: 'Programming & Tech',
    priority: 'High',
    targetProficiency: 'Intermediate',
    description: 'Want to code interactive web animations and front-end tools.',
    active: true
  }
];

export const INITIAL_GOALS = [
  {
    id: 'goal_react_1',
    userId: 'user_alex_rivera',
    title: 'Master UI/UX Design Fundamentals',
    skill: 'UI/UX Design',
    category: 'Design & UI/UX',
    description: 'Learn wireframing, color hierarchy, typography rules, and component states in Figma.',
    startDate: '2026-08-15',
    targetCompletionDate: '2026-10-15',
    currentProgress: 65,
    targetLevel: 'Intermediate',
    priority: 'High',
    status: 'Active',
    milestones: [
      { id: 'm1', title: 'Understand Typography & Color Systems', completed: true, dateCompleted: '2026-08-20' },
      { id: 'm2', title: 'Create Low-Fidelity Wireframes', completed: true, dateCompleted: '2026-08-28' },
      { id: 'm3', title: 'Master Auto-Layout in Figma', completed: true, dateCompleted: '2026-09-02' },
      { id: 'm4', title: 'Build High-Fidelity Prototype', completed: false, dateCompleted: null },
      { id: 'm5', title: 'Perform Usability Testing Session', completed: false, dateCompleted: null }
    ]
  },
  {
    id: 'goal_python_2',
    userId: 'user_alex_rivera',
    title: 'Learn Python Scripting & Data Parsing',
    skill: 'Python',
    category: 'Programming & Tech',
    description: 'Build basic automation scripts, parse JSON/CSV files, and execute REST API calls.',
    startDate: '2026-09-01',
    targetCompletionDate: '2026-11-01',
    currentProgress: 40,
    targetLevel: 'Intermediate',
    priority: 'Medium',
    status: 'Active',
    milestones: [
      { id: 'pm1', title: 'Python Syntax & Data Structures', completed: true, dateCompleted: '2026-09-05' },
      { id: 'pm2', title: 'Functions, Modules, and OOP Basics', completed: true, dateCompleted: '2026-09-08' },
      { id: 'pm3', title: 'File Handling & CSV Parsing with Pandas', completed: false, dateCompleted: null },
      { id: 'pm4', title: 'Build a Python Web Scraper', completed: false, dateCompleted: null }
    ]
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act_1',
    userId: 'user_alex_rivera',
    title: 'UI/UX Feedback & Figma Auto-Layout Session',
    skill: 'UI/UX Design',
    category: 'Design & UI/UX',
    activityType: 'Teaching Session', // or Mutual Exchange
    sessionType: 'Mutual Exchange',
    date: '2026-09-10',
    durationMinutes: 75,
    partnerId: 'user_sarah_chen',
    partnerName: 'Sarah Chen',
    description: 'Sarah demonstrated auto-layout & component variants in Figma. In return, I reviewed her React project component hierarchy.',
    rating: 5,
    notes: 'Very helpful session! Improved my layout structure drastically.'
  },
  {
    id: 'act_2',
    userId: 'user_alex_rivera',
    title: 'Python Scripting Practice & Exercises',
    skill: 'Python',
    category: 'Programming & Tech',
    activityType: 'Self Learning',
    sessionType: 'Self Learning',
    date: '2026-09-09',
    durationMinutes: 60,
    partnerId: null,
    partnerName: null,
    description: 'Completed Python list comprehensions, dictionary operations, and written 3 sample scripts.',
    rating: 4,
    notes: 'Felt comfortable with list comprehensions.'
  },
  {
    id: 'act_3',
    userId: 'user_alex_rivera',
    title: 'React Custom Hooks Mentoring Session',
    skill: 'React',
    category: 'Programming & Tech',
    activityType: 'Teaching Session',
    sessionType: 'Teaching',
    date: '2026-09-08',
    durationMinutes: 90,
    partnerId: 'user_david_kim',
    partnerName: 'David Kim',
    description: 'Taught David how useEffect works and built a custom useLocalStorage hook for his portfolio site.',
    rating: 5,
    notes: 'David understood state management quickly.'
  },
  {
    id: 'act_4',
    userId: 'user_alex_rivera',
    title: 'Figma Low-Fidelity Wireframing Practice',
    skill: 'UI/UX Design',
    category: 'Design & UI/UX',
    activityType: 'Practice',
    sessionType: 'Practice',
    date: '2026-09-07',
    durationMinutes: 45,
    partnerId: null,
    partnerName: null,
    description: 'Sketched out 5 wireframe options for mobile responsive dashboard views.',
    rating: 4,
    notes: 'Focused on grid spacing.'
  },
  {
    id: 'act_5',
    userId: 'user_alex_rivera',
    title: 'JavaScript Performance & Memory Discussion',
    skill: 'JavaScript',
    category: 'Programming & Tech',
    activityType: 'Discussion',
    sessionType: 'Discussion',
    date: '2026-09-06',
    durationMinutes: 60,
    partnerId: 'user_james_wilson',
    partnerName: 'James Wilson',
    description: 'Discussed event loop performance, closure memory usage, and garbage collection mechanisms in Chrome V8.',
    rating: 5,
    notes: 'Great insight into memory management.'
  }
];

export const INITIAL_CONNECTIONS = [
  {
    id: 'conn_1',
    requesterId: 'user_alex_rivera',
    receiverId: 'user_sarah_chen',
    status: 'Accepted',
    createdAt: '2026-08-25'
  },
  {
    id: 'conn_2',
    requesterId: 'user_marcus_vance',
    receiverId: 'user_alex_rivera',
    status: 'Accepted',
    createdAt: '2026-08-28'
  },
  {
    id: 'conn_3',
    requesterId: 'user_david_kim',
    receiverId: 'user_alex_rivera',
    status: 'Accepted',
    createdAt: '2026-09-01'
  },
  {
    id: 'conn_4',
    requesterId: 'user_alex_rivera',
    receiverId: 'user_priya_patel',
    status: 'Pending',
    createdAt: '2026-09-09'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    userId: 'user_alex_rivera',
    title: 'Match Recommendation',
    message: '94% Mutual Skill Match with Sarah Chen! She can teach UI/UX Design and wants to learn React.',
    type: 'match',
    read: false,
    date: '2026-09-10T10:30:00Z'
  },
  {
    id: 'notif_2',
    userId: 'user_alex_rivera',
    title: 'Connection Accepted',
    message: 'Marcus Vance accepted your connection request.',
    type: 'connection',
    read: true,
    date: '2026-09-08T14:15:00Z'
  },
  {
    id: 'notif_3',
    userId: 'user_alex_rivera',
    title: 'Streak Milestone Unlocked! 🔥',
    message: 'Awesome consistency! You reached a 5-day learning streak.',
    type: 'streak',
    read: true,
    date: '2026-09-09T18:00:00Z'
  }
];

export const ACHIEVEMENTS_DEFINITION = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Record your first learning or teaching activity.',
    category: 'Activity',
    icon: 'Footprints',
    badgeColor: 'emerald'
  },
  {
    id: 'goal_getter',
    title: 'Goal Getter',
    description: 'Set and complete your first learning goal.',
    category: 'Goals',
    icon: 'Target',
    badgeColor: 'indigo'
  },
  {
    id: 'consistent_learner',
    title: 'Consistent Learner',
    description: 'Maintain a 7-day learning streak.',
    category: 'Streak',
    icon: 'Flame',
    badgeColor: 'amber'
  },
  {
    id: 'knowledge_sharer',
    title: 'Knowledge Sharer',
    description: 'Complete your first teaching or mutual exchange session.',
    category: 'Sharing',
    icon: 'GraduationCap',
    badgeColor: 'purple'
  },
  {
    id: 'skill_explorer',
    title: 'Skill Explorer',
    description: 'Add 4 or more skills to your teach and learn lists.',
    category: 'Skills',
    icon: 'Compass',
    badgeColor: 'blue'
  },
  {
    id: 'community_builder',
    title: 'Community Builder',
    description: 'Connect with 3 or more skill exchange partners.',
    category: 'Community',
    icon: 'Users',
    badgeColor: 'pink'
  },
  {
    id: 'learning_champion',
    title: 'Learning Champion',
    description: 'Complete 10 or more learning sessions.',
    category: 'Activity',
    icon: 'Trophy',
    badgeColor: 'yellow'
  },
  {
    id: 'skill_master',
    title: 'Skill Master',
    description: 'Reach 100% completion on a skill goal.',
    category: 'Goals',
    icon: 'Award',
    badgeColor: 'cyan'
  },
  {
    id: 'dedicated_learner',
    title: 'Dedicated Learner',
    description: 'Accumulate 10+ hours of total learning duration.',
    category: 'Analytics',
    icon: 'Clock',
    badgeColor: 'violet'
  }
];
