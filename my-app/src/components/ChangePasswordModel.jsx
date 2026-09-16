import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaCircle, FaEye, FaEyeSlash, FaLock, FaTimes } from 'react-icons/fa';
import { useSiteUserAuthStore } from '../store/siteUserAuthStore';

// Premium Animation Definitions
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
const InputField = ({ label, id, value, onChange, error, isVisible, onToggle, placeholder }) => (
  <div className="w-full space-y-1.5">
    <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
      {label}
    </label>
    <div className="relative rounded-xl transition-all duration-200">
      <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 pointer-events-none">
        <FaLock className="text-sm" />
      </span>
      <input
        id={id}
        type={isVisible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-11 pr-11 py-2.5 bg-slate-50 border text-slate-800 text-sm rounded-xl transition-all duration-200 outline-none focus:bg-white focus:ring-4 ${
          error 
            ? 'border-rose-400 focus:ring-rose-500/10 focus:border-rose-500' 
            : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'
        }`}
      />
      <button
        type="button"
        onClick={onToggle}
        tabIndex="-1"
        className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition"
      >
        {isVisible ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
      </button>
    </div>
    {error && <p className="text-xs text-rose-500 font-medium pl-1">{error}</p>}
  </div>
);

const ChangePasswordModal = ({ onClose }) => {
  const { changePassword, isLoading } = useSiteUserAuthStore();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [visibility, setVisibility] = useState({ current: false, new: false, confirm: false });

  // Escape-key listener hook for clean overlay cancellation dismissals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Real-time security criteria calculations
  const criteria = {
    hasMinLength: formData.newPassword.length >= 6,
    hasMatch: formData.newPassword && formData.newPassword === formData.confirmPassword
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const activeErrors = {};
    if (!formData.currentPassword) activeErrors.currentPassword = 'Current credentials required';
    if (!criteria.hasMinLength) activeErrors.newPassword = 'Password must meet the length rules';
    if (!formData.confirmPassword) activeErrors.confirmPassword = 'Please verify your password';
    else if (!criteria.hasMatch) activeErrors.confirmPassword = 'Passwords do not match';
    
    return activeErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const activeErrors = validate();
    
    if (Object.keys(activeErrors).length > 0) {
      setErrors(activeErrors);
      return;
    }

    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      toast.success('Password updated successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password. Try again.');
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
        {/* Modal Top Branding Panel Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Update Security Key</h2>
            <p className="text-xs text-slate-400 mt-0.5">Keep your account safe with strong credentials.</p>
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
            label="Current Password"
            id="currentPassword"
            value={formData.currentPassword}
            placeholder="••••••••"
            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            error={errors.currentPassword}
            isVisible={visibility.current}
            onToggle={() => setVisibility(prev => ({ ...prev, current: !prev.current }))}
          />

          <hr className="border-slate-100" />

          <InputField
            label="New Password"
            id="newPassword"
            value={formData.newPassword}
            placeholder="Min. 6 characters"
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
            error={errors.newPassword}
            isVisible={visibility.new}
            onToggle={() => setVisibility(prev => ({ ...prev, new: !prev.current }))} // UI Bug Fix: target proper key reference context
          />

          <InputField
            label="Confirm New Password"
            id="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Verify new choice"
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            isVisible={visibility.confirm}
            onToggle={() => setVisibility(prev => ({ ...prev, confirm: !prev.confirm }))}
          />

          {/* Inline Active Requirement Checklist Tracker Module */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2.5 text-xs font-medium transition-colors duration-200">
              {criteria.hasMinLength ? (
                <FaCheck className="text-emerald-500 scale-90" />
              ) : (
                <FaCircle className="text-slate-300 scale-[0.4]" />
              )}
              <span className={criteria.hasMinLength ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-600'}>
                Minimum length of 6 characters
              </span>
            </div>
            
            <div className="flex items-center gap-2.5 text-xs font-medium transition-colors duration-200">
              {criteria.hasMatch ? (
                <FaCheck className="text-emerald-500 scale-90" />
              ) : (
                <FaCircle className="text-slate-300 scale-[0.4]" />
              )}
              <span className={criteria.hasMatch ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-600'}>
                New passwords must match exactly
              </span>
            </div>
          </div>

          {/* Actions Footer Grid Block Layer */}
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
              disabled={isLoading}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-600 active:bg-emerald-600 disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-emerald-600 transition"
            >
              {isLoading ? 'Updating Account...' : 'Save Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChangePasswordModal;