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
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/send-otp", { email });
      toast.success(res.data.message || "OTP sent to your email");
      setShowOtpInput(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!email.trim() || !otp.trim()) {
      toast.error("Please enter both email and OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/login", { email, otp });
      const token = res.data.token;
      if (!token) {
        toast.error("No token received from server.");
        return;
      }

      toast.success("Login successful");
      localStorage.setItem("authToken", token);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen relative">
      <Toaster position="top-center" />

      {/* Desktop top-left logo */}
      <div className="hidden md:flex absolute top-6 left-6 items-center">
        <svg
          className="h-8 w-8 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
            <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            <circle cx="12" cy="12" r="4" />
          </g>
        </svg>
        <span className="text-2xl font-bold text-gray-800 ml-2">HD</span>
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-full p-8 bg-white">
        <div className="w-full p-4 md:max-w-md md:border md:border-gray-200 md:rounded-xl md:shadow-lg md:p-6 bg-white">

          {/* Mobile-centered logo */}
          <div className="flex items-center justify-center mb-4 md:hidden">
            <svg
              className="h-8 w-8 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                <circle cx="12" cy="12" r="4" />
              </g>
            </svg>
            <span className="text-3xl font-bold text-gray-800 ml-3">HD</span>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-center">Sign In</h2>
          <p className="text-gray-500 mb-6 text-center">
            Please login to continue to your account.
          </p>

          <div className="w-full mt-10">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
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

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded w-full mb-4 flex justify-center items-center"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : showOtpInput ? (
                "Resend OTP"
              ) : (
                "Send OTP"
              )}
            </button>

            {showOtpInput && (
              <>
                <label
                  htmlFor="otp"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
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
                    {showOtp ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </>
            )}

            <div className="flex items-center mb-6">
              <input
                id="keepLoggedIn"
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="keepLoggedIn"
                className="ml-2 block text-sm text-gray-900"
              >
                Keep me logged in
              </label>
            </div>

            {showOtpInput && (
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded w-full flex justify-center items-center"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : (
                  "Sign In"
                )}
              </button>
            )}

            <p className="text-sm text-gray-500 mt-4 text-center">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Image Section (Desktop only) */}
      <div className="hidden md:block w-1/2 h-full">
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
