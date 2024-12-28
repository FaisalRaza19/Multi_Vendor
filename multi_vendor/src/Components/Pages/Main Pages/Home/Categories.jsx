import { Link } from 'react-router';
import { brandingData, categoriesData } from "../../../../Static/static.jsx";

const Categories = () => {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Features Section */}
            <section className="py-8 md:py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {brandingData.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow bg-gray-50"
                            >
                                {feature.icon}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.Description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-6 md:py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                        Our Shop Top Categories
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                        {categoriesData.map((category, index) => (
                            <Link
                                key={index}
                                to={category.title}
                                className="group"
                            >
                                <div className="relative h-52 flex justify-center items-center overflow-hidden rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="relative flex justify-center items-center">
                                        <img
                                            src={category.image_Url}
                                            alt={category.title}
                                            width={100}
                                            height={100}
                                            className="object-contain"
                                        />
                                    </div>
                                    <h3 className="text-sm ml-2 md:text-base text-gray-900 font-medium text-center group-hover:text-orange-500 transition-colors mt-2">
                                        {category.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Categories;