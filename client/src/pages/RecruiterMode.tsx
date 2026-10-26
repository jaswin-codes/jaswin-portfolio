import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/appStore';
import { motion } from 'framer-motion';
import { projects, experiences, research, achievements, skillClusters, leadership, profile, RESUME_URL } from '@/data/portfolioData';
import { Mail, Github, Linkedin, ExternalLink, FileDown } from 'lucide-react';
import WldsDemo from '@/components/WldsDemo';

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
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {profile.name}
            </h1>
            <p className="text-green-400 text-sm sm:text-base">{profile.headline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setMode('3d')}
              variant="outline"
              size="sm"
              className="border-green-500 text-green-400 hover:bg-green-500/10"
            >
              3D Mode
            </Button>
            <Button asChild size="sm" variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
              <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
                <FileDown size={16} /> CV
              </a>
            </Button>
            <Button
              onClick={() => setShowContactForm(true)}
              size="sm"
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
          <p className="text-white text-xl sm:text-2xl mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {profile.tagline}
          </p>
          <p className="text-green-400 text-sm sm:text-base mb-4">{profile.focus}</p>
          <div className="flex justify-center gap-6">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <Linkedin size={20} />
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <Github size={20} />
              GitHub
            </a>
          </div>
        </motion.section>

        {/* Education */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Education
          </h2>
          <div className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 space-y-2">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="text-xl font-bold text-white">University of Cape Town</h3>
              <span className="text-gray-400 text-sm">2026 – 2029 (expected)</span>
            </div>
            <p className="text-green-400 font-semibold">BSc Eng Electrical Engineering (Mechatronics)</p>
            <p className="text-gray-300 text-sm">Semester 1 2026 distinctions: Engineering Calculus, Introduction to Electrical Engineering, Computer Science I (Python).</p>
            <p className="text-gray-400 text-sm pt-2">Blouberg International School, Cambridge A-Levels: Mathematics (A), Physics (B). 2019 – 2025.</p>
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
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
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
                className={`bg-gray-900/50 border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition-colors ${proj.id === 'wlds' ? 'md:col-span-2' : ''}`}
              >
                {proj.images?.[0] && (
                  <img src={proj.images[0].src} alt={proj.images[0].caption} loading="lazy" className="w-full h-40 object-cover rounded mb-4 border border-green-500/30" />
                )}
                <h3 className="text-lg font-bold text-white mb-1">{proj.name}</h3>
                <p className="text-gray-400 text-xs mb-2">
                  {proj.period} · {proj.role}
                </p>
                <p className="text-green-400 text-sm mb-3">{proj.shortDescription}</p>
                {proj.id === 'wlds' && <div className="mb-3"><WldsDemo /></div>}
                <details className="mb-3">
                  <summary className="text-gray-400 text-sm cursor-pointer hover:text-green-300">Read more</summary>
                  <p className="text-gray-300 text-sm mt-2 whitespace-pre-line">{proj.details}</p>
                </details>
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
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 text-sm mb-3">
                    <Github size={14} /> GitHub
                  </a>
                )}
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
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
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
            {leadership.map((item) => (
              <motion.div
                key={item.role + item.org}
                variants={itemVariants}
                className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition-colors"
              >
                <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.role}</h3>
                    <p className="text-green-400 text-sm">{item.org}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{item.period}</span>
                </div>
                <p className="text-gray-300 text-sm mt-2">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section variants={itemVariants} className="text-center py-12">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Get in touch
          </h2>
          <p className="text-gray-300 mb-6">
            I'm looking for vacation work and research roles in EV/power systems, embedded hardware or AI evaluation.
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
          © 2026 Jaswin Chinthala. I built this site with React, Three.js and Tailwind CSS.
        </p>
      </motion.footer>
    </div>
  );
}
