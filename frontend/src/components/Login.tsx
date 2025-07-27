import React, { useState } from "react";
import API from "../services/api";
import { toast, Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const res = await API.post("/send-otp", { email });
      toast.success(res.data.message || "OTP sent to your email");
      setShowOtpInput(true);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };

 const handleVerifyOtp = async () => {
  if (!email.trim() || !otp.trim()) {
    toast.error("Please enter both email and OTP.");
    return;
  }

  try {
    const res = await API.post("/login", { email, otp });
    console.log("Login response:", res.data); 
    const token = res.data.token;
    if (!token) {
      toast.error("No token received from server.");
      return;
    }

    toast.success("Login successful");
    localStorage.setItem("authToken", token);
    navigate("/");
  } catch (err: any) {
    console.error("Login failed:", err);
    toast.error(
      err.response?.data?.message || "Invalid or expired OTP. Please try again."
    );
  }
};

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Toaster position="top-center" />

      {/* Form Section */}
      <div className="flex flex-col justify-center items-center flex-1 bg-white p-8">
        <div className="flex items-center mb-4">
          <svg
            className="h-8 w-8 text-blue-600 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
          </svg>
          <span className="text-3xl font-bold text-gray-800">HD</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Sign In</h2>
        <p className="text-gray-500 mb-6 text-center">
          Please login to continue to your account.
        </p>

        <div className="w-full max-w-xs">
          {/* Email Input */}
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* OTP Send Button */}
          <button
            onClick={handleSendOtp}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded w-full mb-4"
          >
            {showOtpInput ? "Resend OTP" : "Send OTP"}
          </button>

          {/* OTP Input */}
          {showOtpInput && (
            <>
              <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
                OTP
              </label>
              <div className="relative mb-4">
                <input
                  id="otp"
                  type={showOtp ? "text" : "password"}
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showOtp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </>
          )}

          {/* Keep Me Logged In */}
          <div className="flex items-center mb-6">
            <input
              id="keepLoggedIn"
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="keepLoggedIn" className="ml-2 block text-sm text-gray-900">
              Keep me logged in
            </label>
          </div>

          {/* Sign In Button */}
          {showOtpInput && (
            <button
              onClick={handleVerifyOtp}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded w-full"
            >
              Sign In
            </button>
          )}

          {/* Signup Link */}
          <p className="text-sm text-gray-500 mt-4 text-center">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:block flex-1">
        <img
          src="https://4kwallpapers.com/images/wallpapers/windows-11-dark-mode-blue-stock-official-3840x2400-5630.jpg"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
