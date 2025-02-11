import React, { useContext, useState, useEffect } from "react";
import { FaHeart, FaEye, FaShoppingCart, FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ContextApi } from "../../../../Context/Context.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Products = () => {
  const { showAlert, adminProducts, userWishList,addToCart} = useContext(ContextApi);
  const { getAllProducts } = adminProducts;
  const { addToWishList } = userWishList;
  const [items, setItems] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const productsPerPage = 10;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      showAlert(data);
      setItems(data.allProducts);
      setTotalProducts(data.allProducts.length);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // add to wish list 
  const addToWish = async (id) => {
    try {
      const data = await addToWishList({ id });
      console.log(data);
    } catch (error) {
      return error
    }
  }
  // Calculate the displayed products based on the current page
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + visibleProducts;
  const displayedProducts = items.slice(startIndex, endIndex);

  // Show 10 more products
  const handleShowMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 10, productsPerPage));
  };

  // Change the page
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setVisibleProducts(10); // Reset visible products count when changing pages
  };

  const changeImage = (id, direction) => {
    setCurrentImageIndex((prev) => {
      const newIndex = { ...prev };
      const item = items.find((i) => i.id === id);
      if (item) {
        const totalImages = item.images.length;
        const currentIndex = prev[id] || 0;
        newIndex[id] =
          direction === "next"
            ? (currentIndex + 1) % totalImages
            : (currentIndex - 1 + totalImages) % totalImages;
      }
      return newIndex;
    });
  };

  return (
    <div className="p-4">
      {loading ? (
        <div className="h-screen mt-32 flex items-center justify-center">
          <AiOutlineLoading3Quarters size={45} className="text-green-500 animate-spin" />
        </div>
      ) : (
        <div className="relative mt-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            {displayedProducts.map((e) => (
              <div key={e?._id} className="min-w-[270px] flex-shrink-0 ml-7 border rounded p-2 shadow-md text-sm mb-6">
                <Link to={`/product/${e?.category?.replace(/\s+/g, "-")}/${e?._id}`} className="flex justify-center">
                  <img
                    src={e?.images?.[0]?.url || ""}
                    alt={e?.productTitle || "Product Image"}
                    className="w-40 h-40 object-cover rounded-lg mb-6"
                  />
                </Link>
                <Link to={`/admin_Shop/${e?.shopInfo?.shopId}`}>
                  <h3 className="text-gray-500 truncate text-sm mb-1">{e?.shopInfo?.shopName || "Shop Name"}</h3>
                </Link>
                <h2 className="font-semibold truncate mb-2">{e?.productTitle?.slice(0, 30) || ""}...</h2>
                <div className="flex items-center justify-between mb-2">
                  {e?.giveOffer ? (
                    <>
                      <span className="text-gray-400 line-through">${e?.actualPrice || 0}</span>
                      <span className="text-green-500 ml-20 font-bold">${e?.offerPrice || 0}</span>
                    </>
                  ) : (
                    <span className="text-green-500 font-bold">${e?.actualPrice || 0}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{e?.total_sell || 0} sold</span>
                  <div className="flex space-x-2">
                    <FaHeart size={20} onClick={() => addToWish(e?._id)} className="text-gray-400 hover:text-red-500 cursor-pointer" />
                    <FaEye size={20} onClick={() => { setSelectedProduct(e) }} className="text-gray-400 hover:text-blue-500 cursor-pointer" />
                    <FaShoppingCart size={20} onClick={() => addToCart(e)} className="text-gray-400 hover:text-green-500 cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {visibleProducts < productsPerPage && endIndex < totalProducts && (
            <div className="text-center mt-6">
              <button
                onClick={handleShowMore}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                Show More
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg shadow-md transition ${currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        {selectedProduct && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <button onClick={() => setSelectedProduct(null)} className="text-gray-600 hover:text-gray-800">
                  <FaArrowLeft size={24} />
                </button>
              </div>
              <div className="p-4">
                <div className="relative h-64">
                  <img
                    src={selectedProduct?.images[currentImageIndex[selectedProduct.id]]?.url}
                    alt=""
                    className="w-full h-full object-contain rounded-lg"
                  />
                  {selectedProduct?.images.length > 1 && (
                    <>
                      <button
                        onClick={() => changeImage(selectedProduct.id, "prev")}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={() => changeImage(selectedProduct.id, "next")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex mt-4 overflow-x-auto">
                  {selectedProduct?.images.map((image, index) => (
                    <img
                      key={index}
                      src={image?.url || "/placeholder.svg"}
                      alt=""
                      className={`w-16 h-16 object-cover rounded-lg mr-2 cursor-pointer ${index === (currentImageIndex[selectedProduct.id] || 0) ? "border-2 border-blue-500" : ""
                        }`}
                      onClick={() => setCurrentImageIndex({ ...currentImageIndex, [selectedProduct.id]: index })}
                    />
                  ))}
                </div>
                <h2 className="text-2xl font-bold mt-4">{selectedProduct?.productTitle}</h2>
                <p className="text-gray-600 mt-2">{selectedProduct?.productDescription}</p>
                <div className="mt-4">
                  {selectedProduct?.giveOffer ? (
                    <div className="flex justify-between">
                      <div className="flex">
                        <p className="text-xl text-gray-500 font-bold line-through">${selectedProduct?.actualPrice.toFixed(2)}</p>
                        <p className="text-xl font-bold ml-4">${selectedProduct?.offerPrice.toFixed(2)}</p>
                      </div>
                      <p className="text-xl text-green-500 font-bold ml-4">{selectedProduct?.offerPercent.toFixed(1)}% OFF</p>
                    </div>
                  ) : (
                    <p className="text-xl font-bold">${selectedProduct?.actualPrice.toFixed(2)}</p>
                  )}
                </div>
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition-colors">
                  <FaShoppingCart className="inline-block mr-2" /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;