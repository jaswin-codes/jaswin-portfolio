
// ─── Static asset URLs (uploaded via manus-upload-file --webdev) ───────────────
export const RESUME_URL = '/manus-storage/Jaswin_Research_CV_d1a4d9f5.pdf';
export const RESEARCH_POSTER_URL = '/manus-storage/research_poster_358fb6ff.png';

export const projects: Project[] = [
  {
    id: 'afriguard',
    name: 'AfriGuard',
    description: 'Multilingual Safety Red-Teaming for South African Languages',
    shortDescription: 'First comprehensive red-teaming framework for South African languages',
    techStack: ['Python', 'AI Safety', 'Red Teaming', 'LLM Evaluation', 'Streamlit'],
    details: `First comprehensive red-teaming evaluation framework targeting safety vulnerabilities in South African languages. Evaluated four frontier LLMs (GPT-OSS, Llama 3.3, Kimi K2.6, Qwen 3) across seven languages — English, isiZulu, isiXhosa, Afrikaans, Sesotho, Sepedi, and Tsonga.

Ran 1,120 adversarial evaluations (40 seed prompts × 7 languages × 4 models) across four harm categories endemic to South Africa: financial fraud, xenophobic incitement, political disinformation, and gang/criminal facilitation in 3 different styles (direct, roleplay and hypothetical).

Key finding: low-resource languages exhibit catastrophic safety failures with a mean Attack Success Rate (ASR) of 50.1% — more than double the English baseline of 24.4%. Certain model-language combinations reached >90% ASR.

Built an end-to-end evaluation pipeline with automated response generation, LLM-as-judge harm scoring, and publication-ready analytics. Discovered and corrected a critical classification bug in the judging pipeline, re-processed the full dataset, and published both versions transparently.

Created an interactive Streamlit dashboard for exploring results by model, language, and harm category.`,
    githubLink: 'https://github.com/ubayd-hattas/AfriGuard',
    liveLink: 'https://afriguard.streamlit.app/',
    thumbnail: 'https://opengraph.githubassets.com/1/ubayd-hattas/AfriGuard',
  },
  {
    id: 'hyperspectral',
    name: 'Hyperspectral Freshness',
    description: 'Predicting Post-Harvest Freshness Using Simulated Hyperspectral Signatures',
    shortDescription: 'Hardware model to capture real hyperspectral data coming soon',
    techStack: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Hyperspectral Imaging'],
    details: `Coming Soon: Hardware model to capture real hyperspectral data.

Developed a computational, theory-driven framework to predict post-harvest freshness in fruits and vegetables, serving as a low-cost, scalable alternative to traditional lab-based analysis.

Adapted key concepts from the University of Florida's FreshID research to model the relationship between simulated hyperspectral signatures, biochemical indicators (e.g., glucosinolates), and produce senescence.

Built a Python-based simulation to rank feature importance, successfully demonstrating that specific spectral regions (Red-edge at 760nm and NIR at 1100nm) are highly predictive of freshness before visible spoilage occurs.

Presented findings and methodologies to an academic panel as part of a STEM Research Methodology Workshop hosted by Scientific Caribbean Foundation, Inc.`,
    githubLink: 'https://github.com/jaswin-codes',
    thumbnail: RESEARCH_POSTER_URL,
  },
];

export const experiences: Experience[] = [
  {
    id: 'emi-lab',
    company: 'EMi Lab',
    role: 'Vacation Work Student',
    duration: 'Feb 2026 – Present',
    location: 'Cape Town, Western Cape, South Africa',
    description: 'Developing an ESP32-based safety vest using Bluetooth communication to relay signals to e-scooter controls.',
    bulletPoints: [
      '1 of 8 members developing an ESP32-based safety vest using Bluetooth communication to relay signals to e-scooter controls',
      'Integrating mmWave radar sensors for obstacle detection and real-time LED-based direction signaling',
      'Learning about Battery Management Systems (BMS) and Battery Health',
      'Authoring a technical report on swappable batteries for EV use',
    ],
    skills: ['ESP32', 'Bluetooth', 'mmWave Radar', 'BMS', 'Embedded Systems'],
    logo: 'https://via.placeholder.com/64?text=EMi+Lab',
  },
  {
    id: 'uct-racing',
    company: 'UCT Racing',
    role: 'Power Subsystem Member',
    duration: 'Feb 2026 – Present',
    location: 'Cape Town, Western Cape, South Africa',
    description: 'Collaborating on technical documentation for cooling architecture, specifically X2.4 fan integration.',
    bulletPoints: [
      'Collaborating on technical documentation for cooling architecture, specifically X2.4 fan integration',
      'Gaining knowledge on telemetry systems for communication of data',
    ],
    skills: ['C++', 'ESP32', 'Thermal Modelling', 'Formula Student', 'Battery Management'],
    logo: 'https://via.placeholder.com/64?text=UCT+Racing',
  },
  {
    id: 'scientific-caribbean',
    company: 'Scientific Caribbean Foundation, Inc.',
    role: 'Undergraduate Student Researcher',
    duration: 'May 2026',
    location: 'Cape Town, Western Cape, South Africa',
    description: 'Completed a 2-week STEM Research Methodology Workshop with independent research framework.',
    bulletPoints: [
      'Formulated independent, simulation-based research framework for post-harvest produce deterioration',
      'Adapted core concepts from University of Florida\'s FreshID project to low-cost constraints',
      'Evaluated simulated hyperspectral signatures and biochemical markers for freshness tracking',
      'Designed and presented research poster before academic panel of judges',
    ],
    skills: ['Python', 'Data Modeling', 'Hyperspectral Imaging', 'Research', 'Scikit-learn'],
    logo: 'https://via.placeholder.com/64?text=Scientific+Caribbean',
  },
];

export const research: Research[] = [
  {
    id: 'hyperspectral',
    title: 'Hyperspectral Freshness',
    organization: 'Scientific Caribbean Foundation, Inc.',
    date: 'May 2026',
    summary: 'Developed a computational framework to predict post-harvest freshness using simulated hyperspectral signatures as a low-cost alternative to lab-based analysis. Mentored by Dr. Juan F. Arratia (Scientific Caribbean Foundation) and Prof. Komla Folly (UCT).',
    methodology: 'Python-based simulation using NumPy, Pandas, Scikit-learn and Matplotlib. Feature importance ranking across spectral regions. Five-stage process: Literature Review → Variable Selection → Simulation Model → Feature Ranking → Theoretical Validation.',
    outcome: 'Demonstrated that Red-edge (760nm) and NIR (1100nm) spectral bands are highly predictive of freshness before visible spoilage. Freshness declines nonlinearly with faster drop after mid-storage. Presented research poster to academic panel.',
    skills: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Hyperspectral Imaging'],
    assets: {
      poster: RESEARCH_POSTER_URL,
    },
  },
  {
    id: 'afriguard',
    title: 'AfriGuard',
    organization: 'Global South AI Safety Hackathon',
    date: 'Jun 2026',
    summary: 'First comprehensive red-teaming framework for South African languages. Evaluated 4 frontier LLMs across 7 languages with 1,120 adversarial evaluations.',
    methodology: 'Automated adversarial evaluation pipeline, LLM-as-judge harm scoring, 4 harm categories × 3 attack styles × 7 languages × 4 models.',
    outcome: 'Discovered catastrophic safety failures in low-resource languages (50.1% ASR vs 24.4% English baseline). Published transparently with interactive Streamlit dashboard.',
    skills: ['AI Safety', 'Red Teaming', 'Python', 'LLM Evaluation', 'Streamlit'],
    assets: {
      paper: 'https://github.com/ubayd-hattas/AfriGuard',
    },
  },
];

export const achievements: Achievement[] = [
  {
    id: 'student-of-year',
    title: 'Student of the Year',
    type: 'Academic Achievement',
    date: 'Grade 11',
    description: 'Recognized as Student of the Year in Grade 11 for academic excellence and leadership.',
    waveformType: 'sine',
  },
  {
    id: 'presidents-award',
    title: "President's Award - Bronze",
    type: 'Community Service',
    date: '2024',
    description: "Awarded the President's Award at Bronze level for community service and personal development.",
    waveformType: 'square',
  },
  {
    id: 'chess-champion',
    title: 'National Chess Champion',
    type: 'Competitive Achievement',
    date: '2023',
    description: 'Achieved National Chess Champion title through competitive excellence and strategic mastery.',
    waveformType: 'ramp',
  },
];

export const skillClusters: SkillCluster[] = [
  {
    name: 'ml',
    label: 'Machine Learning',
    color: '#00ff88',
    skills: [
      { name: 'Python', proficiency: 'intermediate', cluster: 'ml' },
      { name: 'Scikit-learn', proficiency: 'intermediate', cluster: 'ml' },
      { name: 'NumPy', proficiency: 'intermediate', cluster: 'ml' },
      { name: 'Pandas', proficiency: 'intermediate', cluster: 'ml' },
      { name: 'Matplotlib', proficiency: 'intermediate', cluster: 'ml' },
      { name: 'Hyperspectral Imaging', proficiency: 'intermediate', cluster: 'ml' },
      { name: 'TensorFlow', proficiency: 'novice', cluster: 'ml' },
    ],
  },
  {
    name: 'ai-safety',
    label: 'AI Safety',
    color: '#ff0088',
    skills: [
      { name: 'Red-teaming', proficiency: 'intermediate', cluster: 'ai-safety' },
      { name: 'Prompt Engineering', proficiency: 'intermediate', cluster: 'ai-safety' },
      { name: 'AI Ethics', proficiency: 'novice', cluster: 'ai-safety' },
      { name: 'LLM Evaluation', proficiency: 'intermediate', cluster: 'ai-safety' },
    ],
  },
  {
    name: 'embedded',
    label: 'Embedded Systems',
    color: '#0088ff',
    skills: [
      { name: 'C Programming', proficiency: 'intermediate', cluster: 'embedded' },
      { name: 'C/C++', proficiency: 'intermediate', cluster: 'embedded' },
      { name: 'ESP32', proficiency: 'intermediate', cluster: 'embedded' },
      { name: 'mmWave Radar', proficiency: 'novice', cluster: 'embedded' },
      { name: 'RTOS', proficiency: 'novice', cluster: 'embedded' },
      { name: 'Circuit Logic', proficiency: 'novice', cluster: 'embedded' },
    ],
  },
  {
    name: 'power',
    label: 'Power / Energy',
    color: '#ffaa00',
    skills: [
      { name: 'MATLAB', proficiency: 'intermediate', cluster: 'power' },
      { name: 'Simulink', proficiency: 'intermediate', cluster: 'power' },
      { name: 'Simscape Onramp', proficiency: 'novice', cluster: 'power' },
      { name: 'Simscape Battery Onramp', proficiency: 'novice', cluster: 'power' },
      { name: 'Battery Thermal Management', proficiency: 'intermediate', cluster: 'power' },
      { name: 'Battery State Estimation', proficiency: 'novice', cluster: 'power' },
      { name: 'Circuit Design', proficiency: 'novice', cluster: 'power' },
      { name: 'KiCad', proficiency: 'novice', cluster: 'power' },
    ],
  },
  {
    name: 'web',
    label: 'Web Dev',
    color: '#ff6600',
    skills: [
      { name: 'React', proficiency: 'intermediate', cluster: 'web' },
      { name: 'TypeScript', proficiency: 'intermediate', cluster: 'web' },
      { name: 'Three.js', proficiency: 'novice', cluster: 'web' },
      { name: 'Tailwind', proficiency: 'intermediate', cluster: 'web' },
      { name: 'Streamlit', proficiency: 'intermediate', cluster: 'web' },
    ],
  },
  {
    name: 'tools',
    label: 'Tools',
    color: '#cccccc',
    skills: [
      { name: 'Git', proficiency: 'advanced', cluster: 'tools' },
      { name: 'GitHub', proficiency: 'advanced', cluster: 'tools' },
      { name: 'VS Code', proficiency: 'advanced', cluster: 'tools' },
      { name: 'PyAutoGUI', proficiency: 'intermediate', cluster: 'tools' },
      { name: 'Selenium', proficiency: 'intermediate', cluster: 'tools' },
      { name: 'OpenCV', proficiency: 'intermediate', cluster: 'tools' },
    ],
  },
];

export const businessCards: BusinessCard[] = [
  {
    id: 1,
    title: 'Name & Title',
    content: 'Jaswin Chinthala\nMechatronics Engineering Student, UCT',
    type: 'name',
  },
  {
    id: 2,
    title: 'Education',
    content: 'BSc Mechatronics in Electrical Engineering\nUniversity of Cape Town\n2026–Present',
    type: 'education',
  },
  {
    id: 3,
    title: 'LinkedIn',
    content: 'linkedin.com/in/jaswin-chinthala',
    type: 'linkedin',
  },
  {
    id: 4,
    title: 'GitHub',
    content: 'github.com/jaswin-codes',
    type: 'github',
  },
  {
    id: 5,
    title: 'Location',
    content: 'Cape Town, South Africa 🇿🇦',
    type: 'location',
  },
  {
    id: 6,
    title: 'Interests',
    content: 'AI Safety, Battery Tech, Embedded Systems, Robotics',
    type: 'interests',
  },
  {
    id: 7,
    title: 'Research Focus',
    content: 'Low-resource Language Safety, Post-harvest Freshness Detection',
    type: 'research',
  },
  {
    id: 8,
    title: "Let's Connect",
    content: 'Open to collaborations and research opportunities',
    type: 'connect',
  },
];

// Types
export interface Project {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  techStack: string[];
  details: string;
  githubLink?: string;
  liveLink?: string;
  thumbnail?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string;
  bulletPoints: string[];
  skills: string[];
  logo: string;
}

export interface Research {
  id: string;
  title: string;
  organization: string;
  date: string;
  summary: string;
  methodology: string;
  outcome: string;
  skills: string[];
  assets?: {
    poster?: string;
    paper?: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  waveformType: 'sine' | 'square' | 'ramp' | 'flatline';
}

export interface Skill {
  name: string;
  proficiency: 'novice' | 'intermediate' | 'advanced';
  cluster: string;
}

export interface SkillCluster {
  name: string;
  label: string;
  color: string;
  skills: Skill[];
}

export interface BusinessCard {
  id: number;
  title: string;
  content: string;
  type: string;
}
