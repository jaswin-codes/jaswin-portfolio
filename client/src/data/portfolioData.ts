
// ─── Static asset URLs (served from client/public) ─────────────────────────────
export const RESUME_URL = '/resume.pdf';
export const RESEARCH_POSTER_URL = '/research-poster.webp';

export const profile = {
  name: 'Jaswin Chinthala',
  headline: 'Mechatronics Engineering student at UCT',
  tagline: 'I build circuits, model batteries and test where AI systems fail.',
  focus: 'EV and power systems, analogue and embedded electronics, AI safety evaluation',
  location: 'Cape Town, South Africa',
  email: 'jaswinchinthala08@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jaswin-chinthala',
  github: 'https://github.com/jaswin-codes',
};

export const projects: Project[] = [
  {
    id: 'wlds',
    name: 'Water Level & Loadshedding Alarm',
    description: 'Analogue water-tank alarm with no microcontroller (EEE1009S design project, Oct 2026)',
    shortDescription: 'Comparators, CMOS logic and two 555 timers. Solo build, simulated in LTspice and tested on a breadboard.',
    techStack: ['LTspice', 'LM324', 'CMOS logic', '555 timers', 'Breadboard debugging'],
    details: `Lots of South African homes fill a tank with pumped water so they still have water during loadshedding. I designed an alarm that shows how full the tank is and warns you when it runs empty during a power cut, when the pump can't refill it. The rule for the project was no microcontrollers.

A potentiometer stands in for a float sensor. Two LM324 comparators set at 1/3 and 2/3 of the 5 V supply split the tank into full, half and empty. An LDR comparator detects loadshedding as the room lights going off. CMOS logic (CD4049, CD4081, CD4071) combines the signals, and two 555 timers drive a green/red LED and a buzzer.

Entering half gives one 1.1 s beep. Empty gives a continuous tone. Empty during loadshedding beeps at 1.4 Hz, so you can tell the two apart from another room.

I built it up in LTspice one block at a time, and all 6 warning states worked in simulation. On the breadboard I traced 3 faults (a miswired reference ladder, a floating 555 trigger and two swapped comparator outputs) by measuring node voltages and comparing them with the simulation. All 6 states then worked, with one stray beep at full tank still to fix.

One limit: the LDR also thinks it's loadshedding at night. Sensing the output of a mains phone charger would fix that. Extra cost was R8 for one more comparator.`,
    period: 'Oct 2026',
    role: 'Solo project',
    status: 'complete',
    images: [
      { src: '/wlds/breadboard.jpg', caption: 'The breadboard build' },
      { src: '/wlds/schematic.png', caption: 'Full schematic' },
      { src: '/wlds/simulation.png', caption: 'LTspice: tank level, comparator outputs and buzzer drive' },
    ],
  },
  {
    id: 'afriguard',
    name: 'AfriGuard',
    description: 'Red-teaming dataset and scoring pipeline for 7 South African languages (Global South AI Safety Hackathon, Jun 2026)',
    shortDescription: '1,120 adversarial prompts across 7 languages and 4 models. A later audit found our hackathon scoring was not reliable, so we documented it and rebuilt the scoring.',
    techStack: ['Python', 'LLM evaluation', 'Red-teaming', 'Streamlit'],
    details: `Team of four at the Apart Research Global South AI Safety Hackathon, Cape Town hub.

We ran 1,120 adversarial prompts (40 seeds × 7 languages × 4 models) on GPT-OSS, Llama 3.3, Kimi K2.6 and Qwen 3, in English, isiZulu, isiXhosa, Afrikaans, Sesotho, Sepedi and Tsonga. The prompts covered four harms that matter in South Africa: financial fraud, xenophobic incitement, political disinformation and gang crime, each written in direct, roleplay and hypothetical styles.

Our hackathon results suggested much weaker safety in low-resource languages. A later audit (V3) found that the hackathon scoring relied on keyword and length heuristics instead of a working LLM judge, so those attack-success rates are not validated. V3 keeps all the historical labels, documents the problem openly and adds a language-aware scoring pipeline. Validated semantic scoring is still open.

I co-built the test pipeline and the Streamlit dashboard for exploring the labels by model, language and harm category.

Team: Ubayd Hattas, Seth Miguel Ferreira, Sebastian Stent and me.`,
    period: 'Jun 2026',
    role: 'Team of 4',
    status: 'complete',
    githubLink: 'https://github.com/ubayd-hattas/AfriGuard',
    liveLink: 'https://afriguard.streamlit.app/',
    thumbnail: '/afriguard-logo.png',
  },
  {
    id: 'statsgeeks',
    name: 'StatsGeeks Hackathon: Best F1 Score',
    description: 'Classifying building age from satellite pixels in a new city (Sep 2026)',
    shortDescription: 'Macro-F1 0.749 with a location-aware Random Forest. Won Best F1 Score out of 6 teams.',
    techStack: ['Python', 'scikit-learn', 'Random Forest', 'Landsat data'],
    details: `Team of three at the UCT StatsGeeks Data Science Hackathon.

The task was to classify building age (four construction eras) from 30 m Landsat pixels in Amsterdam, using a model trained mostly on Madrid and very few Amsterdam labels.

Our coordinate-aware Random Forest combined a Madrid-trained prior with a forest trained on the Amsterdam labels, plus spatial context. It reached macro-F1 0.749 at 200 labels per class and beat every baseline at every label budget from 5 to 200. We won Best F1 Score out of six teams.

A limit we reported: the score is on random Amsterdam pixels. Predicting a whole unseen part of the city would be harder.

Team: Ametor Buanyomi, Sibusiso Mathebula and me.`,
    period: 'Sep 2026',
    role: 'Team of 3',
    status: 'complete',
    githubLink: 'https://github.com/jaswin-codes/StatsGeeks',
  },
  {
    id: 'sanren-ctf',
    name: 'SANReN Cyber Security Challenge',
    description: 'Capture the Flag qualifying round, team lead (Aug 2026)',
    shortDescription: 'Led a team of 4 first-time CTF players. 34 challenges solved, 3,000+ points.',
    techStack: ['Digital forensics', 'Cryptography', 'Web exploitation', 'Binary analysis'],
    details: `It was the first CTF for all four of us. I put the team together and we practised weekly before the qualifying round.

We solved 34 challenges for 3,000+ points across digital forensics, cryptography, web exploitation and binary analysis. We didn't make it past qualifying, and we plan to enter again next year.

Team: Alex Nicolaides, Aaron Vettiyamkunnath, Hiranya Pillay and me.`,
    period: 'Aug 2026',
    role: 'Team lead, team of 4',
    status: 'complete',
  },
  {
    id: 'hyperspectral',
    name: 'Freshness Sensor',
    description: 'Low-cost hardware follow-up to my produce-freshness research',
    shortDescription: 'In progress: a cheap sensor to test my simulated red-edge and NIR freshness results on real produce.',
    techStack: ['Python', 'Sensors', 'Hyperspectral imaging'],
    details: `My research with the Scientific Caribbean Foundation found that, in simulation, the red-edge (760 nm) and near-infrared (1100 nm) bands gave the earliest sign that produce was going off, before you could see it.

Now I want to check that on real fruit and vegetables with a low-cost sensor, without lab equipment. This is in progress.`,
    period: 'In progress',
    role: 'Solo project',
    status: 'in-progress',
    thumbnail: RESEARCH_POSTER_URL,
  },
];

export const experiences: Experience[] = [
  {
    id: 'uct-racing',
    company: 'UCT Racing (Formula Student)',
    role: 'EV Research Subteam Lead',
    duration: 'Aug 2026 – Present',
    location: 'Cape Town',
    description: 'I set up and lead the team\'s new EV research subteam. We\'re working towards a design-only Concept Class entry at Formula Student UK 2027.',
    bulletPoints: [
      'Built the subteam\'s research roadmap: rules compliance, benchmarking design reports from winning EV teams, and a cost model',
      'Ran the subteam kickoff and assigned the first workstreams',
      'Before this (Feb to Jul 2026) I was a Power Subsystem Member: I co-wrote the cooling-system documentation for the radiator fan integration and a report on real-time telemetry and battery thermal management',
    ],
    skills: ['Electric vehicles', 'Battery thermal management', 'Technical writing', 'Team leadership'],
  },
  {
    id: 'emi-lab',
    company: 'UCT EMi Lab (Electric Mobility Lab)',
    role: 'Vacation Work Student: Electric Drive Reliability & Power Electronics',
    duration: 'Jun – Jul 2026',
    location: 'Cape Town',
    description: 'Four weeks on the Tukzie electric tuk-tuk project.',
    bulletPoints: [
      'Modelled battery management (cell balancing and state-of-health tracking) in MATLAB, Simulink and Simscape in a team of 5',
      'Compared 4 swappable-battery infrastructure designs for electric tuk-tuks and recommended 1 in a written technical report',
    ],
    skills: ['MATLAB', 'Simulink', 'Simscape', 'Battery management systems'],
  },
  {
    id: 'makerspace',
    company: 'UCT d-school Makerspace',
    role: 'Studio Assistant (part-time)',
    duration: 'Oct 2026 – Present',
    location: 'Cape Town',
    description: 'I help run workshops in the Makerspace.',
    bulletPoints: [
      'Help run student workshops, starting with sublimation printing',
      'Support students who are new to electronics with beginner microelectronics projects',
      'Makerspace-trained on 3D printing',
    ],
    skills: ['3D printing', 'Workshops', 'Electronics'],
  },
  {
    id: 'scientific-caribbean',
    company: 'Scientific Caribbean Foundation & UCT',
    role: 'Student Researcher',
    duration: 'May 2026',
    location: 'Cape Town',
    description: 'Two-week research methodology programme, mentored by Dr Juan F. Arratia and Prof Komla Folly.',
    bulletPoints: [
      'Built a Python simulation adapting the University of Florida\'s FreshID produce-freshness method to low-cost sensing',
      'Found that, in simulation, the red-edge (760 nm) and near-infrared (1100 nm) bands gave the earliest freshness signal',
      'Presented a research poster to an academic panel',
    ],
    skills: ['Python', 'Simulation', 'Research methods'],
  },
];

export const research: Research[] = [
  {
    id: 'digital-minds',
    title: 'Digital Minds Sprint',
    organization: 'Apart Research (team of 2)',
    date: 'Aug 2026',
    summary: 'Can an LLM predict its own behaviour better than an outside observer can? If it can, that hints at some kind of privileged self-access. My teammate Ubayd Hattas led the experimental design and statistics. I led the engineering.',
    methodology: 'I built the pipeline: a pinned model and provider through OpenRouter, generation and prediction runners, checkpointed runs and reproducibility tooling. We compared the model\'s self-predictions with simple text baselines and other models acting as observers.',
    outcome: 'Hermes-3 predicted which of two replies it would write with 0.719 balanced accuracy. On the same pairs, the rule "pick the longer reply" scored 0.808. In a separate evaluation, a 21-feature text classifier reached 0.831. So we did not find evidence of privileged self-access.',
    skills: ['Python', 'LLM evaluation', 'Experimental pipelines', 'OpenRouter'],
    link: 'https://github.com/UbaJaz/Digital_Minds_Research',
    assets: {},
  },
  {
    id: 'hyperspectral',
    title: 'Produce Freshness',
    organization: 'Scientific Caribbean Foundation & UCT',
    date: 'May 2026',
    summary: 'A low-cost way to tell when fruit and vegetables are going off, before you can see it. I adapted the University of Florida\'s FreshID method to cheap sensing. Mentored by Dr Juan F. Arratia and Prof Komla Folly.',
    methodology: 'Python simulation (NumPy, Pandas, scikit-learn, Matplotlib) of hyperspectral signatures and biochemical markers over storage time, then ranking which features change first.',
    outcome: 'In simulation, the red-edge (760 nm) and near-infrared (1100 nm) bands gave the earliest freshness signal. Freshness dropped faster after mid-storage. I presented the poster to an academic panel.',
    skills: ['Python', 'NumPy', 'Pandas', 'scikit-learn', 'Matplotlib'],
    assets: {
      poster: RESEARCH_POSTER_URL,
    },
  },
  {
    id: 'swappable-battery',
    title: 'Swappable Batteries',
    organization: 'UCT EMi Lab',
    date: 'Jun – Jul 2026',
    summary: 'Which battery-swapping setup makes most sense for electric tuk-tuks? Part of the Tukzie project vacation work.',
    methodology: 'Literature review of swappable-battery infrastructure, alongside battery management modelling (cell balancing, state of health) in MATLAB, Simulink and Simscape.',
    outcome: 'Compared 4 infrastructure designs and recommended 1 in a written technical report.',
    skills: ['MATLAB', 'Simulink', 'Simscape', 'Technical writing'],
    assets: {},
  },
];

export const achievements: Achievement[] = [
  {
    id: 'best-f1',
    title: 'Best F1 Score',
    type: 'StatsGeeks Data Science Hackathon',
    date: 'Sep 2026',
    description: 'Won the Best F1 Score category out of six teams with macro-F1 0.749.',
    waveformType: 'square',
  },
  {
    id: 'chess-champion',
    title: 'National Chess Champion',
    type: 'Chess',
    date: '',
    description: 'I\'ve played competitive chess since school.',
    waveformType: 'ramp',
  },
  {
    id: 'student-of-year',
    title: 'Student of the Year',
    type: 'Blouberg International School',
    date: 'Grade 11',
    description: 'Student of the Year in Grade 11.',
    waveformType: 'sine',
  },
  {
    id: 'presidents-award',
    title: "President's Award (Bronze)",
    type: 'Community service',
    date: 'Grade 12',
    description: "Bronze level of the President's Award, for community service and personal development.",
    waveformType: 'flatline',
  },
];

export const leadership: Leadership[] = [
  {
    role: 'EV Research Subteam Lead',
    org: 'UCT Racing',
    period: 'Aug 2026 – Present',
    detail: 'Set up the new subteam and its research roadmap for a Concept Class entry at Formula Student UK 2027.',
  },
  {
    role: 'Treasurer',
    org: 'IEEE UCT Student Branch',
    period: 'Oct 2026 – Present',
    detail: 'I manage the branch budget and records, and plan spending early so money goes to workshops, components and competitions first.',
  },
  {
    role: 'Co-Founder & Secretary',
    org: 'UCT Maker Society',
    period: 'Oct 2026 – Present',
    detail: 'One of five students starting a cross-faculty society for builders, working with the d-school Makerspace. I wrote and submitted our recognition application.',
  },
  {
    role: 'Class Representative',
    org: 'Intro to Electrical Engineering (EEE1008F)',
    period: 'Feb – Jun 2026',
    detail: '1 of 6 elected reps for 170 students. I passed student concerns on to the TA and course staff.',
  },
  {
    role: 'Treasurer & Board Member',
    org: 'Interact Club (Rotary)',
    period: '2022 – 2024',
    detail: 'Managed a budget of R5,000+ as one of four board members. Took part in food drives, beach clean-ups and tutoring.',
  },
  {
    role: 'SRC, Student Wellness & Leadership',
    org: 'Blouberg International School',
    period: '2024',
    detail: '1 of 9 members. Organised wellness events with the school counsellor and mentored the class reps.',
  },
];

// Datasheet view: headline features and measured numbers, all taken from the entries above
export const features: string[] = [
  'EV Research Subteam Lead at UCT Racing (Formula Student)',
  'Analogue design: op-amp comparators, CMOS logic and 555 timers, simulated in LTspice',
  'Battery management modelling in MATLAB, Simulink and Simscape (UCT EMi Lab)',
  'LLM evaluation and red-teaming (AfriGuard, Apart Research sprints)',
  'Python, scikit-learn, Java, React and TypeScript',
  'Treasurer of IEEE UCT and co-founder of the UCT Maker Society',
];

export const characteristics: Characteristic[] = [
  { parameter: 'Alarm warning states passing', value: '6 / 6', conditions: 'WLDS in LTspice. On the breadboard, one stray beep at full tank' },
  { parameter: 'Macro-F1, building-age classification', value: '0.749', conditions: 'StatsGeeks hackathon, 200 labels per class. Best F1 Score of 6 teams' },
  { parameter: 'Adversarial prompts in dataset', value: '1,120', conditions: 'AfriGuard: 40 seeds × 7 languages × 4 models' },
  { parameter: 'Self-prediction vs "longer reply" rule', value: '0.719 / 0.808', conditions: 'Digital Minds sprint, Hermes-3, balanced accuracy on the same pairs' },
  { parameter: 'CTF challenges solved', value: '34', conditions: 'SANReN qualifying round, 3,000+ points, team of 4' },
];

export const skillClusters: SkillCluster[] = [
  {
    name: 'embedded',
    label: 'Electronics & Embedded',
    color: '#0088ff',
    skills: [
      { name: 'LTspice', proficiency: 'intermediate', cluster: 'embedded' },
      { name: 'Op-amp comparators', proficiency: 'intermediate', cluster: 'embedded' },
      { name: 'CMOS logic', proficiency: 'intermediate', cluster: 'embedded' },
      { name: '555 timers', proficiency: 'intermediate', cluster: 'embedded' },
      { name: 'Breadboard debugging', proficiency: 'intermediate', cluster: 'embedded' },
      { name: 'Arduino C++', proficiency: 'novice', cluster: 'embedded' },
      { name: 'ESP32', proficiency: 'novice', cluster: 'embedded' },
      { name: 'ROS 2', proficiency: 'novice', cluster: 'embedded' },
    ],
  },
  {
    name: 'power',
    label: 'Power / EV',
    color: '#ffaa00',
    skills: [
      { name: 'MATLAB', proficiency: 'intermediate', cluster: 'power' },
      { name: 'Simulink', proficiency: 'intermediate', cluster: 'power' },
      { name: 'Simscape', proficiency: 'novice', cluster: 'power' },
      { name: 'Battery thermal management', proficiency: 'intermediate', cluster: 'power' },
      { name: 'Battery state estimation', proficiency: 'novice', cluster: 'power' },
    ],
  },
  {
    name: 'ai-safety',
    label: 'AI Safety',
    color: '#ff0088',
    skills: [
      { name: 'LLM evaluation', proficiency: 'intermediate', cluster: 'ai-safety' },
      { name: 'Red-teaming', proficiency: 'intermediate', cluster: 'ai-safety' },
      { name: 'Experimental design', proficiency: 'intermediate', cluster: 'ai-safety' },
      { name: 'Research engineering', proficiency: 'intermediate', cluster: 'ai-safety' },
    ],
  },
  {
    name: 'ml',
    label: 'Data & ML',
    color: '#00ff88',
    skills: [
      { name: 'Python', proficiency: 'intermediate', cluster: 'ml' },
      { name: 'scikit-learn', proficiency: 'intermediate', cluster: 'ml' },
      { name: 'Random Forests', proficiency: 'intermediate', cluster: 'ml' },
      { name: 'NumPy / Pandas', proficiency: 'intermediate', cluster: 'ml' },
      { name: 'Matplotlib', proficiency: 'intermediate', cluster: 'ml' },
    ],
  },
  {
    name: 'web',
    label: 'Web',
    color: '#ff6600',
    skills: [
      { name: 'React', proficiency: 'intermediate', cluster: 'web' },
      { name: 'TypeScript', proficiency: 'intermediate', cluster: 'web' },
      { name: 'Tailwind', proficiency: 'intermediate', cluster: 'web' },
      { name: 'Three.js', proficiency: 'novice', cluster: 'web' },
      { name: 'Streamlit', proficiency: 'novice', cluster: 'web' },
    ],
  },
  {
    name: 'tools',
    label: 'Tools & Making',
    color: '#cccccc',
    skills: [
      { name: 'Java', proficiency: 'intermediate', cluster: 'tools' },
      { name: 'Git / GitHub', proficiency: 'intermediate', cluster: 'tools' },
      { name: '3D printing', proficiency: 'intermediate', cluster: 'tools' },
      { name: 'CTF (forensics, crypto, web)', proficiency: 'novice', cluster: 'tools' },
    ],
  },
];

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
    content: 'BSc Eng Electrical Engineering (Mechatronics)\nUniversity of Cape Town\n2026 – 2029',
    type: 'education',
  },
  {
    id: 3,
    title: 'What I work on',
    content: 'EV and power systems, analogue and embedded electronics, and testing AI systems for safety',
    type: 'interests',
  },
  {
    id: 4,
    title: 'Right now',
    content: 'Leading EV research at UCT Racing, learning ROS 2 on a Jetson rover, and building a low-cost freshness sensor',
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
    title: "Let's talk",
    content: 'Looking for vacation work and research roles in EV/power systems, embedded hardware or AI evaluation',
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
  period: string;
  role: string;
  status: 'complete' | 'in-progress';
  githubLink?: string;
  liveLink?: string;
  thumbnail?: string;
  images?: { src: string; caption: string }[];
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
  link?: string;
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

export interface Characteristic {
  parameter: string;
  value: string;
  conditions: string;
}

export interface Leadership {
  role: string;
  org: string;
  period: string;
  detail: string;
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
