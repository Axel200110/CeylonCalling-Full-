import { motion } from 'framer-motion';
import { Building2, HelpCircle, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { useState } from 'react';

function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isFocused, setIsFocused] = useState({ name: false, email: false, message: false });

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

  const QuickInquiryTypes = [
    { icon: <Building2 className="w-4 h-4" />, label: 'Partner with us' },
    { icon: <HelpCircle className="w-4 h-4" />, label: 'General Support' },
    { icon: <MessageSquare className="w-4 h-4" />, label: 'Feedback' },
  ];

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <section id="contact" className="min-h-screen bg-neutral-50/50 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto selection:bg-emerald-500/20">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
      >
        {/* LEFT COLUMN: Hero Context & Info Cards */}
        <div className="lg:col-span-5 space-y-10">
          <motion.div variants={itemVariants} className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block">
              Connect With Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-950 tracking-tight leading-[1.1]">
              We’re here to help you discover better places.
            </h1>
            <p className="text-lg text-neutral-600 font-normal leading-relaxed">
              Support for explorers, feedback loops, and premium partnership onboarding across Sri Lanka's North Central Province.
            </p>
            <p className="text-xs text-neutral-400 font-medium border-l-2 border-neutral-200 pl-3 italic">
              උතුරු මැද පළාතේ සංචාරක සහ ව්‍යාපාරික සබඳතා සඳහා අප අමතන්න.
            </p>
          </motion.div>

          {/* Interactive Quick Directives */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">What are you looking to do?</h4>
            <div className="flex flex-wrap gap-2">
              {QuickInquiryTypes.map((type, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 bg-white border border-neutral-200/80 rounded-full px-4 py-2 text-sm text-neutral-700 shadow-sm hover:border-emerald-500/50 hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  {type.icon}
                  <span>{type.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactDetails.map((item, i) => (
              <a
                href={item.href}
                key={i}
                className="group relative bg-white/60 backdrop-blur-md border border-neutral-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-500/30 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  {item.icon}
                </div>
                <div className="mt-8">
                  <span className="text-xs font-semibold text-neutral-400 block">{item.label}</span>
                  <span className="text-[11px] text-neutral-300 block -mt-0.5 mb-1">{item.sinhalaLabel}</span>
                  <span className="text-sm font-medium text-neutral-900 group-hover:text-emerald-700 transition-colors break-all">{item.value}</span>
                </div>
              </a>
            ))}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Stripe-Style Form Section */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-7 bg-white/80 backdrop-blur-xl border border-neutral-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-neutral-100/50 w-full relative overflow-hidden"
        >
          {/* Subtle design accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900">Submit a request</h2>
            <p className="text-sm text-neutral-500 mt-1">Fill out the secure portal below, and our operations team will review your message shortly.</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Input Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                onFocus={() => setIsFocused({ ...isFocused, name: true })}
                onBlur={() => setIsFocused({ ...isFocused, name: formState.name !== '' })}
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 pt-6 pb-2 text-neutral-900 text-base focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200 peer"
              />
              <label 
                htmlFor="name" 
                className={`absolute left-4 top-4 text-neutral-400 text-sm transition-all pointer-events-none origin-left ${
                  isFocused.name ? 'transform -translate-y-2.5 scale-75 text-emerald-600 font-medium' : ''
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
                onFocus={() => setIsFocused({ ...isFocused, email: true })}
                onBlur={() => setIsFocused({ ...isFocused, email: formState.email !== '' })}
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 pt-6 pb-2 text-neutral-900 text-base focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200 peer"
              />
              <label 
                htmlFor="email" 
                className={`absolute left-4 top-4 text-neutral-400 text-sm transition-all pointer-events-none origin-left ${
                  isFocused.email ? 'transform -translate-y-2.5 scale-75 text-emerald-600 font-medium' : ''
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
                onFocus={() => setIsFocused({ ...isFocused, message: true })}
                onBlur={() => setIsFocused({ ...isFocused, message: formState.message !== '' })}
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 pt-6 pb-2 text-neutral-900 text-base focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200 resize-none"
              />
              <label 
                htmlFor="message" 
                className={`absolute left-4 top-4 text-neutral-400 text-sm transition-all pointer-events-none origin-left ${
                  isFocused.message ? 'transform -translate-y-2.5 scale-75 text-emerald-600 font-medium' : ''
                }`}
              >
                Message <span className="text-neutral-300 font-normal">/ ඔබගේ පණිවිඩය</span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01, translateY: -1 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-4 px-6 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center justify-center gap-2 text-base tracking-wide"
            >
              {/* Premium Glow Overlay */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              
              <span>Send Message</span>
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </motion.button>
          </form>
          
          <p className="text-center text-xs text-neutral-400 mt-6">
            By submitting, you agree to our response turnaround SLAs (typically under 12 hours).
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Contact;