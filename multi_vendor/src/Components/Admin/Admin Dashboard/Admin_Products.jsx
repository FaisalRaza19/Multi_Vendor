import React, { useContext, useEffect, useState } from "react";
import { FaEye, FaTimes, FaEdit, FaChevronLeft, FaChevronRight, FaTrashAlt } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { ContextApi } from "../../../Context/Context.jsx";

const Admin_Products = () => {
  const { getShop, deleteProduct, editProduct } = useContext(ContextApi);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [del, setDel] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState();
  const [Loading, setLoading] = useState(false);

  // get shop
  const fetchShop = async () => {
    setLoading(true);
    try {
      const data = await getShop();
      setLoading(true);
      setProducts(data.shop.products);
    } catch (error) {
      console.error("Error during fetch shop:", error);
    } finally {
      setLoading(false);
    };
  }

  // delete product 
  const delProduct = async (productId) => {
    setLoading(true);
    try {
      const data = await deleteProduct(productId)
      setProducts(data.data)
      setLoading(true);
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error durin del product");
    } finally {
      setLoading(false);
    }
  }

  // edit shop
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (!formData) {
      console.error("Form data is missing.");
      return;
    }

    try {
      const productData = {
        productId: formData?._id,
        productTitle: formData?.productTitle,
        productDescription: formData?.productDescription,
        actualPrice: formData?.actualPrice,
        giveOffer: formData?.giveOffer || false,
        offerPercent: formData?.offerPercent || null,
        stock: formData?.stock,
        publicId: formData?.images?.map((img) => ({ public_id: img?.public_id })),
        productImages: formData?.images?.map((img) => img?.file).filter((file) => file !== null),
      };

      const updatedProduct = await editProduct(productData);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct.data._id ? updatedProduct.data : product
        )
      );
    } catch (error) {
      console.error("Error during product save:", error.message);
    } finally {
      setLoading(false)
      setIsEditing(false);
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);

  const handleEdit = (product) => {
    setFormData({
      ...product,
      productId: product._id,
      giveOffer: product.offerPrice !== null,
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      if (type === "checkbox") {
        return { ...prev, [name]: (e.target).checked };
      }
      if (name === "actualPrice" || name === "offerPercent") {
        return { ...prev, [name]: parseFloat(value) };
      }
      return { ...prev, [name]: value };
    });
  };

  const calculateOfferPrice = (price, percent) => {
    return price - (price * percent) / 100;
  };

  const handleImageNavigation = (direction) => {
    if (!selectedProduct) return;
    const lastIndex = selectedProduct.images.length - 1;
    if (direction === 'next') {
      setCurrentImageIndex(currentImageIndex === lastIndex ? 0 : currentImageIndex + 1);
    } else {
      setCurrentImageIndex(currentImageIndex === 0 ? lastIndex : currentImageIndex - 1);
    }
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Ensure a maximum of 4 images
    if ((formData?.images?.length || 0) + fileArray.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }

    // Create new image objects with file and URL.
    const newImages = fileArray.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    // Update state with the new images.
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, images: [...prev.images, ...newImages] };
    });
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      };
    });
  };

  return (
    <div className="min-h-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Products</h1>
      {/* Product Table */}
      <div className="bg-white w-full rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 text-center">Image</th>
                <th className="p-3 text-center">Title</th>
                <th className="p-3 text-center">Actual Price</th>
                <th className="p-3 text-center">Offer Price</th>
                <th className="p-3 text-center">Stock</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            {Loading ? (
              <tbody>
                <tr>
                  <td colSpan="6" className="p-5">
                    <div className="flex justify-center items-center">
                      <AiOutlineLoading3Quarters size={30} className="text-green-500 animate-spin" />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {products.length > 0 ? products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-100">
                    <td className="p-3 text-center">
                      <img
                        src={product.images[0]?.url}
                        alt={product.productTitle}
                        className="w-12 h-12 object-cover mx-auto"
                      />
                    </td>
                    <td className="p-3 text-center">
                      {product.productTitle.length > 25
                        ? `${product.productTitle.slice(0, 25)}...`
                        : product.productTitle}
                    </td>
                    <td className="p-3 text-center">${product.actualPrice}</td>
                    <td className="p-3 text-center">
                      {product?.offerPrice ? product.offerPrice.toFixed(2) : 0}
                    </td>
                    <td className="p-3 text-center">{product.stock}</td>
                    <td className="p-3 flex justify-center items-center gap-4 mt-4">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => {
                          setSelectedProduct(product);
                          setCurrentImageIndex(0);
                        }}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="text-green-500 hover:underline"
                        onClick={() => handleEdit(product)}
                      >
                        <FaEdit />
                      </button>
                      <button onClick={() => { setDel(product); setIsModalOpen(true) }}><FaTrashAlt /></button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="p-5">
                      <span className="flex items-center justify-center text-xl">Product Not Found</span>
                    </td>
                  </tr>
                )}
              </tbody>

            )}
          </table>
        </div>
      </div>

      {isModalOpen && del && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this product with this productId : "{del._id}"</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => delProduct(del._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                {Loading ? <AiOutlineLoading3Quarters size={20} className="text-white animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )
      }

      {/* Product Detail and Edit Form */}
      {
        (selectedProduct || isEditing) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isEditing ? "Edit Product" : selectedProduct?.productTitle}
                </h2>
                <button
                  className="text-gray-500"
                  onClick={() => {
                    setSelectedProduct(null);
                    setIsEditing(false);
                    setFormData(null);
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {!isEditing && selectedProduct && (
                <div>
                  <div className="relative mb-4 min-w-full h-60">
                    <img
                      src={selectedProduct.images[currentImageIndex].url}
                      alt={`${selectedProduct.productTitle} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full rounded-lg object-contain mb-2"
                    />
                    <button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                      onClick={() => handleImageNavigation('prev')}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                      onClick={() => handleImageNavigation('next')}
                    >
                      <FaChevronRight />
                    </button>
                  </div>

                  <div className="flex overflow-x-auto space-x-2 mb-4">
                    {selectedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`${selectedProduct.productTitle} - Thumbnail ${index + 1}`}
                        className={`w-16 h-16 object-cover cursor-pointer ${index === currentImageIndex ? "border-2 border-blue-500" : ""
                          }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                  <p className="mb-2">{selectedProduct.productDescription}</p>
                  <p className="text-gray-600 mb-2">
                    <span>Actual Price: ${selectedProduct.actualPrice}</span> <br />
                    {selectedProduct.offerPrice && (
                      <>
                        <span>Offer Price: ${selectedProduct.offerPrice ? selectedProduct.offerPrice.toFixed(2) : 0}</span> <br />
                        <span>Offer Percent : {selectedProduct.offerPercent}%</span>
                      </>
                    )}
                  </p>
                  <p className="text-gray-600 mb-2">Ratings: {selectedProduct.ratings}</p>
                  <p className="text-gray-600 mb-4">Reviews: {selectedProduct.productReviews}</p>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleEdit(selectedProduct)}
                  >
                    Edit
                  </button>
                </div>
              )}

              {isEditing && formData && (
                <form onSubmit={handleSave}>
                  <div className="mb-4">
                    <label className="block mb-2">Images</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url || URL.createObjectURL(image)}
                            alt=""
                            className="w-20 h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 p-0.5 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <RxCrossCircled size={17} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleImageUpload}
                      className="w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Title</label>
                    <input
                      type="text"
                      name="productTitle"
                      value={formData.productTitle}
                      onChange={handleChange}
                      className="border p-2 w-full rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Price</label>
                    <input
                      type="number"
                      name="actualPrice"
                      value={formData.actualPrice}
                      onChange={handleChange}
                      className="border p-2 w-full rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Description</label>
                    <textarea
                      name="productDescription"
                      value={formData.productDescription}
                      onChange={handleChange}
                      className="border p-2 w-full rounded"
                      rows={3}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block font-medium mb-2">Stock Status</label>
                    <select
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring"
                    >
                      <option value={'in stock'}>In Stock</option>
                      <option value={'limited stock'}>Limited Stock</option>
                      <option value={'out of stock'}>Out of Stock</option>
                    </select>
                  </div>
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      name="giveOffer"
                      checked={formData.giveOffer}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label>Give Offer</label>
                  </div>
                  {formData.giveOffer && (
                    <div className="mb-4">
                      <label className="block mb-2">Discount Percentage</label>
                      <input
                        type="number"
                        name="offerPercent"
                        value={formData.offerPercent}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                      />
                      <p className="text-gray-600 mt-2">
                        Offer Price: ${calculateOfferPrice(formData.actualPrice, formData.offerPercent).toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      {Loading ? <AiOutlineLoading3Quarters size={20} className="text-white animate-spin" /> : "Save"}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )
      }

    </div >
  )
};

export default Admin_Products;
