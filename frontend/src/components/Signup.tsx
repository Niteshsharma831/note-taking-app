import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { toast, Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate(); // ✅ Used for redirection

  const clearForm = () => {
    setName('');
    setDob('');
    setEmail('');
    setOtp('');
    setShowOtpInput(false);
    setShowOtp(false);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!dob) {
      toast.error('Date of Birth is required');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Valid email is required');
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    try {
      const res = await API.post('/send-otp', { email });
      toast.success(res.data.message || 'OTP sent to your email');
      setShowOtpInput(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error('OTP is required');
      return;
    }

    try {
      const res = await API.post('/verify-otp', { name, dob, email, otp });
      toast.success(res.data.message || 'Signup successful');
      localStorage.setItem('authToken', res.data.token);
      clearForm();
      navigate('/'); // ✅ Redirect to home page
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Toaster position="top-center" />

      {/* Left - Signup Form */}
      <div className="flex flex-col justify-center items-center flex-1 bg-white p-8">
        <div className="text-2xl font-bold text-blue-600 mb-4">🔵 HD</div>
        <h2 className="text-3xl font-bold mb-2">Sign up</h2>
        <p className="text-gray-500 mb-6 text-center">Sign up to enjoy the features of HD</p>

        <div className="w-full max-w-xs">
          {/* Name */}
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />

          {/* DOB */}
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-blue-500 rounded px-4 py-2 mb-4 w-full"
          />

          {/* OTP Input */}
          {showOtpInput && (
            <div className="relative mb-4">
              <input
                type={showOtp ? 'text' : 'password'}
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
              <button
                type="button"
                onClick={() => setShowOtp(!showOtp)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showOtp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Submit Button */}
          {!showOtpInput ? (
            <button
              onClick={handleSendOtp}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded w-full"
            >
              Get OTP
            </button>
          ) : (
            <button
              onClick={handleVerifyOtp}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded w-full"
            >
              Sign up
            </button>
          )}

          {/* Redirect to login */}
          <p className="text-sm text-gray-500 mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Image */}
      <div className="hidden md:block flex-1">
        <img
          src="https://4kwallpapers.com/images/wallpapers/windows-11-dark-mode-blue-stock-official-3840x2400-5630.jpg"
          alt="Signup Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Signup;
