import { useContext, useEffect, useState } from 'react'
import { FaCamera, FaEdit, FaEnvelope, FaStore, FaMapMarkerAlt, FaPhone, FaGlobe, FaTimes } from 'react-icons/fa'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Country, State, City } from 'country-state-city'
import { ContextApi } from "../../../Context/Context.jsx"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useNavigate } from 'react-router'

const Admin_Profile = () => {
  const { getShop, UpdateShopLogo, UpdateShopProfile } = useContext(ContextApi);
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState('')
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [Loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate();

  const exactData = {
    shopName: formData.shopName,
    phoneNumber: formData.phoneNumber,
    shopDescription: formData.shopDescription,
    email: formData.personalInfo?.email,
    country: formData.personalInfo?.address?.country,
    state: formData.personalInfo?.address?.state,
    city: formData.personalInfo?.address?.city,
    zipCode: formData.personalInfo?.address?.zipCode,
    homeAddress: formData.personalInfo?.address?.homeAddress,
  }

  // fetch shop
  const fetchShop = async () => {
    try {
      const data = await getShop();
      setUser(data.shop)
      setFormData(data.shop)
      setProfileImage(data.shop.shopLogo?.url || "/public/pic.jpg")
    } catch (error) {
      console.error("Error fetching shop data:", error);
    }
  }

  useEffect(() => {
    fetchShop();
  }, [])

  // update logo
  const handleImageUpload = async (e) => {
    const { files } = e.target;
    setLoading(true);
    if (files && files[0]) {
      const file = files[0];
      try {
        const updatedAvatar = await UpdateShopLogo(file);
        setLoading(true);
        setProfileImage(updatedAvatar);
      } catch (err) {
        console.error("Error updating user avatar:", err);
      } finally {
        setLoading(false);
      }
    }
  }

  // Handle input changes in the edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        email: name === "email" ? value : prev.personalInfo?.email,
        address: {
          ...prev.personalInfo?.address,
          ...(["country", "state", "city", "zipCode", "homeAddress"].includes(name) && { [name]: value }),
        },
      },
      ...(!["email", "country", "state", "city", "zipCode", "homeAddress"].includes(name) && { [name]: value }),
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phoneNumber: value || '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await UpdateShopProfile({ exactData, navigate });
      setLoading(true)
      fetchShop();
      setUser(data.shop)
      setIsEditFormOpen(false)
    } catch (err) {
      console.error("Error during profile update:", err);
      setLoading(false)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="relative h-64 sm:h-80 lg:h-96">
          <div>
            {Loading ? (
              <div className="flex items-center justify-center h-96">
                <AiOutlineLoading3Quarters className="w-20 h-20 flex items-center justify-center text-green-500 animate-spin" />
              </div>
            ) : (
              <img
                src={profileImage || "public/pic.jpg"}
                alt="Profile"
                layout="fill"
                objectFit="cover"
                className="h-96 w-full transition-opacity duration-300 ease-in-out hover:opacity-90"
              />
            )}
          </div>
          <label htmlFor="imageUpload" className="absolute bottom-4 right-4 bg-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-gray-100 transition duration-300">
            <FaCamera className="text-gray-600 text-xl" />
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <div className="p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-3xl font-bold text-gray-800">{user?.shopName}</h2>
              <p className="text-gray-600 mt-2 italic">{user?.shopDescription}</p>
            </div>
            <button
              onClick={() => setIsEditFormOpen(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 flex items-center shadow-md"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center">
                <FaEnvelope className="text-blue-500 mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.personalInfo?.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-blue-500 mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{`${user?.personalInfo?.address?.city}, ${user?.personalInfo?.address?.state}`}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaGlobe className="text-blue-500 mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">{user?.personalInfo?.address?.country}</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center">
                <FaStore className="text-blue-500 mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Shop Address</p>
                  <p className="font-medium">{user?.personalInfo?.address?.homeAddress},</p>
                  <p className="font-medium">{`${user?.personalInfo?.address?.city}, ${user?.personalInfo?.address?.state}, ${user?.personalInfo?.address?.zipCode}`}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-blue-500 mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{user?.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsEditFormOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    <FaEnvelope className="inline-block mr-2 text-blue-500" /> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={exactData?.email || ""}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                    <FaStore className="inline-block mr-2 text-blue-500" /> Shop Name
                  </label>
                  <input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={exactData?.shopName || ""}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="shopDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Description
                </label>
                <textarea
                  id="shopDescription"
                  name="shopDescription"
                  value={exactData?.shopDescription || ""}
                  onChange={handleEditFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={7}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Country Dropdown */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    <FaGlobe className="inline-block mr-2 text-blue-500" /> Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={exactData?.country || ''}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">{exactData?.country || "Select Country"}</option>
                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State Dropdown */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    <FaMapMarkerAlt className="inline-block mr-2 text-blue-500" /> State
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={exactData?.state || ''}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!exactData?.country}
                  >
                    <option value="">{exactData?.state || "Select State"}</option>
                    {exactData?.country &&
                      State.getStatesOfCountry(
                        Country.getAllCountries().find((c) => c.name === exactData?.country)?.isoCode
                      ).map((state) => (
                        <option key={state.isoCode} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* City Dropdown */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    <FaMapMarkerAlt className="inline-block mr-2 text-blue-500" /> City
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={exactData?.city || ''}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!exactData?.state}
                  >
                    <option value="">{exactData?.city || "Select City"}</option>
                    {exactData?.country &&
                      exactData?.state &&
                      City.getCitiesOfState(
                        Country.getAllCountries().find((c) => c.name === exactData?.country)?.isoCode,
                        State.getStatesOfCountry(
                          Country.getAllCountries().find((c) => c.name === exactData?.country)?.isoCode
                        ).find((s) => s.name === exactData?.state)?.isoCode
                      ).map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    <FaStore className="inline-block mr-2 text-blue-500" /> Shop Address
                  </label>
                  <input
                    type="text"
                    id="homeAddress"
                    name="homeAddress"
                    value={exactData?.homeAddress || ""}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    <FaMapMarkerAlt className="inline-block mr-2 text-blue-500" /> Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={exactData?.zipCode || ''}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaPhone className="inline-block mr-2 text-blue-500" /> Phone Number
                </label>
                <PhoneInput
                  value={exactData?.phoneNumber}
                  onChange={handlePhoneChange}
                  defaultCountry="US"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setIsEditFormOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {Loading ? <AiOutlineLoading3Quarters size={20} className="text-green-500 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin_Profile;



