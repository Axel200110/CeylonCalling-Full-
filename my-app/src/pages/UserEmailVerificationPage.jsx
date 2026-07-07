
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Quiz from "../assets/Restaurent.jpg";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

const SiteUserEmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useSiteUserAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || "";
      }
      setCode(newCode);

      const lastIndex = newCode.findLastIndex((d) => d !== "");
      inputRefs.current[lastIndex < 5 ? lastIndex + 1 : 5]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully / විද්‍යුත් තැපෑල සාර්ථකව සත්‍යාපනය විය");
      navigate("/user/dashboard");

      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (code.every((d) => d !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${Quiz})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-10"
      >
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
          Verify Email / විද්‍යුත් තැපෑල සත්‍යාපනය
        </h2>

        <p className="text-center text-gray-600 mt-2 text-sm sm:text-base">
          Enter the 6-digit code sent to your email
          <br />
          <span className="text-gray-500">
            ඔබගේ විද්‍යුත් තැපෑලට එවූ 6-අංක කේතය ඇතුළත් කරන්න
          </span>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">

          {/* OTP Inputs */}
          <div className="flex justify-between gap-2 sm:gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-semibold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="text-center text-red-500 text-sm font-medium">
              {error}
            </p>
          )}

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || code.some((d) => !d)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition flex justify-center items-center"
          >
            {isLoading
              ? "Verifying... / සත්‍යාපනය කරමින්"
              : "Verify Email / සත්‍යාපනය කරන්න"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default SiteUserEmailVerificationPage;