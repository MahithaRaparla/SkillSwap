import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Skill } from './models/Skill.js';
import { Goal } from './models/Goal.js';
import { Activity } from './models/Activity.js';
import { Connection } from './models/Connection.js';
import { Notification } from './models/Notification.js';

dotenv.config();

const INITIAL_USERS = [
  {
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
    interests: ['Programming', 'Design', 'Data Science', 'Public Speaking']
  },
  {
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
    interests: ['Design', 'Programming', 'Video Editing']
  },
  {
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
    interests: ['Data Science', 'Programming', 'Public Speaking']
  },
  {
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
    interests: ['Business', 'Data Science', 'Writing']
  },
  {
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
    interests: ['Creative', 'Video Editing', 'Programming']
  },
  {
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
    interests: ['Data Science', 'Design', 'Public Speaking']
  }
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for Seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Goal.deleteMany({});
    await Activity.deleteMany({});
    await Connection.deleteMany({});
    await Notification.deleteMany({});

    console.log('🧹 Cleared existing database records.');

    // Insert Users
    const createdUsers = [];
    for (const u of INITIAL_USERS) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`✅ Seeded ${createdUsers.length} initial users.`);

    const [alex, sarah, marcus, elena, david, priya] = createdUsers;

    // Insert Skills
    const skillsData = [
      { userId: alex._id, type: 'teach', name: 'JavaScript', category: 'Programming & Tech', proficiency: 'Advanced', yearsExperience: 4, description: 'DOM manipulation, ES6+, Async/Await, Webpack, and modern client-side architectures.' },
      { userId: alex._id, type: 'teach', name: 'React', category: 'Programming & Tech', proficiency: 'Advanced', yearsExperience: 3, description: 'React Hooks, Context API, React Router, Tailwind integration, custom hooks.' },
      { userId: alex._id, type: 'learn', name: 'UI/UX Design', category: 'Design & UI/UX', priority: 'High', targetProficiency: 'Intermediate', description: 'Understand user journeys, wireframing, layout hierarchy, and accessibility guidelines.' },
      { userId: alex._id, type: 'learn', name: 'Python', category: 'Programming & Tech', priority: 'Medium', targetProficiency: 'Intermediate', description: 'Write clean Python scripts, work with Pandas, and build simple REST APIs.' },

      { userId: sarah._id, type: 'teach', name: 'UI/UX Design', category: 'Design & UI/UX', proficiency: 'Expert', yearsExperience: 8, description: 'End-to-end product design, wireframing, design systems, usability testing.' },
      { userId: sarah._id, type: 'teach', name: 'Figma', category: 'Design & UI/UX', proficiency: 'Expert', yearsExperience: 6, description: 'Advanced auto-layout, interactive components, tokens, variable modes.' },
      { userId: sarah._id, type: 'learn', name: 'React', category: 'Programming & Tech', priority: 'High', targetProficiency: 'Intermediate', description: 'Turn Figma UI designs into interactive React component libraries.' },

      { userId: marcus._id, type: 'teach', name: 'Python', category: 'Programming & Tech', proficiency: 'Expert', yearsExperience: 7, description: 'Core Python, OOP, data processing scripts, Pandas, Numpy, and Flask/FastAPI.' },
      { userId: marcus._id, type: 'teach', name: 'Data Analytics', category: 'Data Science & AI', proficiency: 'Advanced', yearsExperience: 5, description: 'SQL queries, data cleaning, automated reporting pipelines.' },
      { userId: marcus._id, type: 'learn', name: 'Public Speaking', category: 'Communication & Soft Skills', priority: 'High', targetProficiency: 'Intermediate', description: 'Tech conference presentations; speech delivery and slide structure.' },

      { userId: elena._id, type: 'teach', name: 'Digital Marketing', category: 'Business & Marketing', proficiency: 'Advanced', yearsExperience: 4, description: 'Social media growth strategy, campaign funnels, customer acquisition.' },
      { userId: elena._id, type: 'learn', name: 'Python', category: 'Programming & Tech', priority: 'High', targetProficiency: 'Beginner', description: 'Automate data collection and web scraping for marketing analytics.' },

      { userId: david._id, type: 'teach', name: 'Video Editing', category: 'Creative & Media', proficiency: 'Expert', yearsExperience: 6, description: 'Adobe Premiere Pro, After Effects motion graphics, color grading.' },
      { userId: david._id, type: 'learn', name: 'React', category: 'Programming & Tech', priority: 'Medium', targetProficiency: 'Beginner', description: 'Build a custom interactive portfolio site.' },

      { userId: priya._id, type: 'teach', name: 'Data Science', category: 'Data Science & AI', proficiency: 'Advanced', yearsExperience: 3, description: 'Statistical modeling, exploratory data analysis, data storytelling.' },
      { userId: priya._id, type: 'learn', name: 'UI/UX Design', category: 'Design & UI/UX', priority: 'High', targetProficiency: 'Intermediate', description: 'Design better charts and dashboards for data visualizer applications.' }
    ];

    await Skill.insertMany(skillsData);
    console.log(`✅ Seeded ${skillsData.length} skills.`);

    // Insert Goals for Alex
    const goalsData = [
      {
        userId: alex._id,
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
          { title: 'Understand Typography & Color Systems', completed: true, dateCompleted: '2026-08-20' },
          { title: 'Create Low-Fidelity Wireframes', completed: true, dateCompleted: '2026-08-28' },
          { title: 'Master Auto-Layout in Figma', completed: true, dateCompleted: '2026-09-02' },
          { title: 'Build High-Fidelity Prototype', completed: false, dateCompleted: null },
          { title: 'Perform Usability Testing Session', completed: false, dateCompleted: null }
        ]
      },
      {
        userId: alex._id,
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
          { title: 'Python Syntax & Data Structures', completed: true, dateCompleted: '2026-09-05' },
          { title: 'Functions, Modules, and OOP Basics', completed: true, dateCompleted: '2026-09-08' },
          { title: 'File Handling & CSV Parsing with Pandas', completed: false, dateCompleted: null },
          { title: 'Build a Python Web Scraper', completed: false, dateCompleted: null }
        ]
      }
    ];

    await Goal.insertMany(goalsData);
    console.log(`✅ Seeded ${goalsData.length} goals.`);

    // Insert Activities for Alex
    const activitiesData = [
      {
        userId: alex._id,
        title: 'UI/UX Feedback & Figma Auto-Layout Session',
        skill: 'UI/UX Design',
        category: 'Design & UI/UX',
        activityType: 'Teaching Session',
        sessionType: 'Mutual Exchange',
        date: '2026-09-10',
        durationMinutes: 75,
        partnerId: sarah._id,
        partnerName: sarah.fullName,
        description: 'Sarah demonstrated auto-layout & component variants in Figma. In return, I reviewed her React project component hierarchy.',
        rating: 5,
        notes: 'Very helpful session! Improved my layout structure drastically.'
      },
      {
        userId: alex._id,
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
      }
    ];

    await Activity.insertMany(activitiesData);
    console.log(`✅ Seeded ${activitiesData.length} activity entries.`);

    // Insert Connections
    const connectionsData = [
      { requesterId: alex._id, receiverId: sarah._id, status: 'Accepted' },
      { requesterId: marcus._id, receiverId: alex._id, status: 'Accepted' },
      { requesterId: david._id, receiverId: alex._id, status: 'Accepted' },
      { requesterId: alex._id, receiverId: priya._id, status: 'Pending' }
    ];

    await Connection.insertMany(connectionsData);
    console.log(`✅ Seeded ${connectionsData.length} connections.`);

    // Insert Notifications
    const notificationsData = [
      {
        userId: alex._id,
        title: 'Match Recommendation',
        message: '94% Mutual Skill Match with Sarah Chen! She can teach UI/UX Design and wants to learn React.',
        type: 'match',
        read: false
      },
      {
        userId: alex._id,
        title: 'Connection Accepted',
        message: 'Marcus Vance accepted your connection request.',
        type: 'connection',
        read: true
      }
    ];

    await Notification.insertMany(notificationsData);
    console.log(`✅ Seeded ${notificationsData.length} notifications.`);

    console.log('🚀 Database seeding complete successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
