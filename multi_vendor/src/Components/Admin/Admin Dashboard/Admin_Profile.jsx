import React, { useState, useRef, useMemo } from 'react'
import { Country, State, City } from 'country-state-city'
import PhoneInput, { isValidPhoneNumber, getCountryCallingCode } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { FaCamera } from 'react-icons/fa'
import metadata from 'libphonenumber-js/metadata.min.json'

const Admin_Profile = ()=>{
  const [avatar, setAvatar] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const fileInputRef = useRef(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCountryChange = (e) => {
    const newCountry = e.target.value
    setSelectedCountry(newCountry)
    setSelectedState('')
    setSelectedCity('')
    setPhoneNumber('')
  }

  const supportedCountries = useMemo(() => {
    return Country.getAllCountries().filter(country => 
      metadata.countries[country.isoCode] !== undefined
    )
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div
                  className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={handleAvatarClick}
                >
                  {avatar ? (
                    <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FaCamera className="text-gray-400 text-4xl" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            <form className="space-y-6">
              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                  Shop Name
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="shopDescription" className="block text-sm font-medium text-gray-700">
                  Shop Description
                </label>
                <textarea
                  id="shopDescription"
                  name="shopDescription"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                >
                  <option value="">Select Country</option>
                  {supportedCountries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name} (+{getCountryCallingCode(country.isoCode)})
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
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">Select State</option>
                  {State.getStatesOfCountry(selectedCountry).map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
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
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Select City</option>
                  {City.getCitiesOfState(selectedCountry, selectedState).map((city) => (
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value || '')}
                  error={
                    phoneNumber
                      ? isValidPhoneNumber(phoneNumber)
                        ? undefined
                        : 'Invalid phone number'
                      : 'Phone number required'
                  }
                  className="mt-1 block w-full"
                />
                {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                  <p className="mt-2 text-sm text-red-600">Invalid phone number for the selected country</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_Profile;
