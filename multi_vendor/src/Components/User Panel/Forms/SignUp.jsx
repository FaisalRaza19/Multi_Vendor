import { React, useContext, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from "react-icons/ai";
import styles from "../../../Styles/style.js";
import { Link, useNavigate } from "react-router-dom";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { ContextApi } from "../../../Context/Context.jsx";

const SingUp = () => {
    const { Register } = useContext(ContextApi);
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [credential, setCredential] = useState({ fullName: "", email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const responce = await Register({ credential, navigate });
            setIsLoading(true)
            console.log(responce)
        } catch (error) {
            setIsLoading(false)
            console.error("Sign up failed:", error);
            alert(error.message || "Sign up failed. Please try again later.");
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredential(e => ({ ...e, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:px-6 lg:px-8">
            <div className="flex ml-10 cursor-pointer" onClick={() => navigate("/")}>
                <FaCircleArrowLeft size={30} />
            </div>
            <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Register as a new user
                    </h2>
                </div>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" onSubmit={handleSubmit}>
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6">

                            <div>
                                <label
                                    htmlFor="Full Name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="fullName"
                                        autoComplete="fullName"
                                        value={credential.fullName}
                                        onChange={handleChange}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={credential.email}
                                        onChange={handleChange}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={visible ? "text" : "password"}
                                        name="password"
                                        value={credential.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    {visible ? (
                                        <AiOutlineEye
                                            className="absolute right-2 top-2 cursor-pointer"
                                            size={25}
                                            onClick={() => setVisible(false)}
                                        />
                                    ) : (
                                        <AiOutlineEyeInvisible
                                            className="absolute right-2 top-2 cursor-pointer"
                                            size={25}
                                            onClick={() => setVisible(true)}
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                <button type="submit" disabled={isLoading}
                                    className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    {isLoading ? <AiOutlineLoading3Quarters size={20} className="text-green-500 animate-spin" /> : "Sign Up"}
                                </button>
                            </div>
                            <div className={`${styles.noramlFlex} w-full`}>
                                <h4>Already have an account?</h4>
                                <Link to="/login" className="text-blue-600 pl-2">
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingUp;
