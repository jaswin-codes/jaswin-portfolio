import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Send } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export default function ContactForm() {
  const showContactForm = useAppStore((state) => state.showContactForm);
  const setShowContactForm = useAppStore((state) => state.setShowContactForm);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    company: '',
    favPart: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          role: '',
          company: '',
          favPart: '',
          message: '',
        });

        setTimeout(() => {
          setShowContactForm(false);
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {showContactForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowContactForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-b from-gray-900 to-black border-2 border-green-500 rounded-lg p-8 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white" style={{
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Get in Touch
              </h2>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {submitStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="text-4xl mb-4">✓</div>
                <p className="text-green-400 font-bold mb-2">Message Sent!</p>
                <p className="text-gray-300 text-sm">
                  Thanks for reaching out. I'll get back to you soon!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-green-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 disabled:opacity-50"
                    placeholder="Your name"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-green-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 disabled:opacity-50"
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-green-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 disabled:opacity-50"
                      placeholder="e.g., Hiring Manager"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-green-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 disabled:opacity-50"
                      placeholder="Company name"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-1">
                    Favourite Part of the Site
                  </label>
                  <select
                    name="favPart"
                    value={formData.favPart}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-green-500/30 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <option value="">Select...</option>
                    <option value="projects">Projects</option>
                    <option value="about">About Me</option>
                    <option value="experience">Experience</option>
                    <option value="research">Research</option>
                    <option value="skills">Skills</option>
                    <option value="achievements">Achievements</option>
                    <option value="3d-experience">3D Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-gray-800 border border-green-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 disabled:opacity-50 resize-none"
                    placeholder="Tell me about the opportunity..."
                    disabled={isSubmitting}
                  />
                </div>

                {submitStatus === 'error' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm"
                  >
                    Error submitting form. Please try again.
                  </motion.p>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    variant="outline"
                    className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="mr-2"
                        >
                          ⟳
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
