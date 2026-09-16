import { AnimatePresence, motion } from 'framer-motion';
import { Building2, CheckCircle2, HelpCircle, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { useState } from 'react';

function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isFocused, setIsFocused] = useState({ name: false, email: false, message: false });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactDetails = [
    {
      icon: <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      label: 'Call Support',
      sinhalaLabel: 'අපට අමතන්න',
      value: '+94 75 206 9762',
      href: 'tel:+94752069762',
    },
    {
      icon: <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      label: 'Official Email',
      sinhalaLabel: 'විද්‍යුත් තැපෑල',
      value: 'hello@ceyloncalling.com',
      href: 'mailto:hello@ceyloncalling.com',
    },
  ];

  const quickInquiryTypes = [
    { icon: <Building2 className="w-4 h-4" />, label: 'Partner with us', template: 'Hi Ceylon Calling, I am interested in partnering with you regarding premium onboarding...' },
    { icon: <HelpCircle className="w-4 h-4" />, label: 'General Support', template: 'Hello support team, I need help with...' },
    { icon: <MessageSquare className="w-4 h-4" />, label: 'Feedback', template: 'Greetings! I wanted to share some feedback regarding...' },
  ];

  // REMOVED THE ": string" TYPE HERE FOR PURE JS
  const handleQuickSelect = (template) => {
    setFormState(prev => ({ ...prev, message: template }));
    setIsFocused(prev => ({ ...prev, message: true }));
  };

  // REMOVED THE ": React.FormEvent" TYPE HERE FOR PURE JS
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: '', email: '', message: '' });
      setIsFocused({ name: false, email: false, message: false });
    }, 3000);
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } }
  };

  return (
    <section id="contact" className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100/50 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto selection:bg-emerald-500/20 antialiased">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
      >
        {/* LEFT COLUMN: Hero Context & Info Cards */}
        <div className="lg:col-span-5 space-y-12">
          <motion.div variants={itemVariants} className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3.5 py-1.5 rounded-full inline-block shadow-sm">
              Connect With Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-[1.15]">
              We’re here to help you discover <span className="text-emerald-600">better places</span>.
            </h1>
            <p className="text-lg text-neutral-600 font-normal leading-relaxed">
              Support for explorers, feedback loops, and premium partnership onboarding across Sri Lanka's North Central Province.
            </p>
            <p className="text-xs text-neutral-400 font-medium border-l-2 border-emerald-500 pl-3 italic">
              උතුරු මැද පළාතේ සංචාරක සහ ව්‍යාපාරික සබඳතා සඳහා අප අමතන්න.
            </p>
          </motion.div>

          {/* Interactive Quick Directives */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">What are you looking to do?</h4>
            <div className="flex flex-wrap gap-2.5">
              {quickInquiryTypes.map((type, idx) => (
                <button 
                  key={idx} 
                  type="button"
                  onClick={() => handleQuickSelect(type.template)}
                  className="flex items-center gap-2 bg-white border border-neutral-200 hover:border-emerald-500 rounded-full px-4 py-2.5 text-sm text-neutral-700 shadow-sm transition-all duration-200 hover:bg-emerald-50/30 hover:text-emerald-700 font-medium active:scale-95"
                >
                  <span className="text-neutral-400 group-hover:text-emerald-600">{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Contact Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactDetails.map((item, i) => (
              <a
                href={item.href}
                key={i}
                className="group bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-500/30 hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors border border-neutral-100">
                  {item.icon}
                </div>
                <div className="mt-10">
                  <span className="text-xs font-bold text-neutral-400 block tracking-wide uppercase">{item.label}</span>
                  <span className="text-[11px] text-neutral-400 block mb-1.5 font-medium">{item.sinhalaLabel}</span>
                  <span className="text-sm font-semibold text-neutral-900 group-hover:text-emerald-600 transition-colors break-all tracking-tight">{item.value}</span>
                </div>
              </a>
            ))}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Stripe-Style Form Section */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-7 bg-white border border-neutral-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-neutral-200/30 w-full relative overflow-hidden"
        >
          {/* Top aesthetic gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600" />

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Submit a request</h2>
            <p className="text-sm text-neutral-500 mt-1.5">Fill out the secure portal below, and our operations team will review your message shortly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                onFocus={() => setIsFocused(prev => ({ ...prev, name: true }))}
                onBlur={() => setIsFocused(prev => ({ ...prev, name: formState.name !== '' }))}
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 pt-6 pb-2.5 text-neutral-900 text-base focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 font-medium"
              />
              <label 
                htmlFor="name" 
                className={`absolute left-4 top-4 text-neutral-400 text-sm transition-all duration-200 pointer-events-none origin-left ${
                  isFocused.name ? 'transform -translate-y-2.5 scale-75 text-emerald-600 font-bold' : 'font-medium'
                }`}
              >
                Your Name <span className="text-neutral-300 font-normal">/ ඔබගේ නම</span>
              </label>
            </div>

            {/* Input Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                onFocus={() => setIsFocused(prev => ({ ...prev, email: true }))}
                onBlur={() => setIsFocused(prev => ({ ...prev, email: formState.email !== '' }))}
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 pt-6 pb-2.5 text-neutral-900 text-base focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 font-medium"
              />
              <label 
                htmlFor="email" 
                className={`absolute left-4 top-4 text-neutral-400 text-sm transition-all duration-200 pointer-events-none origin-left ${
                  isFocused.email ? 'transform -translate-y-2.5 scale-75 text-emerald-600 font-bold' : 'font-medium'
                }`}
              >
                Email Address <span className="text-neutral-300 font-normal">/ විද්‍යුත් තැපෑල</span>
              </label>
            </div>

            {/* Textarea Message */}
            <div className="relative">
              <textarea
                id="message"
                required
                rows={4}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                onFocus={() => setIsFocused(prev => ({ ...prev, message: true }))}
                onBlur={() => setIsFocused(prev => ({ ...prev, message: formState.message !== '' }))}
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 pt-6 pb-2.5 text-neutral-900 text-base focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 resize-none font-medium"
              />
              <label 
                htmlFor="message" 
                className={`absolute left-4 top-4 text-neutral-400 text-sm transition-all duration-200 pointer-events-none origin-left ${
                  isFocused.message ? 'transform -translate-y-2.5 scale-75 text-emerald-600 font-bold' : 'font-medium'
                }`}
              >
                Message <span className="text-neutral-300 font-normal">/ ඔබගේ පණිවිඩය</span>
              </label>
            </div>

            {/* Submit Button Section */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.005, translateY: -0.5 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitted}
                className={`w-full relative group overflow-hidden font-semibold py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 text-base tracking-wide ${
                  isSubmitted 
                    ? 'bg-neutral-900 text-white shadow-none cursor-default' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10'
                }`}
              >
                {/* Premium Shine Overlay effect */}
                {!isSubmitted && (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                )}
                
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div 
                      key="success" 
                      initial={{ opacity: 0, y: 4 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Message Sent Successfully</span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="submit" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="flex items-center gap-2"
                    >
                      <span>Send Message</span>
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </form>
          
          <p className="text-center text-xs text-neutral-400 mt-6 font-medium">
            By submitting, you agree to our response turnaround SLAs (typically under 12 hours).
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Contact;