import { motion } from "framer-motion";
import {
    ArrowRight,
    Camera,
    CheckCircle2,
    Eye,
    FileText,
    Handshake,
    Settings,
    ShieldCheck,
    Star,
    Store,
    TrendingUp,
    UserPlus
} from "lucide-react";
import { useState } from "react";
import RestaurantInterior from "../assets/restaurant_opt.jpg";

// --- Framer Motion Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 60, damping: 16 } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

export default function JoinWithUs() {
  const [activeStep, setActiveStep] = useState(0);

  const benefits = [
    {
      icon: <Eye className="text-emerald-600" size={22} />,
      title: "More Visibility",
      desc: "Thousands of customers ට ඔබේ Business එක පහසුවෙන් සොයාගත හැක."
    },
    {
      icon: <Star className="text-emerald-600" size={22} />,
      title: "Build Trust",
      desc: "Verified business තොරතුරු සහ Customer Reviews පෙන්වන්න."
    },
    {
      icon: <Settings className="text-emerald-600" size={22} />,
      title: "Easy Management",
      desc: "Dashboard එක මඟින් ව්‍යාපාරික විස්තර ඕනෑම වෙලාවක Update කරන්න."
    },
    {
      icon: <TrendingUp className="text-emerald-600" size={22} />,
      title: "Grow Faster",
      desc: "වැඩි Customers ලා ප්‍රමාණයක් වෙත ළඟාවී ඔබේ ආදායම වැඩි කරගන්න."
    }
  ];

  const onboardingSteps = [
    { title: "Create Account", desc: "Set up your secure business partner profile.", icon: <UserPlus size={16} /> },
    { title: "Business Details", desc: "Specify location, operating hours & amenities.", icon: <FileText size={16} /> },
    { title: "Upload Photos", desc: "Showcase your beautiful interior and menu options.", icon: <Camera size={16} /> },
    { title: "Verification Check", desc: "Our team audits for high hospitality benchmarks.", icon: <ShieldCheck size={16} /> },
    { title: "Published Live", desc: "Instantly display to active regional tourists.", icon: <CheckCircle2 size={16} /> }
  ];

  const handleNavigation = () => {
    window.location.href = "/partner-with-us";
  };

  return (
    <section
      id="join"
      className="relative bg-white py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden selection:bg-emerald-500/10 selection:text-emerald-900"
    >
      {/* Premium Ambient Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-20 md:space-y-28">
        
        {/* ================= SECTION HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium tracking-wide shadow-sm">
            <span>🤝</span> Join Our Partner Network
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight">
            Grow Your Business with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600">
              Ceylon Calling
            </span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
            ඔබගේ Restaurant, Hotel, Café, Villa, Guest House හෝ Tourism Business එක ශ්‍රී ලංකාව පුරා සිටින Travelers සහ Local Customers වෙත පහසුවෙන් ගෙන යන්න.
          </p>
        </motion.div>

        {/* ================= HERO IMAGE & BLUEPRINT SPLIT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Side: Premium Image Layout with overlay statistics */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="lg:col-span-6 relative rounded-3xl overflow-hidden min-h-[350px] lg:min-h-[500px] shadow-xl group"
          >
            <img 
              src={RestaurantInterior} 
              alt="Premium Restaurant Interior" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
            
            {/* Visual Context Tag */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="inline-block px-3 py-1 bg-emerald-600/80 backdrop-blur-md text-xs font-medium rounded-full tracking-wide">
                Premium Standards
              </span>
              <p className="text-sm md:text-base font-light text-neutral-200 leading-snug">
                We showcase your ambiance, culinary art, and unique spaces to discerning local and global visitors.
              </p>
            </div>
          </motion.div>

          {/* Right Side: Seamless Interactive Verification Flow */}
          <div className="lg:col-span-6 space-y-6 bg-neutral-50 border border-neutral-200/60 rounded-3xl p-6 md:p-8 shadow-sm relative flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
              <Store size={14} /> Merchant Onboarding Blueprint
            </div>

            <div className="space-y-2.5">
              {onboardingSteps.map((step, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setActiveStep(index)}
                  className={`p-3 rounded-xl border flex items-start gap-4 transition-all duration-200 cursor-pointer ${
                    index === activeStep
                      ? "bg-white border-emerald-500/30 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-neutral-100/50"
                  }`}
                >
                  <div className={`p-2 rounded-lg border transition-colors shrink-0 mt-0.5 ${
                    index === activeStep
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : "bg-neutral-200/60 border-neutral-300 text-neutral-500"
                  }`}>
                    {step.icon}
                  </div>
                  <div className="space-y-0.5 text-left">
                    <span className="text-[9px] block uppercase font-bold tracking-wider text-neutral-400">
                      Step 0{index + 1}
                    </span>
                    <h4 className={`text-sm font-bold transition-colors ${index === activeStep ? "text-emerald-700" : "text-neutral-800"}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-neutral-500 font-light leading-normal">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CORE BENEFITS GRID ================= */}
        <div className="space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">Why Partner With Us?</h3>
            <p className="text-sm text-neutral-500 font-light">Engineered to scale your brand presence seamlessly.</p>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4, boxShadow: "0 12px 20px rgba(16, 185, 129, 0.03)" }}
                className="bg-white border border-neutral-100 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between gap-4 group hover:border-emerald-200"
              >
                <div className="space-y-3">
                  <div className="p-2.5 w-fit rounded-xl bg-emerald-50 border border-emerald-100/50 group-hover:scale-105 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h4 className="text-base font-bold text-neutral-900 tracking-tight">
                    {benefit.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ================= CTA SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/[0.03] via-teal-600/[0.02] to-transparent border border-neutral-200/60 p-8 md:p-14 text-center max-w-5xl mx-auto shadow-sm"
        >
          {/* Glass Overlay Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
              Ready to Partner with Us?
            </h3>
            <p className="text-sm sm:text-base text-neutral-500 font-light">
              Join Ceylon Calling today. All listings are scrutinized by our deployment team before dynamic live publication.
            </p>
            
            <div className="pt-2">
              <motion.button
                onClick={handleNavigation}
                whileHover={{ scale: 1.03, boxShadow: "0 12px 25px rgba(16, 185, 129, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium text-sm sm:text-base py-3.5 px-10 rounded-full transition-all duration-300 shadow-lg w-full sm:w-auto justify-center"
              >
                <Handshake size={18} />
                Partner With Us
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}