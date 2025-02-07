import React, { useState, useEffect, useContext, useMemo } from 'react'
import { jwtDecode } from 'jwt-decode';
import { FaThumbsUp, FaThumbsDown, FaEllipsisV, FaTimes } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useParams } from "react-router-dom";;
import { ContextApi } from "../../../Context/Context";

const Review = () => {
    const { id } = useParams();
    const { showAlert } = useContext(ContextApi);
    const { fetchProductById } = useContext(ContextApi).adminProducts;
    const { fetchEventById } = useContext(ContextApi).adminEvents;
    const { addReview, delReview, editReview, giveLike, giveUnLike } = useContext(ContextApi).userReviews;
    const [reviews, setReviews] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [visibleReviews, setVisibleReviews] = useState(10);
    const [message, setMessage] = useState("");
    const [editingReview, setEditingReview] = useState(null);
    const [deletingReview, setDeletingReview] = useState(null);
    const [editedMessage, setEditedMessage] = useState("");
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [Loading, setLoading] = useState(false);

    const getCurrentUserId = () => {
        const token = localStorage.getItem("multi_token");
        if (!token) return null;
        try {
            return jwtDecode(token).userId;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    // fetch reviews 
    const fetchProduct = async () => {
        try {
            setLoading(true);
            const userId = getCurrentUserId();
            if (userId) setCurrentUserId(userId);
            let data = await fetchProductById({ productId: id });
            if (data.status == 200) {
                setReviews(data.product?.productReviews || []);
            } else if (data.message === "Product not found.") {
                data = await fetchEventById({ eventId: id })
                setReviews(data.event?.productReviews || []);
            } else {
                showAlert(data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    // add review 
    const handleAddReview = async () => {
        try {
            setLoading(true);
            const response = await addReview({ id, message });
            if (response.status !== 200) {
                setMessage("");
                return showAlert(response);
            }
            fetchProduct();
            setReviews((prev) => [response.review, ...prev]);
            setMessage("");
            if (!response || response.error) fetchProduct();
        } catch (error) {
            console.error("Error adding review:", error);
        } finally {
            setLoading(false);
        }
    };

    // edit review 
    const handleEditReview = async () => {
        if (!editingReview) return;
        try {
            setLoading(true);
            const data = await editReview({ id, messageId: editingReview?._id, message: editedMessage, });
            if (data.status !== 200) {
                return showAlert(data);
            }
            fetchProduct();
            setReviews((prev) => prev.map((e) => e._id === editingReview._id ? { ...editingReview, message: editedMessage } : e));
            if (!data || data.error) fetchProduct();
        } catch (error) {
            return error;
        } finally {
            setLoading(false)
            setEditingReview(null);
            setEditedMessage("");
        }
    };

    // delete review 
    const handleDeleteReview = async (messageId) => {
        try {
            setLoading(true);
            const data = await delReview({ id, messageId });
            setReviews((prev) => prev.filter((e) => e?._id !== messageId));
            if (!data || data.error) fetchProduct();
        } catch (error) {
            fetchProduct();
            return error;
        } finally {
            setLoading(false);
            setDeletingReview(null);
        }
    };

    // like message 
    const handleToggleLike = async (messageId) => {
        try {
            const review = reviews.find((rev) => rev._id === messageId);
            if (!review) return;

            const isLiked = review.likes?.userId.includes(currentUserId);
            const isDisliked = review.unLikes?.userId.includes(currentUserId);

            await giveLike({ id, messageId });

            setReviews((prevReviews) =>
                prevReviews.map((rev) =>
                    rev._id === messageId
                        ? {
                            ...rev,
                            likes: {
                                ...rev.likes,
                                userId: isLiked
                                    ? rev.likes.userId.filter((id) => id !== currentUserId)
                                    : [...rev.likes.userId, currentUserId],
                                totalLikes: isLiked ? rev.likes.totalLikes - 1 : rev.likes.totalLikes + 1,
                            },
                            unLikes: isDisliked
                                ? {
                                    ...rev.unLikes,
                                    userId: rev.unLikes.userId.filter((id) => id !== currentUserId),
                                    totalUnLikes: rev.unLikes.totalUnLikes - 1,
                                }
                                : rev.unLikes,
                        }
                        : rev
                )
            );
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    // unlike message 
    const handleUnLike = async (messageId) => {
        try {
            const review = reviews.find((rev) => rev._id === messageId);
            if (!review) return;

            const isDisliked = review.unLikes?.userId.includes(currentUserId);
            const isLiked = review.likes?.userId.includes(currentUserId);

            await giveUnLike({ id, messageId });

            setReviews((prevReviews) =>
                prevReviews.map((rev) =>
                    rev._id === messageId
                        ? {
                            ...rev,
                            unLikes: {
                                ...rev.unLikes,
                                userId: isDisliked
                                    ? rev.unLikes.userId.filter((id) => id !== currentUserId)
                                    : [...rev.unLikes.userId, currentUserId],
                                totalUnLikes: isDisliked ? rev.unLikes.totalUnLikes - 1 : rev.unLikes.totalUnLikes + 1,
                            },
                            likes: isLiked
                                ? {
                                    ...rev.likes,
                                    userId: rev.likes.userId.filter((id) => id !== currentUserId),
                                    totalLikes: rev.likes.totalLikes - 1,
                                }
                                : rev.likes,
                        }
                        : rev
                )
            );
        } catch (error) {
            console.error("Error toggling dislike:", error);
        }
    };

    const handleShowMore = () => setVisibleReviews((prev) => Math.min(prev + 10, reviews.length));
    const handleShowLess = () => setVisibleReviews(10);


    const finalReviews = useMemo(() => {
        const myReviews = reviews.filter((e) => e?.user?.userId === currentUserId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const otherReviews = reviews.filter((e) => e?.user?.userId !== currentUserId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return [...myReviews, ...otherReviews];
    }, [reviews, currentUserId]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Product Reviews</h1>
            {/* Add Review Section */}
            <div className="w-full px-4 sm:px-6 md:px-8 mb-8">
                <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Add a Review</h2>
                    <textarea
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={5}
                        placeholder="Write your review here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="mt-3 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                            onClick={() => setMessage("")}
                        >
                            Cancel
                        </button>
                        <button
                            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                            onClick={handleAddReview}
                            disabled={Loading}
                        >
                            {Loading ? (
                                <AiOutlineLoading3Quarters size={20} className="text-green-500 animate-spin" />
                            ) : (
                                "Add Review"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* display review section */}
            <div className="bg-gray-200 p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">All Reviews</h2>
                <div className="h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-4">
                    {Loading ? (
                        <div className="flex justify-center">
                            <AiOutlineLoading3Quarters size={40} className="animate-spin" />
                        </div>
                    ) : finalReviews.length > 0 ? (
                        finalReviews.slice(0, visibleReviews).map((review) => (
                            <div key={review?._id} className="bg-gray-50 rounded-lg p-4 shadow transition duration-300 hover:shadow-md relative">
                                <div className="flex items-start">
                                    <img src={review?.user?.avatar || "/public/pic.jpg"} className="w-10 h-10 rounded-full mr-4" />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{review?.user?.userName || "Anonymous"}</h3>
                                        <p className="mt-1 text-gray-600">{review?.message}</p>
                                        <div className="mt-2 flex items-center space-x-4">
                                            <span className={`flex items-center cursor-pointer gap-1.5 
                                                    ${review?.likes?.userId.includes(currentUserId) ? "text-red-500" : ""}`}
                                                onClick={() => handleToggleLike(review._id)}
                                            >
                                                <FaThumbsUp /> {review?.likes?.totalLikes || 0}
                                            </span>

                                            <span className={`flex items-center cursor-pointer gap-1.5 
                                                ${review?.unLikes?.userId.includes(currentUserId) ? "text-green-500" : ""}`}
                                                onClick={() => handleUnLike(review._id)}
                                            >
                                                <FaThumbsDown /> {review?.unLikes?.totalUnLikes || 0}
                                            </span>

                                        </div>
                                    </div>
                                    {review?.user?.userId === currentUserId && (
                                        <div className="relative">
                                            <button
                                                className="p-2 hover:bg-gray-200 rounded-full focus:outline-none transition duration-300"
                                                onClick={() => setActiveDropdown(activeDropdown === review._id ? null : review._id)}
                                            >
                                                <FaEllipsisV />
                                            </button>
                                            {activeDropdown === review._id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-300"
                                                        onClick={() => {
                                                            setEditingReview(review);
                                                            setEditedMessage(review.message);
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-300"
                                                        onClick={() => {
                                                            setDeletingReview(review);
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No reviews found.</p>
                    )}

                    <div className="mt-4 text-center">
                        {visibleReviews < finalReviews.length && (
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300 mr-2 focus:outline-none"
                                onClick={handleShowMore}
                            >
                                Show More
                            </button>
                        )}
                        {visibleReviews > 10 && (
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300 focus:outline-none"
                                onClick={handleShowLess}
                            >
                                Show Less
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Review Modal */}
            {editingReview && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Edit Review</h2>
                            <button onClick={() => setEditingReview(null)} className="text-gray-500 hover:text-gray-700">
                                <FaTimes />
                            </button>
                        </div>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            value={editedMessage}
                            onChange={(e) => setEditedMessage(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300 focus:outline-none"
                                onClick={() => setEditingReview(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none"
                                onClick={handleEditReview}
                            >
                                {Loading ? <AiOutlineLoading3Quarters size={20} className="text-green-500 animate-spin" /> : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingReview && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Delete Review</h2>
                            <button onClick={() => setDeletingReview(null)} className="text-gray-500 hover:text-gray-700">
                                <FaTimes />
                            </button>
                        </div>
                        <p className="mb-4">Are you sure you want to delete this review?</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300 focus:outline-none"
                                onClick={() => setDeletingReview(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 focus:outline-none"
                                onClick={() => handleDeleteReview(deletingReview?._id)}
                            >
                                {Loading ? <AiOutlineLoading3Quarters size={20} className="text-green-500 animate-spin" /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Review;
