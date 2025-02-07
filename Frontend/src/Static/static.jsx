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

// event data
export const products = [
    {
        id: 1,
        name: "Iphone 14pro max 8/256gb",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum molestias sequi, officiis iusto assumenda libero explicabo beatae amet consequuntur veniam fugiat corporis minus adipisci modi a aliquam maiores exercitationem provident.",
        image: "src/assets/downloaded_images/Apple-iPhone-14-Pro-Max-Gold-4.jpg?height=600&width=600",
        originalPrice: 1099,
        currentPrice: 999,
        soldCount: 120,
        url: "/shop/id:",
        endDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    },
    {
        id: 2,
        name: "Samsung Galaxy S23 Ultra",
        description: "Experience the ultimate in smartphone technology with the Samsung Galaxy S23 Ultra. Featuring a powerful camera system, long-lasting battery, and stunning display.",
        image: "src/assets/downloaded_images/product-details-2.png?height=600&width=600",
        originalPrice: 1299,
        currentPrice: 1199,
        url: "/shop/id:",
        soldCount: 85,
        endDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    },
    {
        id: 3,
        name: "Google Pixel 7 Pro",
        description: "Capture life's moments with extraordinary clarity using the Google Pixel 7 Pro. Powered by Google Tensor and featuring advanced AI capabilities.",
        image: "src/assets/downloaded_images/Google-Pixel-7-Pro-1.jpg?height=600&width=600",
        originalPrice: 899,
        currentPrice: 799,
        url: "/shop/id:",
        soldCount: 95,
        endDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
    },
];

// product data
export const productData = [
    {
        id: 1,
        category: "Computers and Laptops",
        name: "MacBook pro M2 chipset 256gb ssd 8gb ram space-gray color with apple 1 year warranty",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
        ],
        shop: {
            name: "Apple inc.",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 1099,
        discount_price: 1049,
        rating: 4,
        total_sell: 35,
        stock: 10,
    },
    {
        id: 2,
        category: "Mobile and Tablets",
        name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
        ],
        shop: {
            name: "Amazon Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        discount_price: 1099,
        rating: 5,
        total_sell: 80,
        stock: 10,
        category: "Mobile & Tablets"
    },
    {
        id: 3,
        category: "Computers and Laptop",
        name: "MacBook pro M2 chipset 256gb ssd 8gb ram space gray color with apple 1 year warranty",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
        ],
        shop: {
            name: "Apple inc.",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 1099,
        discount_price: 1049,
        rating: 4,
        total_sell: 75,
        stock: 10,
        category: "Computers & Laptop"
    },
    {
        id: 4,
        category: "Others",
        name: "New Fashionable Watch for men 2023 with multiple colors",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
        ],
        shop: {
            name: "Shahriar Watch House",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
            category: "Others"
        },
        price: 100,
        discount_price: 79,
        rating: 4,
        total_sell: 12,
        stock: 10,
    },
    {
        id: 5,
        category: "Shoes",
        name: "New Trend shoes for gents with all sizes",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
            },
            {
                public_id: "test",
                url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
            },
        ],
        shop: {
            name: "Alisha Shoes Mart",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 120,
        discount_price: 89,
        rating: 5,
        total_sell: 49,
        stock: 10,
        category: "Shoes"
    },
    {
        id: 6,
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
        category: "Music and Gaming"
    },
    {
        id: 7,
        name: "New Fashionable Watch for men 2023 with multiple colors",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
        ],
        shop: {
            name: "Shahriar Watch House",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 100,
        discount_price: 79,
        rating: 4,
        total_sell: 62,
        stock: 10,
    },
    {
        id: 8,
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
    },
    {
        id: 9,
        category: "Mobile and Tablets",
        name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
        ],
        shop: {
            name: "Amazon Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        discount_price: 1099,
        rating: 5,
        total_sell: 20,
        stock: 10,
    },
    {
        id: 10,
        category: "Music and Gaming",
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
    },
    {
        id: 11,
        category: "Computers and Laptops",
        name: "MacBook pro M2 chipset 256gb ssd 8gb ram space-gray color with apple 1 year warranty",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
        ],
        shop: {
            name: "Apple inc.",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 1099,
        discount_price: 1049,
        rating: 4,
        total_sell: 35,
        stock: 10,
    },
    {
        id: 12,
        category: "Mobile and Tablets",
        name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
        ],
        shop: {
            name: "Amazon Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        discount_price: 1099,
        rating: 5,
        total_sell: 80,
        stock: 10,
        category: "Mobile & Tablets"
    },
    {
        id: 13,
        category: "Computers and Laptop",
        name: "MacBook pro M2 chipset 256gb ssd 8gb ram space gray color with apple 1 year warranty",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
        ],
        shop: {
            name: "Apple inc.",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 1099,
        discount_price: 1049,
        rating: 4,
        total_sell: 75,
        stock: 10,
        category: "Computers & Laptop"
    },
    {
        id: 14,
        category: "Others",
        name: "New Fashionable Watch for men 2023 with multiple colors",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
        ],
        shop: {
            name: "Shahriar Watch House",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
            category: "Others"
        },
        price: 100,
        discount_price: 79,
        rating: 4,
        total_sell: 12,
        stock: 10,
    },
    {
        id: 15,
        category: "Shoes",
        name: "New Trend shoes for gents with all sizes",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
            },
            {
                public_id: "test",
                url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
            },
        ],
        shop: {
            name: "Alisha Shoes Mart",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 120,
        discount_price: 89,
        rating: 5,
        total_sell: 49,
        stock: 10,
        category: "Shoes"
    },
    {
        id: 16,
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
        category: "Music and Gaming"
    },
    {
        id: 17,
        name: "New Fashionable Watch for men 2023 with multiple colors",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
        ],
        shop: {
            name: "Shahriar Watch House",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 100,
        discount_price: 79,
        rating: 4,
        total_sell: 62,
        stock: 10,
    },
    {
        id: 18,
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
    },
    {
        id: 19,
        category: "Mobile and Tablets",
        name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
        ],
        shop: {
            name: "Amazon Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        discount_price: 1099,
        rating: 5,
        total_sell: 20,
        stock: 10,
    },
    {
        id: 20,
        category: "Music and Gaming",
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
    },
    {
        id: 1,
        category: "Computers and Laptops",
        name: "MacBook pro M2 chipset 256gb ssd 8gb ram space-gray color with apple 1 year warranty",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
        ],
        shop: {
            name: "Apple inc.",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 1099,
        discount_price: 1049,
        rating: 4,
        total_sell: 35,
        stock: 10,
    },
    {
        id: 2,
        category: "Mobile and Tablets",
        name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
        ],
        shop: {
            name: "Amazon Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        discount_price: 1099,
        rating: 5,
        total_sell: 80,
        stock: 10,
        category: "Mobile & Tablets"
    },
    {
        id: 3,
        category: "Computers and Laptop",
        name: "MacBook pro M2 chipset 256gb ssd 8gb ram space gray color with apple 1 year warranty",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
        ],
        shop: {
            name: "Apple inc.",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 1099,
        discount_price: 1049,
        rating: 4,
        total_sell: 75,
        stock: 10,
        category: "Computers & Laptop"
    },
    {
        id: 4,
        category: "Others",
        name: "New Fashionable Watch for men 2023 with multiple colors",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
        ],
        shop: {
            name: "Shahriar Watch House",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
            category: "Others"
        },
        price: 100,
        discount_price: 79,
        rating: 4,
        total_sell: 12,
        stock: 10,
    },
    {
        id: 5,
        category: "Shoes",
        name: "New Trend shoes for gents with all sizes",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
            },
            {
                public_id: "test",
                url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
            },
        ],
        shop: {
            name: "Alisha Shoes Mart",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 120,
        discount_price: 89,
        rating: 5,
        total_sell: 49,
        stock: 10,
        category: "Shoes"
    },
    {
        id: 6,
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
        category: "Music and Gaming"
    },
    {
        id: 7,
        name: "New Fashionable Watch for men 2023 with multiple colors",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
        ],
        shop: {
            name: "Shahriar Watch House",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 100,
        discount_price: 79,
        rating: 4,
        total_sell: 62,
        stock: 10,
    },
    {
        id: 8,
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
    },
    {
        id: 9,
        category: "Mobile and Tablets",
        name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
        ],
        shop: {
            name: "Amazon Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        discount_price: 1099,
        rating: 5,
        total_sell: 20,
        stock: 10,
    },
    {
        id: 10,
        category: "Music and Gaming",
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
    },
    {
        id: 11,
        category: "Computers and Laptops",
        name: "MacBook pro M2 chipset 256gb ssd 8gb ram space-gray color with apple 1 year warranty",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
        ],
        shop: {
            name: "Apple inc.",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 1099,
        discount_price: 1049,
        rating: 4,
        total_sell: 35,
        stock: 10,
    },
    {
        id: 12,
        category: "Mobile and Tablets",
        name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
        ],
        shop: {
            name: "Amazon Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        discount_price: 1099,
        rating: 5,
        total_sell: 80,
        stock: 10,
        category: "Mobile & Tablets"
    },
    {
        id: 13,
        category: "Computers and Laptop",
        name: "MacBook pro M2 chipset 256gb ssd 8gb ram space gray color with apple 1 year warranty",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
            {
                public_id: "test",
                url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
            },
        ],
        shop: {
            name: "Apple inc.",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 1099,
        discount_price: 1049,
        rating: 4,
        total_sell: 75,
        stock: 10,
        category: "Computers & Laptop"
    },
    {
        id: 14,
        category: "Others",
        name: "New Fashionable Watch for men 2023 with multiple colors",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
        ],
        shop: {
            name: "Shahriar Watch House",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
            category: "Others"
        },
        price: 100,
        discount_price: 79,
        rating: 4,
        total_sell: 12,
        stock: 10,
    },
    {
        id: 15,
        category: "Shoes",
        name: "New Trend shoes for gents with all sizes",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
            },
            {
                public_id: "test",
                url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
            },
        ],
        shop: {
            name: "Alisha Shoes Mart",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 120,
        discount_price: 89,
        rating: 5,
        total_sell: 49,
        stock: 10,
        category: "Shoes"
    },
    {
        id: 16,
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
        category: "Music and Gaming"
    },
    {
        id: 17,
        name: "New Fashionable Watch for men 2023 with multiple colors",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
            {
                public_id: "test",
                url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
            },
        ],
        shop: {
            name: "Shahriar Watch House",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 100,
        discount_price: 79,
        rating: 4,
        total_sell: 62,
        stock: 10,
    },
    {
        id: 18,
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
    },
    {
        id: 19,
        category: "Mobile and Tablets",
        name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
            {
                public_id: "test",
                url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
            },
        ],
        shop: {
            name: "Amazon Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        discount_price: 1099,
        rating: 5,
        total_sell: 20,
        stock: 10,
    },
    {
        id: 20,
        category: "Music and Gaming",
        name: "Gaming Headphone Asus with mutiple color and free delivery",
        description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
        image_Url: [
            {
                public_id: "test",
                url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
            },
            {
                public_id: "test",
                url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
            },
        ],
        shop: {
            name: "Asus Ltd",
            shop_avatar: {
                public_id: "test",
                url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
            },
            ratings: 4.2,
        },
        price: 300,
        discount_price: 239,
        rating: 4.5,
        reviews: [
            {
                user: {
                    // user object will be here
                },
                comment: "IT's so cool!",
                rating: 5,
            },
        ],
        total_sell: 20,
        stock: 10,
    },
];

// sidebar data 
import React from 'react'
import { AiOutlineMessage } from "react-icons/ai";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineTrackChanges } from "react-icons/md";
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
    { id: 7, label: "Address", icon: <TbAddressBook size={20} />, path: "/user-dashboard/address" },
];

// shop order 
export const orders = [
    {
        id: '643b069f269a3e46475fff',
        status: 'Refund Success',
        quantity: 1,
        total: 20.9
    },
    {
        id: '643a6c6df53539699e74',
        status: 'Delivered',
        quantity: 2,
        total: 74.8
    },
    {
        id: '643f73aeff6da914fe2609f',
        status: 'Delivered',
        quantity: 1,
        total: 53.9
    }
]

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
