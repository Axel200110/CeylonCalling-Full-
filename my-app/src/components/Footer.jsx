import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Link } from "react-scroll";

function Footer() {
  const currentYear = new Date().getFullYear();

  // Fine-tuned Framer Motion variants for subtle performance and feel
  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.215, 0.61, 0.355, 1], // Apple/Stripe swift ease-out cubic
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const navLinks = [
    { label: "Home", sinhala: "මුල් පිටුව", to: "header" },
    { label: "About", sinhala: "අප ගැන", to: "about" },
    { label: "Contact", sinhala: "සම්බන්ධ වන්න", to: "contact" },
  ];

  const socialLinks = [
    {
      href: "https://facebook.com/ceyloncalling",
      icon: <Facebook className="w-4 h-4" />,
      label: "Follow Ceylon Calling on Facebook",
    },
    {
      href: "https://instagram.com/ceyloncalling",
      icon: <Instagram className="w-4 h-4" />,
      label: "Follow Ceylon Calling on Instagram",
    },
    {
      href: "mailto:reservations@ceyloncalling.lk",
      icon: <Mail className="w-4 h-4" />,
      label: "Email our support desk",
    },
  ];

  return (
    <footer className="relative bg-neutral-900 border-t border-neutral-800/60 text-neutral-400 font-sans antialiased overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Subtle ambient blur back-panel to replicate modern SaaS layouts */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[200px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={containerVariants}
        className="container mx-auto px-6 sm:px-8 max-w-7xl pt-16 pb-8 relative z-10"
      >
        {/* Core Multi-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-8 pb-14">
          
          {/* Column 1: Brand & Regional Identity Profile */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-white font-semibold text-lg tracking-tight">
                Ceylon <span className="text-emerald-400">Calling</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/80 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                Discovery
              </span>
            </div>
            
            <p className="text-neutral-300 text-sm leading-relaxed max-w-md">
              The premium, standalone index dedicated exclusively to revealing the definitive culinary, café cultures, and boutique hotel stays throughout Sri Lanka’s historically rich North Central Province.
            </p>
            
            <p className="text-[11px] text-neutral-500 font-medium tracking-wide leading-normal">
              ශ්‍රී ලංකාවේ උතුරු මැද පළාතේ විශිෂ්ටතම ආපනශාලා සහ නවාතැන්පොළවල් සොයාගැනීමේ නිල මඟපෙන්වීම.
            </p>
          </motion.div>

          {/* Column 2: Minimalist Navigation System */}
          <motion.div variants={itemVariants} className="lg:col-span-3 lg:pl-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-200 mb-5">
              Platform Links
            </h3>
            <ul className="space-y-3.5">
              {navLinks.map(({ label, sinhala, to }) => (
                <li key={to} className="group flex items-baseline space-x-2">
                  <Link
                    to={to}
                    smooth={true}
                    duration={600}
                    spy={true}
                    offset={-70}
                    activeClass="text-emerald-400 !font-medium"
                    className="cursor-pointer text-sm font-normal text-neutral-400 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded transition-colors duration-200 relative"
                  >
                    {label}
                  </Link>
                  <span className="text-[10px] text-neutral-600 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    • {sinhala}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: High-Trust Direct Contact Matrix */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-200 mb-5">
              Inquiries & Desk Support
            </h3>
            
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+94752069762"
                  className="inline-flex items-center group space-x-3 text-sm text-neutral-400 hover:text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1 -m-1"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-800/60 border border-neutral-700/30 flex items-center justify-center group-hover:bg-emerald-950/40 group-hover:border-emerald-800/50 text-neutral-400 group-hover:text-emerald-400 transition-all duration-200">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono tracking-tight text-neutral-300 group-hover:text-white">+94 75 206 9762</span>
                </a>
              </li>

              <li>
                <a
                  href="mailto:reservations@ceyloncalling.lk"
                  className="inline-flex items-center group space-x-3 text-sm text-neutral-400 hover:text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1 -m-1"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-800/60 border border-neutral-700/30 flex items-center justify-center group-hover:bg-emerald-950/40 group-hover:border-emerald-800/50 text-neutral-400 group-hover:text-emerald-400 transition-all duration-200">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-neutral-300 group-hover:text-white break-all">reservations@ceyloncalling.lk</span>
                </a>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* Clean, Uniform Horizontal Border Rule */}
        <div className="border-t border-neutral-800/60 w-full" />

        {/* Bottom Bar: Rights Assertions & Social Alignment */}
        <div className="pt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-y-6">
          
          {/* Copyright Cluster */}
          <div className="text-center sm:text-left space-y-1">
            <p className="text-xs text-neutral-500 tracking-wide">
              &copy; {currentYear} Ceylon Calling. Independent Regional Indexing Platform.
            </p>
            <p className="text-[10px] text-neutral-600 font-light tracking-normal">
              සියලු හිමිකම් ඇවිරිණි. කිසිදු වෙන්කිරීමේ පද්ධතියක් හෝ අතරමැදි සේවාවක් සිදු නොකෙරේ.
            </p>
          </div>

          {/* Social Row with modern soft circular housing */}
          <div className="flex items-center space-x-3">
            {socialLinks.map(({ href, icon, label }) => (
              <motion.a
                whileHover={{ y: -2, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                key={label}
                href={href}
                target={href.startsWith("mailto") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-neutral-800/40 border border-neutral-800 hover:bg-emerald-950/30 hover:border-emerald-800/60 text-neutral-400 hover:text-emerald-400 flex items-center justify-center transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {icon}
              </motion.a>
            ))}
          </div>

        </div>

      </motion.div>
    </footer>
  );
}

export default Footer;