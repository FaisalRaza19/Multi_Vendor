import { React, useContext, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCircleArrowLeft } from "react-icons/fa6";
import styles from "../../../Styles/style.js";
import { Link, useNavigate } from "react-router-dom";
import { ContextApi } from "../../../Context/Context.jsx";

const AdminLogin = ({ isAuth }) => {
    const { ShopLogin } = useContext(ContextApi)
    const [visible, setVisible] = useState(false);
    const [credential, setCredential] = useState({ email: "", password: "" })
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSumbit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ShopLogin({ credential, navigate, isAuth })
            setLoading(true);
        } catch (error) {
            console.error("Sign up failed:", error);
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredential((e) => ({ ...e, [name]: value }))
    }
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="flex ml-10 cursor-pointer" onClick={() => navigate("/")}>
                <FaCircleArrowLeft size={30} />
            </div>
            <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Login to your account
                    </h2>
                </div>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" onSubmit={handleSumbit}>
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6">
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
                                        onChange={handleChange}
                                        value={credential.email}
                                        autoComplete="email"
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
                                        onChange={handleChange}
                                        value={credential.password}
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
                            <div className={`${styles.noramlFlex} justify-between`}>
                                <div className={`${styles.noramlFlex}`}>
                                    <input
                                        type="checkbox"
                                        name="remember-me"
                                        id="remember-me"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-900"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a
                                        href=".forgot-password"
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                            <div>
                                <button type="submit" disabled={Loading}
                                    className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    {Loading ? <AiOutlineLoading3Quarters size={20} className="text-green-500 animate-spin" /> : "Login"}
                                </button>
                            </div>
                            <div className={`${styles.noramlFlex} w-full`}>
                                <h4>Not have any account?</h4>
                                <Link to="/Shop-register" className="text-blue-600 pl-2">
                                    Sign Up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;