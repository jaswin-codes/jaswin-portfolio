export interface Project {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
  logo?: string;
  thumbnail?: string;
  details: string;
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
  logo?: string;
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
    certificate?: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  waveformType: "sine" | "square" | "ramp" | "flatline";
}

export interface Skill {
  name: string;
  proficiency: number; // 0-100
  cluster: "ml" | "ai-safety" | "embedded" | "power" | "web" | "tools";
}

export interface SkillCluster {
  name: string;
  label: string;
  skills: Skill[];
  color: string;
}

export interface BusinessCard {
  id: number;
  title: string;
  content: string | React.ReactNode;
  type:
    | "name"
    | "education"
    | "linkedin"
    | "github"
    | "location"
    | "interests"
    | "coming-soon";
}
