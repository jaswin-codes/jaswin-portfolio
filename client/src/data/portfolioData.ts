// ─── Static asset URLs (uploaded via manus-upload-file --webdev) ───────────────
export const RESUME_URL = '/resume.pdf';
export const RESEARCH_POSTER_URL = '/research-poster.png';

export const projects: Project[] = [
  {
    id: 'afriguard',
    name: 'AfriGuard',
    description: 'Multilingual Safety Red-Teaming for South African Languages',
    shortDescription: 'First comprehensive red-teaming framework for South African languages created by my team and I',
    techStack: ['Python', 'AI Safety', 'Red Teaming', 'LLM Evaluation', 'Streamlit'],
    details: `First comprehensive red-teaming evaluation framework targeting safety vulnerabilities in South African languages. Evaluated four frontier LLMs (GPT-OSS, Llama 3.3, Kimi K2.6, Qwen 3) across seven languages — English, isiZulu, isiXhosa, Afrikaans, Sesotho, Sepedi, and Tsonga.

Ran 1,120 adversarial evaluations (40 seed prompts × 7 languages × 4 models) across four harm categories endemic to South Africa: financial fraud, xenophobic incitement, political disinformation, and gang/criminal facilitation in 3 different styles (direct, roleplay and hypothetical).

Key finding: low-resource languages exhibit catastrophic safety failures with a mean Attack Success Rate (ASR) of 50.1% — more than double the English baseline of 24.4%. Certain model-language combinations reached >90% ASR.

Built an end-to-end evaluation pipeline with automated response generation, LLM-as-judge harm scoring, and publication-ready analytics. Discovered and corrected a critical classification bug in the judging pipeline, re-processed the full dataset, and published both versions transparently.

Created an interactive Streamlit dashboard for exploring results by model, language, and harm category.`,
    githubLink: 'https://github.com/ubayd-hattas/AfriGuard',
    liveLink: 'https://afriguard.streamlit.app/',
    thumbnail: '/afriguard-logo.png',
  },
  {
    id: 'hyperspectral',
    name: 'Hyperspectral Freshness',
    description: 'Predicting Post-Harvest Freshness Using Simulated Hyperspectral Signatures',
    shortDescription: '**Coming Soon:** Hardware product using sensors to capture real hyperspectral data',
    techStack: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Hyperspectral Imaging'],
    details: `**Coming Soon:** A hardware product using sensors to capture real hyperspectral data — taking the research into a physical device.

Using the research I did on simulated hyperspectral signatures, I am building a low-cost hardware sensor system that can detect post-harvest freshness in fruits and vegetables before visible spoilage appears.

The goal is to translate the simulation findings (Red-edge at 760nm, NIR at 1100nm as key freshness indicators) into a portable, real-world device accessible without lab equipment.`,
    githubLink: 'https://github.com/jaswin-codes',
    thumbnail: RESEARCH_POSTER_URL,
  },
  {
  id: 'vibecoded',
  name: 'Vibecoded',
  description: 'Multi-modal automation and recognition systems',
  shortDescription: 'Neural wake-word detection, biometric voiceprints, and gesture recognition',
  techStack: ['Python', 'PyAutoGUI', 'Selenium', 'OpenCV', 'FFT', 'MediaPipe'],
  details: `A collection of multi-modal automation and recognition projects built through rapid prototyping and creative engineering.

Architected a system integrating neural wake-word detection, biometric voiceprints, and an FFT-based audio pipeline for clap-pattern recognition.

Reduced event registration time from 30 seconds to <1 second by building a Selenium automation script, overcoming cross-origin iframe security barriers.

Achieved real-time recognition of gesture sequences using 21-point landmark tracking and rule-based finger state detection with a framework-agnostic approach.`,
  githubLinks: {
    jarvisAutomation: 'https://github.com/jaswin-codes/jarvis-automation',
    jutsuCode: 'https://github.com/jaswin-codes/jutsu_code_stage1',
    mscSignup: 'https://github.com/jaswin-codes/msc_signup',
  },
},
];

export const experiences: Experience[] = [
  {
    id: 'emi-lab',
    company: 'EMi Lab',
    role: 'Vacation Work Student - Electric Mobility Project',
    duration: 'June 2026 - July 2026 (4 weeks)',
    location: 'Cape Town, Western Cape, South Africa',
    description: '',
    bulletPoints: [
      'Built foundational skills in MATLAB coursework covering Battery Management system modeling, cell balancing, and state-of-health tracking via Simulink and Simscape simulations in a team of 5 members',
      'Authored a technical report on swappable battery architectures through academic literature reviews to propose 1 infrastructure configuration out of 4 for modular electric tuk-tuks',
    ],
    skills: ['BMS', 'Digital Twin', 'Battery Management', 'Technical Writing', 'EV Systems', 'MATLAB', 'Simulink', 'Simscape'],
    logo: '/emi-lab-logo.png',
  },
  {
    id: 'uct-racing',
    company: 'UCT Racing',
    role: 'EV Research Subteam Lead & Power Subsystem Member',
    duration: 'Feb 2026 - Present',
    location: 'Cape Town, Western Cape, South Africa',
    description: 'Incoming Subteam Lead for newly formed EV Research subteam; tasked with building the subteam\'s research focus on electric drivetrain architectures and battery chemistry beginning August 2026.',
    bulletPoints: [
      'Co-authored technical documentation for cooling architecture, specifically X2.4 fan integration.',
      'Researching telemetry systems for a technical report on real-time vehicle data communication while building knowledge of battery thermal management.',
    ],
    skills: ['C++', 'ESP32', 'Thermal Modelling', 'Formula Student', 'Battery Management'],
    logo: '/uct-racing-logo.png',
  },
  {
    id: 'scientific-caribbean',
    company: 'Scientific Caribbean Foundation, Inc.',
    role: 'Undergraduate Student Researcher',
    duration: 'May 2026',
    location: 'Cape Town, Western Cape, South Africa',
    description: 'Completed a 2-week STEM Research Methodology Workshop with independent research framework.',
    bulletPoints: [
      'Formulated an independent, simulation-based research framework using Python for post-harvest produce deterioration, adapting core concepts from the University of Florida\'s FreshID project to lowcost constraints.',
      'Evaluated simulated hyperspectral signatures and biochemical markers to track produce freshness, presenting empirical findings via a technical poster to an academic panel ',
    ],
    skills: ['Python', 'Data Modeling', 'Hyperspectral Imaging', 'Research', 'Scikit-learn'],
    logo: '/Scientific-Caribbean-Foundation-logo.png',
  },
];

export const research: Research[] = [
  {
    id: 'hyperspectral',
    title: 'Hyperspectral Imaging',
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
    id: 'swappable-battery',
    title: 'Swappable Battery',
    organization: 'EMi Lab',
    date: 'July 2026',
    summary: 'Research into swappable battery architectures for electric vehicles and e-mobility applications, exploring digital twin models and battery management systems.',
    methodology: 'Literature review on digital twin models for BMS, analysis of swappable battery standards, and technical report authoring on viability for EV use cases.',
    outcome: 'Coming Soon — ongoing research at EMi Lab.',
    skills: ['BMS', 'Digital Twin', 'Battery Management', 'EV Systems', 'Technical Writing'],
    assets: {},
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
    date: 'Grade 12',
    description: "Awarded the President's Award at Bronze level for community service and personal development.",
    waveformType: 'square',
  },
  {
    id: 'chess-champion',
    title: 'National Chess Champion',
    type: 'Competitive Achievement',
    date: '',
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
      { name: 'Hyperspectral Imaging', proficiency: 'novice', cluster: 'ml' },
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
      { name: 'Python Programming', proficiency: 'intermediate', cluster: 'embedded' },
      { name: 'C/C++', proficiency: 'novice', cluster: 'embedded' },
      { name: 'ESP32', proficiency: 'novice', cluster: 'embedded' },
      { name: 'mmWave Radar', proficiency: 'novice', cluster: 'embedded' },
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
      { name: 'Streamlit', proficiency: 'novice', cluster: 'web' },
    ],
  },
  {
    name: 'tools',
    label: 'Tools',
    color: '#cccccc',
    skills: [
      { name: 'Git', proficiency: 'novice', cluster: 'tools' },
      { name: 'GitHub', proficiency: 'intermediate', cluster: 'tools' },
      { name: 'PyAutoGUI', proficiency: 'intermediate', cluster: 'tools' },
      { name: 'Selenium', proficiency: 'intermediate', cluster: 'tools' },
      { name: 'OpenCV', proficiency: 'intermediate', cluster: 'tools' },
    ],
  },
];

// Cards reordered: 1 (name only), 2 (education), then 6+7 swapped to positions 3+4, then original 3+4 at 5+6
export const businessCards: BusinessCard[] = [
  {
    id: 1,
    title: 'Name',
    content: 'Jaswin Chinthala',
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
    title: 'Interests',
    content: 'AI Safety, Battery Tech, Embedded Systems, Robotics',
    type: 'interests',
  },
  {
    id: 4,
    title: 'Research Focus',
    content: 'Low-resource Language Safety, Post-harvest Freshness Detection',
    type: 'research',
  },
  {
    id: 5,
    title: 'LinkedIn',
    content: 'linkedin.com/in/jaswin-chinthala',
    type: 'linkedin',
  },
  {
    id: 6,
    title: 'GitHub',
    content: 'github.com/jaswin-codes',
    type: 'github',
  },
  {
    id: 7,
    title: 'Location',
    content: 'Cape Town, South Africa 🇿🇦',
    type: 'location',
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
  githubLinks?: Record<string, string>;
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
