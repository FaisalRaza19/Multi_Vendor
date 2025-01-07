import React, { useState,useContext } from 'react'
import { Country, State, City } from 'country-state-city'
import { FaCircleArrowLeft } from 'react-icons/fa6'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from 'react-icons/ai'
import styles from "../../../Styles/style.js"
import PhoneInput from 'react-phone-number-input'
import { ContextApi } from "../../../Context/Context.jsx"
import 'react-phone-number-input/style.css'
import { useNavigate,Link } from 'react-router'

const Admin_Register = () => {
    const { registerShop } = useContext(ContextApi);
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({
        shopName: '', shopDescription: '', phoneNumber: '', email: '', password: '', country: '', state: '', city: '', zipCode: '', homeAddress: '',
    })
    const [Loading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const handlePhoneChange = (value) => {
        setFormData((prev) => ({ ...prev, phoneNumber: value || '' }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await registerShop({ formData,navigate})
        } catch (error) {
            setErrors({ general: 'An error occurred. Please try again.' })
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex ml-10 cursor-pointer" onClick={() => navigate("/")}>
        <FaCircleArrowLeft size={30} />
      </div>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8 w-full">
                    <h2 className="text-2xl font-bold mb-6 text-center">Admin Profile</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                                Shop Name
                            </label>
                            <input
                                type="text"
                                id="shopName"
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type={visible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center">
                                {visible ? (
                                    <AiOutlineEye
                                        className="cursor-pointer text-gray-400 hover:text-gray-500"
                                        size={20}
                                        onClick={() => setVisible(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="cursor-pointer text-gray-400 hover:text-gray-500"
                                        size={20}
                                        onClick={() => setVisible(true)}
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="shopDescription" className="block text-sm font-medium text-gray-700">
                                Shop Description
                            </label>
                            <textarea
                                id="shopDescription"
                                name="shopDescription"
                                rows={3}
                                value={formData.shopDescription}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                Country
                            </label>
                            <select
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">Select Country</option>
                                {Country.getAllCountries().map((country) => (
                                    <option key={country.isoCode} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                State
                            </label>
                            <select
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                                disabled={!formData.country}
                            >
                                <option value="">Select State</option>
                                {State.getStatesOfCountry(Country.getAllCountries().find(c => c.name === formData.country)?.isoCode).map((state) => (
                                    <option key={state.isoCode} value={state.name}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <select
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                                disabled={!formData.state}
                            >
                                <option value="">Select City</option>
                                {City.getCitiesOfState(
                                    Country.getAllCountries().find(c => c.name === formData.country)?.isoCode,
                                    State.getStatesOfCountry(Country.getAllCountries().find(c => c.name === formData.country)?.isoCode).find(s => s.name === formData.state)?.isoCode
                                ).map((city) => (
                                    <option key={city.name} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                                ZIP Code
                            </label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700">
                                Home Address
                            </label>
                            <input
                                type="text"
                                id="homeAddress"
                                name="homeAddress"
                                value={formData.homeAddress}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <PhoneInput
                                international
                                countryCallingCodeEditable={false}
                                defaultCountry="US"
                                value={formData.phoneNumber}
                                onChange={handlePhoneChange}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                {Loading ? <AiOutlineLoading3Quarters size={20} className="text-green-500 animate-spin" /> : "Register Shop"}
                            </button>
                            <div className={`${styles.noramlFlex} w-full mt-6`}>
                                <h4>Already have any account?</h4>
                                <Link to="/Shop-login" className="text-blue-600 pl-2">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Admin_Register;


