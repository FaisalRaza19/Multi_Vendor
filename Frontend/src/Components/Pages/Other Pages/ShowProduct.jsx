import React, { useState, useEffect, useContext } from "react"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { ContextApi } from "../../../Context/Context";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useParams } from "react-router-dom";
import Review from "./Review.jsx"
import SuggestedItems from "./sugestedItems.jsx";

const ShowProduct = () => {
  const { id } = useParams();
  const { fetchProductById } = useContext(ContextApi).adminProducts;
  const [items, setItems] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [Loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      const data = await fetchProductById({productId : id});
      setLoading(true)
      setItems(data.product);
    } catch (error) {
      return error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (items?.images?.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % items.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [items?.images]);

  const scrollImage = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === "left") {
        return prevIndex === 0 ? items?.images.length - 1 : prevIndex - 1;
      } else {
        return (prevIndex + 1) % items?.images.length;
      }
    });
  };
  return (
    <>
      {Loading ? (
        <div className="flex justify-center">
          <AiOutlineLoading3Quarters size={20} className="text-green-500 animate-spin" />
        </div>
      ) : (
        <div className="grid relative lg:mt-32 sm:mt-5 md:mt-8">
          <div className="flex flex-col lg:flex-row gap-8 p-4 max-w-7xl mx-auto">
            <div className="lg:w-1/2 w-full">
              <div className="relative mb-4">
                <img
                  src={items?.images[currentImageIndex]?.url}
                  className="w-full h-[370px] max-h-[600px] object-contain rounded-lg"
                  alt="Product Image"
                />
                <button
                  onClick={() => scrollImage("left")}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
                >
                  <FaChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => scrollImage("right")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
                >
                  <FaChevronRight className="w-6 h-6" />
                </button>
              </div>
              <div className="flex overflow-x-auto gap-2 pb-2">
                {items?.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    width={100}
                    height={100}
                    className={`w-24 h-24 object-cover rounded cursor-pointer ${index === currentImageIndex ? "border-2 border-blue-500" : ""}`}
                    onClick={() => setCurrentImageIndex(index)}
                    alt={`Thumbnail ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full mt-5">
              <h1 className="text-3xl font-bold mb-4">{items?.productTitle || "Product"}</h1>
              <p className="mb-4">{items?.productDescription || "Description"}</p>
              <div className="mb-4">
                {items?.offerPrice ? (
                  <div className="flex justify-between items-center">
                    <div className="flex gap-5">
                      <span className="text-lg line-through text-gray-500 mr-2 mt-1">${items?.actualPrice}</span>
                      <span className="text-2xl font-bold text-green-600 mr-2">${items?.offerPrice.toFixed(2)}</span>
                    </div>
                    <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">{items?.offerPercent.toFixed(2)}% OFF</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">${items?.actualPrice}</span>
                )}
              </div>
              <button className="w-full max-w-[300px] py-2 mt-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white">
                Add To Cart
              </button>
            </div>
          </div>
          <Review />
          <SuggestedItems />
        </div>
      )}
    </>
  );
};

export default ShowProduct;


