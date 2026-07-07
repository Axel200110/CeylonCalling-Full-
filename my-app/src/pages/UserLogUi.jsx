import { motion } from "framer-motion";
import { FaHome, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Quiz from "../assets/Restaurent.jpg";

function UserLogUi() {
  const navigate = useNavigate();

  const backgroundVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 160 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${Quiz})` }}
      variants={backgroundVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      <motion.div
        className="relative z-10 bg-white/70 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl text-center max-w-md w-full"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Welcome / සාදරයෙන් පිළිගනිමු
        </h1>

        {/* Subtitle */}
        <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
          Log in or sign up to explore restaurants and destinations  
          <br />
          <span className="text-gray-500">
            ඇතුළු වන්න හෝ ලියාපදිංචි වී ස්ථාන සොයා ගන්න
          </span>
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">

          {/* Login */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate("/user/login")}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl shadow-md transition text-sm sm:text-base font-medium"
          >
            <FaSignInAlt />
            Login / පිවිසෙන්න
          </motion.button>

          {/* Signup */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate("/user/signup")}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-2xl shadow-md transition text-sm sm:text-base font-medium"
          >
            <FaUserPlus />
            Sign Up / ලියාපදිංචි වන්න
          </motion.button>

          {/* Home */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl shadow-md transition text-sm sm:text-base font-medium"
          >
            <FaHome />
            Home / මුල් පිටුව
          </motion.button>

        </div>
      </motion.div>
    </motion.div>
  );
}

export default UserLogUi;