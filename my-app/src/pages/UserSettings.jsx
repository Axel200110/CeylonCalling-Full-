import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  FaArrowLeft,
  FaChevronRight,
  FaLock,
  FaUserCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../components/ChangePasswordModal';
import Navigation from '../components/NavigationPage';
import UpdateProfile from '../components/UpdateProfileModal';
import { useSiteUserAuthStore } from '../store/siteUserAuthStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.215, 0.610, 0.355, 1.0] }
  }
};

function UserSettings() {
  const { user } = useSiteUserAuthStore();
  const navigate = useNavigate();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const settingsOptions = [
    {
      icon: <FaUserCircle className="text-xl sm:text-2xl text-emerald-600" />,
      title: 'Profile Settings',
      description: 'Update your personal details, name, and contact details.',
      ringColor: 'focus:ring-emerald-500/20 focus:border-emerald-500',
      bgColor: 'bg-emerald-50/40',
      onClick: () => setShowUpdateProfile(true),
    },
    {
      icon: <FaLock className="text-xl sm:text-2xl text-red-00" />,
      title: 'Security & Password',
      description: 'Update your login credentials and secure your account access.',
      ringColor: 'focus:ring-blue-500/20 focus:border-blue-500',
      bgColor: 'bg-white',
      onClick: () => setShowChangePassword(true),
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans antialiased text-slate-800 selection:bg-emerald-500/10">
      {/* Persistent Left Sidebar Workspace Layer */}
      <Navigation />

      {/* Main Container Core Layout Context */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-24 md:py-12 md:pl-24 lg:pl-12 transition-all duration-300">
        
        {/* Dynamic Contextual Header Row with Back Button Action */}
        <div className="mb-8 border-b border-slate-200/60 pb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Account Preferences
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
              Manage your personal profile and secure credentials.
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => navigate('/discover')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 active:bg-slate-100 transition focus:outline-none focus:ring-4 focus:ring-slate-500/10"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back</span>
          </button>
        </div>

        {/* Dynamic Card Options Presentation List Frame */}
        <motion.div 
          className="space-y-3 sm:space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {settingsOptions.map((option) => (
            <motion.button
              key={option.title}
              type="button"
              variants={itemVariants}
              onClick={option.onClick}
              className={`group w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/70 shadow-sm transition-all duration-200 text-left hover:border-slate-300 hover:shadow-md/10 focus:outline-none focus:ring-4 ${option.ringColor}`}
            >
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Micro Container Icon Setup */}
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${option.bgColor}`}>
                  {option.icon}
                </div>
                
                <div>
                  <h3 className="text-sm sm:text-base font-bold tracking-tight text-slate-800">
                    {option.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 leading-normal">
                    {option.description}
                  </p>
                </div>
              </div>

              {/* Functional Indicator Arrow Icon */}
              <FaChevronRight className="text-xs text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-500" />
            </motion.button>
          ))}
        </motion.div>
      </main>

      {/* Shared Application Context Overlays Container */}
      <AnimatePresence>
        {showUpdateProfile && (
          <UpdateProfile user={user} onClose={() => setShowUpdateProfile(false)} />
        )}
        {showChangePassword && (
          <ChangePassword onClose={() => setShowChangePassword(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserSettings;