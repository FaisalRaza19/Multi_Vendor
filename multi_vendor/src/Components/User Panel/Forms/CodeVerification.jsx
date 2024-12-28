import React, { useState, useRef, useContext } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { ContextApi } from '../../../Context/Context';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const CodeVerification = ({setAuth}) => {
    const { CodeVerify,ResendCode } = useContext(ContextApi);
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isLoading,setLoading] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = otp.split('');
        newOtp[index] = value;
        setOtp(newOtp.join(''));

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleVerify = async () => {
        if (otp.length !== 6) {
            setMessage({ text: 'Please enter a valid 6-digit OTP.', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            await CodeVerify({ otp, navigate,setAuth});
            setLoading(true);
            setMessage({ text: 'OTP verified successfully!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.message || 'Verification failed.', type: 'error' });
        }finally{
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setResendTimer(60);
        setMessage({ text: 'Resending OTP...', type: 'info' });

        // Start timer countdown for resend functionality
        const timerInterval = setInterval(() => {
            setResendTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(timerInterval);
                    setIsResending(false);
                    setMessage({ text: 'OTP Resent', type: 'info' });
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
        try {
            await ResendCode();
        } catch (error) {
            setMessage({ text: 'Failed to resend OTP. Please try again.', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col py-8 sm:px-6 lg:px-8">
            <div className="flex ml-10 cursor-pointer" onClick={() => navigate("/sign-up")}>
                <FaCircleArrowLeft size={30} />
            </div>
            <div className="flex justify-center items-center mt-32">
                <div className="bg-white p-8 rounded shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-4 text-center">OTP Verification</h2>
                    <div className="flex space-x-2 mb-4 justify-center">
                        {[...Array(6)].map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 border rounded text-center text-xl font-bold focus:ring focus:ring-blue-300"
                                value={otp[index] || ''}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                        inputRefs.current[index - 1].focus();
                                    }
                                }}
                            />
                        ))}
                    </div>
                    {message.text && (
                        <div className={`mb-4 text-center ${message.type === 'success' ? 'text-green-500' : message.type === 'error' ? 'text-red-500' : 'text-blue-500'}`}>
                            {message.type === 'success' && <FaCheckCircle className="inline mr-1" />}
                            {message.type === 'error' && <FaTimesCircle className="inline mr-1" />}
                            {message.type === 'info' && <FaClock className="inline mr-1 animate-spin" />}
                            {message.text}
                        </div>
                    )}
                    <div className="flex justify-between">
                        <button
                            onClick={handleVerify}
                            disabled={otp.length !== 6}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? <AiOutlineLoading3Quarters size={20} className="text-black animate-spin" /> : "Verify"}
                        </button>
                        <button
                            onClick={handleResend}
                            disabled={isResending}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isResending ? `Resend in ${resendTimer}s` : 'Resend'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeVerification;