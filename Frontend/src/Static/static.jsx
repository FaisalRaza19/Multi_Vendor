// categories data
export const categoriesData = [
    {
        id: 1,
        title: "Computers and Laptops",
    },
    {
        id: 2,
        title: "cosmetics and body care",
    },
    {
        id: 3,
        title: "Accesories",
    },
    {
        id: 4,
        title: "Cloths",
    },
    {
        id: 5,
        title: "Shoes",
    },
    {
        id: 6,
        title: "Gifts",
    },
    {
        id: 7,
        title: "Pet Care",
    },
    {
        id: 8,
        title: "Mobile and Tablets",
    },
    {
        id: 9,
        title: "Music and Gaming",
    },
    {
        id: 10,
        title: "Others",
    },
];

// faq data
export const faqData = [
    {
        id: 1,
        question: "What is your return policy?",
        answer:
            "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To initiate a return, please email us at support@myecommercestore.com with your order number and a brief explanation of why you're returning the item.",
    },
    {
        id: 2,
        question: "How do I track my order?",
        answer:
            "You can track your order by clicking the tracking link in your shipping confirmation email, or by logging into your account on our website and viewing the order details.",
    },
    {
        id: 3,
        question: "How do I contact customer support?",
        answer:
            "You can contact our customer support team by emailing us at support@myecommercestore.com, or by calling us at (555) 123-4567 between the hours of 9am and 5pm EST, Monday through Friday.",
    },
    {
        id: 4,
        question: "Can I change or cancel my order?",
        answer:
            "Unfortunately, once an order has been placed, we are not able to make changes or cancellations. If you no longer want the items.you've ordered, you can return them for a refund within 30 days of delivery.",
    },
    {
        id: 5,
        question: "Do you offer international shipping?",
        answer:
            " Currently, we only offer shipping within the United States",
    },
    {
        id: 6,
        question: "Do you offer international shipping?",
        answer:
            "We accept visa,mastercard,paypal payment method also we have cash on delivery system.",
    },
];

// sidebar data 
import React from 'react'
import { AiOutlineMessage } from "react-icons/ai";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineTrackChanges,MdFavorite } from "react-icons/md";
import { BsCreditCard2Back } from "react-icons/bs";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
export const menuItems = [
    { id: 1, label: "Profile", icon: <RxPerson size={20} />, path: "/user-dashboard/profile" },
    { id: 2, label: "Orders", icon: <HiOutlineShoppingBag size={20} />, path: "/user-dashboard/orders" },
    { id: 3, label: "Refunds", icon: <HiOutlineReceiptRefund size={20} />, path: "/user-dashboard/refunds" },
    { id: 4, label: "Inbox", icon: <AiOutlineMessage size={20} />, path: "/user-dashboard/inbox" },
    { id: 5, label: "Track Order", icon: <MdOutlineTrackChanges size={20} />, path: "/user-dashboard/track-order" },
    { id: 6, label: "Payment Method", icon: <BsCreditCard2Back size={20} />, path: "/user-dashboard/payment-method" },
    { id: 7, label: "Wish List", icon: <MdFavorite size={20} />, path: "/user-dashboard/wishlist" },
    { id: 8, label: "Address", icon: <TbAddressBook size={20} />, path: "/user-dashboard/address" },
];


// admin side bar data 
import { FiLayout, FiShoppingBag, FiPackage, FiFilePlus, FiTag, FiPlusCircle, FiDollarSign, FiMessageSquare, FiGift, FiRefreshCw, } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
export const sideItems =  [
    { icon: FiLayout, label: 'Dashboard', href: '/Shop/:shopId/dashboard' },
    { icon: FiShoppingBag, label: 'All Orders', href: '/Shop/:shopId/orders' },
    { icon: FiPackage, label: 'All Products', href: '/Shop/:shopId/products' },
    { icon: FiFilePlus, label: 'Create Product', href: '/Shop/:shopId/createProduct' },
    { icon: FiTag, label: 'All Events', href: '/Shop/:shopId/events' },
    { icon: FiPlusCircle, label: 'Create Event', href: '/Shop/:shopId/createEvent' },
    { icon: FiDollarSign, label: 'Withdraw Money', href: '/Shop/:shopId/withdraw' },
    { icon: FiMessageSquare, label: 'Shop Inbox', href: '/Shop/:shopId/inbox' },
    { icon: FiGift, label: 'Discount Codes', href: '/Shop/:shopId/discounts' },
    { icon: FiRefreshCw, label: 'Refunds', href: '/Shop/:shopId/refunds' },
    { icon: IoSettingsOutline, label: 'Settings', href: '/Shop/:shopId/settings' },
];

export const brandingData = [
    {
        id: 1,
        title: "Free Shipping",
        Description: "From all orders over 100$",
        icon: (
            <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M1 1H5.63636V24.1818H35"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                ></path>
                <path
                    d="M8.72763 35.0002C10.4347 35.0002 11.8185 33.6163 11.8185 31.9093C11.8185 30.2022 10.4347 28.8184 8.72763 28.8184C7.02057 28.8184 5.63672 30.2022 5.63672 31.9093C5.63672 33.6163 7.02057 35.0002 8.72763 35.0002Z"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                ></path>
                <path
                    d="M31.9073 35.0002C33.6144 35.0002 34.9982 33.6163 34.9982 31.9093C34.9982 30.2022 33.6144 28.8184 31.9073 28.8184C30.2003 28.8184 28.8164 30.2022 28.8164 31.9093C28.8164 33.6163 30.2003 35.0002 31.9073 35.0002Z"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                ></path>
                <path
                    d="M34.9982 1H11.8164V18H34.9982V1Z"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                ></path>
                <path
                    d="M11.8164 7.18164H34.9982"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                ></path>
            </svg>
        ),
    },
    {
        id: 2,
        title: "Daily Surprise Offers",
        Description: "Save up to 25% off",
        icon: (
            <svg
                width="32"
                height="34"
                viewBox="0 0 32 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M31 17.4502C31 25.7002 24.25 32.4502 16 32.4502C7.75 32.4502 1 25.7002 1 17.4502C1 9.2002 7.75 2.4502 16 2.4502C21.85 2.4502 26.95 5.7502 29.35 10.7002"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                ></path>
                <path
                    d="M30.7 2L29.5 10.85L20.5 9.65"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                ></path>
            </svg>
        ),
    },
    {
        id: 4,
        title: "Affortable Prices",
        Description: "Get Factory direct price",
        icon: (
            <svg
                width="32"
                height="35"
                viewBox="0 0 32 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M7 13H5.5C2.95 13 1 11.05 1 8.5V1H7"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                ></path>
                <path
                    d="M25 13H26.5C29.05 13 31 11.05 31 8.5V1H25"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                ></path>
                <path
                    d="M16 28V22"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                ></path>
                <path
                    d="M16 22C11.05 22 7 17.95 7 13V1H25V13C25 17.95 20.95 22 16 22Z"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                ></path>
                <path
                    d="M25 34H7C7 30.7 9.7 28 13 28H19C22.3 28 25 30.7 25 34Z"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                ></path>
            </svg>
        ),
    },
    {
        id: 5,
        title: "Secure Payments",
        Description: "100% protected payments",
        icon: (
            <svg
                width="32"
                height="38"
                viewBox="0 0 32 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M22.6654 18.667H9.33203V27.0003H22.6654V18.667Z"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                ></path>
                <path
                    d="M12.668 18.6663V13.6663C12.668 11.833 14.168 10.333 16.0013 10.333C17.8346 10.333 19.3346 11.833 19.3346 13.6663V18.6663"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                ></path>
                <path
                    d="M31 22C31 30.3333 24.3333 37 16 37C7.66667 37 1 30.3333 1 22V5.33333L16 2L31 5.33333V22Z"
                    stroke="#FFBB38"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                ></path>
            </svg>
        ),
    },
];

// navigation Data
export const navItems = [
    {
        title: "Home",
        url: "/",
    },
    {
        title: "Best Selling",
        url: "/best-selling",
    },
    {
        title: "Products",
        url: "/products",
    },
    {
        title: "Events",
        url: "/events",
    },
    {
        title: "FAQ",
        url: "/FAQ",
    },
];

export const footerProductLinks = [
    {
        name: "About us",
        link: "/about"
    },
    {
        name: "Careers",
        link: "/carrers"
    },
    {
        name: "Store Locations",
    },
    {
        name: "Our Blog",
    },
    {
        name: "Reviews",
    },
];

export const footercompanyLinks = [
    {
        id: 0,
        name: "Game & Video",
        url: "/game"
    },
    {
        id: 1,
        name: "Phone & Tablets",
        url: "/phone"
    },
    {
        id: 2,
        name: "Computers & Laptop",
        url: "/laptop"
    },
    {
        id: 3,
        name: "Sport & Watches",
        url: "/Sport"
    },
    {
        id: 4,
        name: "Events",
        url: "/events"
    },
];

export const footerSupportLinks = [
    {
        name: "FAQ",
    },
    {
        name: "Reviews",
    },
    {
        name: "Contact Us",
    },
    {
        name: "Shipping",
    },
    {
        name: "Live chat",
    },
];
