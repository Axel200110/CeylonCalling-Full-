import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaCircle, FaEnvelope, FaTimes, FaUser } from 'react-icons/fa';
import { useSiteUserAuthStore } from '../store/siteUserAuthStore';

// Premium Seamless Animation Definitions
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: 'spring', duration: 0.4, bounce: 0.15 } 
  },
  exit: { opacity: 0, scale: 0.98, y: 10, transition: { duration: 0.15 } }
};

// Reusable Advanced Input Field Component
const InputField = ({ icon: Icon, label, id, type, value, onChange, error, placeholder }) => (
  <div className="w-full space-y-1.5">
    <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
      {label}
    </label>
    <div className="relative rounded-xl transition-all duration-200">
      <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 pointer-events-none">
        <Icon className="text-sm" />
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border text-slate-800 text-sm rounded-xl transition-all duration-200 outline-none focus:bg-white focus:ring-4 ${
          error 
            ? 'border-rose-400 focus:ring-rose-500/10 focus:border-rose-500' 
            : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'
        }`}
      />
    </div>
    {error && <p className="text-xs text-rose-500 font-medium pl-1">{error}</p>}
  </div>
);

const UpdateProfileModal = ({ onClose }) => {
  const { user, updateProfile, isLoading } = useSiteUserAuthStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [errors, setErrors] = useState({});

  // Escape-key keyboard listener for accessible window dismissals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Real-time state change evaluation metrics
  const isFormChanged = formData.name.trim() !== (user?.name || '') || formData.email.trim() !== (user?.email || '');
  const isNameValid = formData.name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const activeErrors = {};
    if (!formData.name.trim()) activeErrors.name = 'Profile name cannot be blank';
    if (!formData.email.trim()) activeErrors.email = 'Email configuration address required';
    else if (!isEmailValid) activeErrors.email = 'Please provide a valid email format';
    return activeErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormChanged) {
      toast.error('No changes detected to submit');
      return;
    }

    const activeErrors = validate();
    if (Object.keys(activeErrors).length > 0) {
      setErrors(activeErrors);
      return;
    }

    try {
      await updateProfile(formData.name.trim(), formData.email.trim());
      toast.success('Profile configurations saved');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sync modifications.');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center px-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
      >
        {/* Modal App Branding Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Modify Account Info</h2>
            <p className="text-xs text-slate-400 mt-0.5">Keep your identity parameters updated.</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <InputField
            icon={FaUser}
            label="Full Name"
            id="profileName"
            type="text"
            value={formData.name}
            placeholder="John Doe"
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
          />

          <InputField
            icon={FaEnvelope}
            label="Email Address"
            id="profileEmail"
            type="email"
            value={formData.email}
            placeholder="name@domain.com"
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
          />

          {/* Inline Active Requirement Checklist Tracker Module */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2.5 text-xs font-medium transition-colors duration-200">
              {isNameValid ? (
                <FaCheck className="text-emerald-500 scale-90" />
              ) : (
                <FaCircle className="text-slate-300 scale-[0.4]" />
              )}
              <span className={isNameValid ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-600'}>
                Name field contains valid text
              </span>
            </div>
            
            <div className="flex items-center gap-2.5 text-xs font-medium transition-colors duration-200">
              {isEmailValid ? (
                <FaCheck className="text-emerald-500 scale-90" />
              ) : (
                <FaCircle className="text-slate-300 scale-[0.4]" />
              )}
              <span className={isEmailValid ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-600'}>
                Proper email pattern verification
              </span>
            </div>
          </div>

          {/* Form Actions Footer Alignment */}
          <div className="flex justify-end items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 active:bg-slate-100 transition shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !isFormChanged}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-600 active:bg-emerald-600 disabled:opacity-40 disabled:pointer-events-none shadow-sm shadow-emerald-600 transition"
            >
              {isLoading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpdateProfileModal;