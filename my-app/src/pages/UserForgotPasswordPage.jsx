
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Quiz from "../assets/Restaurent.jpg";
import Input from "../shopowner/components/Input";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

const SiteUserForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useSiteUserAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center"
      style={{ backgroundImage: `url(${Quiz})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/85 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">

        <div className="p-8 sm:p-12">

          {/* Title */}
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-2">
            Forgot Password
          </h2>

          {/* Subtitle bilingual */}
          <p className="text-center text-gray-600 text-sm mb-6">
            Enter your email to reset your password  
            <br />
            <span className="text-gray-500">
              ඔබගේ මුරපදය නැවත සකස් කිරීමට Email ඇතුළත් කරන්න
            </span>
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">

              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address / විද්‍යුත් තැපෑල"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition flex justify-center items-center"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  "Send Reset Link / යළි සකස් කිරීමේ ලින්ක් යවන්න"
                )}
              </motion.button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>

              <p className="text-gray-600 text-sm">
                If an account exists for{" "}
                <span className="font-semibold text-black">{email}</span>,
                you will receive a reset link soon.
                <br />
                <span className="text-gray-500">
                  ගිණුමක් තිබේ නම් ඔබට reset link එක ලැබෙනු ඇත
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-white/70 flex justify-center">
          <Link
            to="/user/login"
            className="text-sm text-gray-700 hover:text-black flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login / නැවත පිවිසීම
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SiteUserForgotPasswordPage;