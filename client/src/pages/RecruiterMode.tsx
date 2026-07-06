import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/appStore';
import { motion } from 'framer-motion';
import { projects, experiences, research, achievements, skillClusters, businessCards } from '@/data/portfolioData';
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

export default function RecruiterMode() {
  const setMode = useAppStore((state) => state.setMode);
  const setShowContactForm = useAppStore((state) => state.setShowContactForm);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-green-500/20"
      >
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Jaswin Chinthala
            </h1>
            <p className="text-green-400 text-lg">Electrical Engineering Student</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setMode('3d')}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/10"
            >
              3D Mode
            </Button>
            <Button
              onClick={() => setShowContactForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 py-12 space-y-16"
      >
        {/* Hero Section */}
        <motion.section variants={itemVariants} className="text-center mb-12">
          <p className="text-green-400 text-lg mb-4">
            Passionate about embedded systems, AI safety, and battery technologies
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.linkedin.com/in/jaswin-chinthala"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <Linkedin size={20} />
              LinkedIn
            </a>
            <a
              href="https://github.com/jaswin-codes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <Github size={20} />
              GitHub
            </a>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            About Me
          </h2>
          <div className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 space-y-3">
            {businessCards.slice(0, 3).map((card) => (
              <p key={card.id} className="text-gray-300 leading-relaxed">
                {card.content}
              </p>
            ))}
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.company}</h3>
                    <p className="text-green-400 font-semibold">{exp.role}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{exp.duration}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{exp.location}</p>
                <p className="text-gray-300 mb-3">{exp.description}</p>
                {exp.bulletPoints.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {exp.bulletPoints.map((point, i) => (
                      <li key={i} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-green-400">▸</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <motion.div
                key={proj.id}
                variants={itemVariants}
                className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition-colors"
              >
                <h3 className="text-lg font-bold text-white mb-2">{proj.name}</h3>
                <p className="text-green-400 text-sm mb-3">{proj.shortDescription}</p>
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">{proj.details}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {(proj.githubLink || proj.liveLink) && (
                  <div className="flex gap-2">
                    {proj.githubLink && (
                      <a
                        href={proj.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm transition-colors"
                      >
                        <Github size={14} />
                        GitHub
                      </a>
                    )}
                    {proj.liveLink && (
                      <a
                        href={proj.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm transition-colors"
                      >
                        <ExternalLink size={14} />
                        Live
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Research Section */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Research
          </h2>
          <div className="space-y-4">
            {research.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition-colors"
              >
                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                <p className="text-green-400 text-sm mb-3">
                  {item.organization} • {item.date}
                </p>
                <p className="text-gray-300 text-sm mb-3">{item.summary}</p>
                <div className="space-y-2 mb-3">
                  <div>
                    <p className="text-green-400 font-semibold text-sm">Methodology</p>
                    <p className="text-gray-300 text-sm">{item.methodology}</p>
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold text-sm">Outcome</p>
                    <p className="text-gray-300 text-sm">{item.outcome}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Skills & Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillClusters.map((cluster) => (
              <motion.div
                key={cluster.name}
                variants={itemVariants}
                className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">{cluster.label}</h3>
                <div className="space-y-2">
                  {cluster.skills.map((skill) => {
                    const profLevel = skill.proficiency as 'novice' | 'intermediate' | 'advanced';
                    const badgeColors = {
                      advanced: 'bg-green-500/30 text-green-400 border border-green-500',
                      intermediate: 'bg-blue-500/30 text-blue-400 border border-blue-500',
                      novice: 'bg-gray-600/30 text-gray-300 border border-gray-600',
                    };
                    return (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{skill.name}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColors[profLevel]}`}>
                          {profLevel.charAt(0).toUpperCase() + profLevel.slice(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Achievements Section */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Achievements
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                    <p className="text-green-400 text-sm">{achievement.type}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{achievement.date}</span>
                </div>
                <p className="text-gray-300">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Leadership Section */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Leadership & Involvement
          </h2>
          <div className="space-y-4">
            {[
              {
                role: 'Treasurer',
                org: 'Interact Club',
                detail: 'Managed budgets and financial records over R5000+ for community fundraising reaching multiple local organizations. 1 of 4 Board Members organizing events, running meetings and participated in various service events.',
              },
              {
                role: 'Student Wellness and Leadership',
                org: 'Student Representative Council (SRC)',
                detail: 'Represented the student body as 1 of 9 in school governance, contributing to welfare and leadership initiatives. Organized mental health and wellness events along with counsellor; mentored cohort of class representatives.',
              },
              {
                role: 'Class Representative',
                org: 'EEE1008 — Electrical Engineering',
                detail: 'Elected class representative for EEE1008 at UCT, facilitating communication between students and the course lecturer.',
              },
            ].map((item) => (
              <motion.div
                key={item.role}
                variants={itemVariants}
                className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.role}</h3>
                    <p className="text-green-400 text-sm">{item.org}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-2">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section variants={itemVariants} className="text-center py-12">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Interested in Collaborating?
          </h2>
          <p className="text-gray-300 mb-6">
            I'm always open to discussing new projects, opportunities, and ideas.
          </p>
          <Button
            onClick={() => setShowContactForm(true)}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Mail className="mr-2" size={20} />
            Get in Touch
          </Button>
        </motion.section>
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="border-t border-green-500/20 bg-black/50 py-6 text-center text-gray-400 text-sm"
      >
        <p>
          © 2026 Jaswin Chinthala. Built with React, Three.js, and Tailwind CSS.
        </p>
      </motion.footer>
    </div>
  );
}
