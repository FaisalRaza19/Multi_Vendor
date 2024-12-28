import { useState, useEffect } from 'react'
import { Country, State, City } from 'country-state-city'
import { AiOutlineClose } from "react-icons/ai"
import { FaTrashAlt } from "react-icons/fa"

const Address = () => {
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [formData, setFormData] = useState({
        type: 'home',
        country: String,
        state: String,
        city: String,
        address: String,
        zipCode: String,
    })
    const [addresses, setAddresses] = useState([])
    const [isFormOpen, setIsFormOpen] = useState(false)

    useEffect(() => {
        setCountries(Country.getAllCountries())
    }, [])

    useEffect(() => {
        if (formData.country) {
            setStates(State.getStatesOfCountry(formData.country))
        }
    }, [formData.country])

    useEffect(() => {
        if (formData.country && formData.state) {
            setCities(City.getCitiesOfState(formData.country, formData.state))
        }
    }, [formData.country, formData.state])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setAddresses([...addresses, formData])
        setFormData({
            type: 'home',
            country: '',
            state: '',
            city: '',
            address: '',
            zipCode: '',
        })
        setIsFormOpen(false)
    }

    const openForm = () => setIsFormOpen(true)
    const closeForm = () => setIsFormOpen(false)

    const deleteAddress = (index) => {
        setAddresses(addresses.filter((_, i) => i !== index))
    }

    return (
        <div className="p-6 mt-28 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row mb-4 justify-between items-start sm:items-center">
                <h1 className="text-2xl font-semibold mb-4 sm:mb-0">Address Details</h1>
                <button
                    onClick={openForm}
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                    Add New Address
                </button>
            </div>
            <div className="space-y-4">
                {addresses.map((address, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                        <p className="font-medium">{address.type}</p>
                        <p className="text-sm">{`${address.address}, ${address.city}`}</p>
                        <p>{`${address.state},${Country.getCountryByCode(address.country)?.name}`}</p>
                        <p>{address.zipCode}</p>
                        <FaTrashAlt
                            className="text-gray-500 cursor-pointer"
                            onClick={() => deleteAddress(index)}
                        />
                    </div>
                ))}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                        <AiOutlineClose
                            onClick={closeForm}
                            className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-500"
                        />

                        <h2 className="text-xl font-semibold mb-4">Add Address</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1">Country</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Country</option>
                                    {countries.map((country) => (
                                        <option key={country.isoCode} value={country.isoCode}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">State</label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select State</option>
                                    {states.map((state) => (
                                        <option key={state.isoCode} value={state.isoCode}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">City</label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city) => (
                                        <option key={city.name} value={city.name}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Zip Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Address Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="home">Home</option>
                                    <option value="office">Office</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Address;