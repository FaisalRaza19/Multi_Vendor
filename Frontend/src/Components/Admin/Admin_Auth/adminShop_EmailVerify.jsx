import React, { useState, useRef, useContext, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaArrowLeft } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { ContextApi } from '../../../Context/Context';

const adminShop_EmailVerify = ({ isAuth }) => {
  const {showAlert} = useContext(ContextApi)
  const { shopVerify, adminResendCode } = useContext(ContextApi).adminAuth;
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Update resend timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; 
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle pasting OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = Array(6).fill('');
    pastedData.forEach((value, index) => {
      if (!isNaN(Number(value))) {
        newOtp[index] = value;
      }
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  // Verify OTP
  const handleVerify = async () => {
    if (otp.join('').length !== 6) {
      setMessage({ text: 'Please enter a valid 6-digit OTP.', type: 'error' });
      return;
    }
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const data = await shopVerify({ otp: otp.join(''), navigate, isAuth });
      showAlert(data)
    } catch (error) {
      setMessage({ text: error.message || 'Verification failed. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setIsResending(true);
    setResendTimer(60);
    setMessage({ text: 'Resending OTP...', type: 'info' });
    try {
      const data = await adminResendCode();
      showAlert(data);
    } catch (error) {
      setMessage({ text: 'Failed to resend OTP. Please try again later.', type: 'error' });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <button onClick={() => navigate('/Shop-register')} className="self-start ml-8 mb-4">
        <FaArrowLeft size={24} />
      </button>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">OTP Verification</h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Please enter the 6-digit code sent to your email.
        </p>
        <div className="flex space-x-2 mb-4 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              className="w-12 h-12 border rounded text-center text-xl font-bold focus:ring focus:ring-blue-300"
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        {message.text && (
          <div
            className={`mb-4 text-center ${
              message.type === 'success'
                ? 'text-green-500'
                : message.type === 'error'
                ? 'text-red-500'
                : 'text-blue-500'
            }`}
          >
            {message.type === 'success' && <FaCheckCircle className="inline mr-1" />}
            {message.type === 'error' && <FaTimesCircle className="inline mr-1" />}
            {message.type === 'info' && <FaClock className="inline mr-1 animate-spin" />}
            {message.text}
          </div>
        )}
        <div className="flex justify-between items-center">
          <button
            onClick={handleVerify}
            disabled={otp.join('').length !== 6 || isLoading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              otp.join('').length !== 6 || isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : 'Verify'}
          </button>
          <button
            onClick={handleResend}
            disabled={isResending || resendTimer > 0}
            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ${
              isResending || resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default adminShop_EmailVerify;
