import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } },
  exit: { opacity: 0, y: 50 }
};

const InputField = ({ label, value, onChange, error, isVisible, onToggle }) => (
  <div className="relative w-full">
    <label className="block text-sm font-medium mb-1 text-gray-800">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
        <FaLock />
      </span>
      <input
        type={isVisible ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-3 flex items-center text-teal-500"
      >
        {isVisible ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const ChangePasswordModal = ({ onClose }) => {
  const { changePassword, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [visibility, setVisibility] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password required';
    if (formData.newPassword.length < 6) newErrors.newPassword = 'At least 6 characters';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      toast.success('✅ Password changed!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-purple-200 via-gray-200 to-teal-100 bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        variants={modal}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Change Password 
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Current Password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            error={errors.currentPassword}
            isVisible={visibility.current}
            onToggle={() => setVisibility({ ...visibility, current: !visibility.current })}
          />
          <InputField
            label="New Password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            error={errors.newPassword}
            isVisible={visibility.new}
            onToggle={() => setVisibility({ ...visibility, new: !visibility.new })}
          />
          <InputField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            isVisible={visibility.confirm}
            onToggle={() => setVisibility({ ...visibility, confirm: !visibility.confirm })}
          />
          <div className="flex justify-between pt-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 rounded-full bg-gradient-to-r from-purple-500 to-teal-400 text-white hover:opacity-90 transition font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChangePasswordModal;