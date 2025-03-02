import React, { useState, useEffect, useContext } from "react"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { ContextApi } from "../../../Context/Context";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import Review from "./Review.jsx"
import SuggestedItems from "./sugestedItems.jsx";
import { timeLeft } from "../../../utils/timeLeft.jsx"
import {useNavigate} from "react-router-dom";

const ShowEvent = () => {
  const { id } = useParams();
  const { showAlert,chat,adminEvents} = useContext(ContextApi);
  const { user_CreateChat } = chat;
  const { fetchEventById } = adminEvents;
  const [items, setItems] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null)
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      const data = await fetchEventById({ eventId: id });
      setLoading(true)
      setItems(data.event);
    } catch (error) {
      return error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const chatWithSeller = async (id) => {
    try {
      setLoading(true)
      const data = await user_CreateChat({ sellerId: id,navigate});
      showAlert(data)
    } catch (error) {
      return error
    } finally {
      setLoading(false);
    }
  }

  // time left
  useEffect(() => {
    if (!items?.eventStart) return;
    const interval = setInterval(() => {
      setRemainingTime(timeLeft(items.eventStart));
    }, 1000);
    return () => clearInterval(interval);
  }, [items?.eventStart]);

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
              <span className='font-bold'>{remainingTime}</span>
              <div className="flex gap-4">
                <button onClick={(e)=> chatWithSeller(items?.shopInfo?.shopId)} className="flex gap-3 w-52 items-center justify-center rounded-lg mt-7 bg-blue-400 cursor-pointer text-white h-12 p-3">
                  {Loading ? <AiOutlineLoading3Quarters size={18} className="animate-spin" /> : <IoChatboxEllipsesOutline size={18} className="text-black" />}
                  <span>Chat With Seller</span>
                </button>
                <button className={`w-60 h-12 mt-7 rounded-lg ${new Date(items?.eventStart) > new Date() ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  disabled={new Date(items?.eventStart) > new Date()}
                >
                  {new Date(items?.eventStart) > new Date() ? "Coming Soon" : "Add To Cart"}
                </button>
              </div>
            </div>
          </div>
          <Review />
          <SuggestedItems />
        </div>
      )}
    </>
  );
};

export default ShowEvent


