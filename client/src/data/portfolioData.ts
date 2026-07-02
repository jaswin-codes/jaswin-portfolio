import type { Project, Experience, Research, Achievement, SkillCluster, BusinessCard } from '@/types/portfolio';

export const projects: Project[] = [
  {
    id: 'afriguard',
    name: 'AfriGuard',
    description: 'Multilingual Safety Red-Teaming for South African Languages',
    shortDescription: 'First comprehensive red-teaming framework for South African languages',
    techStack: ['Python', 'AI Safety', 'Red Teaming', 'LLM Evaluation'],
    details: `First comprehensive red-teaming evaluation framework targeting safety vulnerabilities in South African languages. Evaluated four frontier LLMs (GPT-OSS, Llama 3.3, Kimi K2.6, Qwen 3) across seven languages — English, isiZulu, isiXhosa, Afrikaans, Sesotho, Sepedi, and Tsonga.

Ran 1,120 adversarial evaluations (40 seed prompts × 7 languages × 4 models) across four harm categories endemic to South Africa: financial fraud, xenophobic incitement, political disinformation, and gang/criminal facilitation in 3 different styles (direct, roleplay and hypothetical).

Key finding: low-resource languages exhibit catastrophic safety failures with a mean Attack Success Rate (ASR) of 50.1% — more than double the English baseline of 24.4%. Certain model-language combinations reached >90% ASR.

Built an end-to-end evaluation pipeline with automated response generation, LLM-as-judge harm scoring, and publication-ready analytics. Discovered and corrected a critical classification bug in the judging pipeline, re-processed the full dataset, and published both versions transparently.

Created an interactive Streamlit dashboard for exploring results by model, language, and harm category.`,
    githubLink: 'https://github.com/jaswin-codes',
  },
  {
    id: 'hyperspectral',
    name: 'Hyperspectral Freshness',
    description: 'Predicting Post-Harvest Freshness Using Simulated Hyperspectral Signatures',
    shortDescription: 'Low-cost computational framework for produce freshness prediction',
    techStack: ['Python', 'Data Modeling', 'Hyperspectral Imaging', 'Machine Learning'],
    details: `Developed a computational, theory-driven framework to predict post-harvest freshness in fruits and vegetables, serving as a low-cost, scalable alternative to traditional lab-based analysis.

Adapted key concepts from the University of Florida's FreshID research to model the relationship between simulated hyperspectral signatures, biochemical indicators (e.g., glucosinolates), and produce senescence.

Built a Python-based simulation to rank feature importance, successfully demonstrating that specific spectral regions (Red-edge and NIR) are highly predictive of freshness before visible spoilage occurs.

Presented findings and methodologies to an academic panel as part of a STEM Research Methodology Workshop.`,
    githubLink: 'https://github.com/jaswin-codes',
  },
  {
    id: 'uct-racing',
    name: 'UCT Racing Battery',
    description: 'Battery Thermal Management System for Formula Student Electric',
    shortDescription: 'Thermal modelling and cooling architecture for electric drivetrain',
    techStack: ['C++', 'ESP32', 'Thermal Modelling', 'Formula Student'],
    details: `Role: Power Subsystem, thermal modelling and cooling architecture

Co-authored technical documentation for cooling architecture, specifically X2.4 fan integration. Focused on electric drivetrain architecture and battery thermal management within the Power subsystem.

Contributed to the design and implementation of the thermal management system for the UCT Racing Formula Student Electric vehicle, ensuring optimal battery performance and safety under race conditions.`,
    githubLink: 'https://github.com/jaswin-codes',
  },
  {
    id: 'emi-lab',
    name: 'EMi Lab',
    description: 'Electric Mobility Project Contributions',
    shortDescription: 'Vacation work on electric mobility research and development',
    techStack: ['Embedded Systems', 'Electric Mobility'],
    details: `Currently participating in a 6-week vacation work contributing to the EMi Lab's electric mobility project. Working on embedded systems and electric vehicle technologies in collaboration with the Energy Materials and Innovation Lab at UCT.`,
    githubLink: 'https://github.com/jaswin-codes',
  },
];

export const experiences: Experience[] = [
  {
    id: 'emi-lab',
    company: 'EMi Lab',
    role: 'Vacation Work Student',
    duration: 'Jun 2026 – Present',
    location: 'Cape Town, Western Cape, South Africa',
    description: 'Currently participating in a 6-week vacation work contributing to the EMi Lab\'s electric mobility project.',
    bulletPoints: [
      'Contributing to electric mobility research and development',
      'Working on embedded systems for EV applications',
      'Collaborating with research team on innovation projects',
    ],
    skills: ['Electric Mobility', 'Embedded Systems'],
    logo: 'https://via.placeholder.com/64?text=EMi+Lab',
  },
  {
    id: 'uct-racing',
    company: 'UCT Racing',
    role: 'Power Subsystem Member',
    duration: 'Feb 2026 – Present',
    location: 'Cape Town, Western Cape, South Africa',
    description: 'Co-authored technical documentation for cooling architecture, specifically X2.4 fan integration.',
    bulletPoints: [
      'Focused on electric drivetrain architecture and battery thermal management',
      'Designed cooling architecture for Formula Student Electric vehicle',
      'Contributed to thermal modelling and system optimization',
    ],
    skills: ['C++', 'ESP32', 'Thermal Modelling', 'Formula Student'],
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
    skills: ['Python', 'Data Modeling', 'Hyperspectral Imaging', 'Research'],
    logo: 'https://via.placeholder.com/64?text=Scientific+Caribbean',
  },
];

export const research: Research[] = [
  {
    id: 'hyperspectral',
    title: 'Hyperspectral Freshness',
    organization: 'Scientific Caribbean Foundation, Inc.',
    date: 'May 2026',
    summary: 'Developed a computational framework to predict post-harvest freshness using simulated hyperspectral signatures as a low-cost alternative to lab-based analysis.',
    methodology: 'Python-based simulation, feature importance ranking, spectral region analysis (Red-edge and NIR)',
    outcome: 'Demonstrated that specific spectral regions are highly predictive of freshness before visible spoilage. Presented to academic panel.',
    skills: ['Python', 'Data Modeling', 'Hyperspectral Imaging', 'Machine Learning'],
    assets: {
      poster: 'https://via.placeholder.com/400x300?text=Research+Poster',
    },
  },
  {
    id: 'afriguard',
    title: 'AfriGuard',
    organization: 'Global South AI Safety Hackathon',
    date: 'Jun 2026',
    summary: 'First comprehensive red-teaming framework for South African languages. Evaluated 4 frontier LLMs across 7 languages.',
    methodology: '1,120 adversarial evaluations, LLM-as-judge scoring, automated pipeline',
    outcome: 'Discovered catastrophic safety failures in low-resource languages (50.1% ASR vs 24.4% English baseline). Published transparently.',
    skills: ['AI Safety', 'Red Teaming', 'Python', 'LLM Evaluation'],
  },
];

export const achievements: Achievement[] = [
  {
    id: 'hackathon',
    title: 'Global South Hackathon',
    type: 'Hackathon Participant',
    date: 'Jun 2026',
    description: 'Built AfriGuard, a multilingual safety red-teaming framework for South African languages. Evaluated 4 frontier LLMs across 7 languages with 1,120 adversarial evaluations. Discovered catastrophic safety failures in low-resource languages (50.1% ASR). Cape Town Hub.',
    waveformType: 'square',
  },
  {
    id: 'stem-workshop',
    title: 'STEM Workshop',
    type: 'Workshop Presenter',
    date: 'May 2026',
    description: 'Completed a 2-week workshop hosted by Dr Juan F. Arratia (Scientific Caribbean Foundation) and Professor Komla Folly (UCT). Formulated an independent research framework on post-harvest freshness prediction using simulated hyperspectral signatures. Designed and presented a research poster before an academic panel.',
    waveformType: 'ramp',
  },
];

export const skillClusters: SkillCluster[] = [
  {
    name: 'ml',
    label: 'Machine Learning / AI',
    color: '#00ff88',
    skills: [
      { name: 'Python', proficiency: 70, cluster: 'ml' },
      { name: 'TensorFlow', proficiency: 50, cluster: 'ml' },
      { name: 'Scikit-learn', proficiency: 60, cluster: 'ml' },
      { name: 'Hyperspectral Imaging', proficiency: 65, cluster: 'ml' },
    ],
  },
  {
    name: 'ai-safety',
    label: 'AI Safety',
    color: '#ff0088',
    skills: [
      { name: 'Red-teaming', proficiency: 75, cluster: 'ai-safety' },
      { name: 'Prompt Engineering', proficiency: 60, cluster: 'ai-safety' },
      { name: 'AI Ethics', proficiency: 55, cluster: 'ai-safety' },
    ],
  },
  {
    name: 'embedded',
    label: 'Embedded Systems',
    color: '#0088ff',
    skills: [
      { name: 'C/C++', proficiency: 60, cluster: 'embedded' },
      { name: 'ESP32', proficiency: 70, cluster: 'embedded' },
      { name: 'Arduino', proficiency: 50, cluster: 'embedded' },
      { name: 'RTOS', proficiency: 40, cluster: 'embedded' },
    ],
  },
  {
    name: 'power',
    label: 'Power / Energy',
    color: '#ffaa00',
    skills: [
      { name: 'Battery Thermal Management', proficiency: 65, cluster: 'power' },
      { name: 'Circuit Design', proficiency: 50, cluster: 'power' },
      { name: 'KiCad', proficiency: 45, cluster: 'power' },
    ],
  },
  {
    name: 'web',
    label: 'Web Dev',
    color: '#ff6600',
    skills: [
      { name: 'React', proficiency: 55, cluster: 'web' },
      { name: 'TypeScript', proficiency: 50, cluster: 'web' },
      { name: 'Three.js', proficiency: 40, cluster: 'web' },
      { name: 'Tailwind', proficiency: 60, cluster: 'web' },
    ],
  },
  {
    name: 'tools',
    label: 'Tools',
    color: '#cccccc',
    skills: [
      { name: 'Git', proficiency: 80, cluster: 'tools' },
      { name: 'GitHub', proficiency: 80, cluster: 'tools' },
      { name: 'VS Code', proficiency: 85, cluster: 'tools' },
      { name: 'Linux', proficiency: 60, cluster: 'tools' },
    ],
  },
];

export const businessCards: BusinessCard[] = [
  {
    id: 1,
    title: 'Name & Title',
    content: 'Jaswin Chinthala\nElectrical Engineering Student, UCT',
    type: 'name',
  },
  {
    id: 2,
    title: 'Education',
    content: 'BSc Electrical & Computer Engineering\nUniversity of Cape Town\n2025–2028',
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
    content: 'Battery systems, AI Safety, embedded systems, hyperspectral imaging',
    type: 'interests',
  },
  {
    id: 7,
    title: 'Coming Soon',
    content: 'More to come...',
    type: 'coming-soon',
  },
];
