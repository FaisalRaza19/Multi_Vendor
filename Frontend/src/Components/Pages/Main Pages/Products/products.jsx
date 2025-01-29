import React from 'react';
import { FaHeart, FaEye, FaShoppingCart } from 'react-icons/fa';
import { productData as items } from "../../../../Static/static.jsx";
import { Link } from "react-router-dom";

const Products = () => {
  return (
    <div className="p-4">
      <div className="relative mt-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          {items.map((e) => (
            <div key={e.id} className="min-w-[260px] flex-shrink-0 ml-7 border rounded p-2 shadow-md text-sm mb-6">
              <Link to={`/product/${e.id}`} className='flex justify-center'>
                <img src={e.image_Url[0].url || e.image_Url[1].url} alt="" className="w-52 h-52 object-cover mb-5" />
              </Link>
              <Link to={`/shop/${e.shop.name}`}>
                <h3 className="text-gray-500 truncate text-sm mb-1">{e.shop.name}</h3>
              </Link>
              <h2 className="font-semibold truncate mb-2">{e.name.slice(0, 30)}...</h2>
              <div className="flex items-center justify-between mb-2">
                {e.discount_price && (
                  <span className="text-gray-400 line-through">${e.discount_price}</span>
                )}
                <span className="text-green-500 ml-4 font-bold">${e.price || 50}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">{e.total_sell} sold</span>
                <div className="flex space-x-2">
                  <FaHeart size={20} className="text-gray-400 hover:text-red-500 cursor-pointer" />
                  <FaEye size={20} className="text-gray-400 hover:text-blue-500 cursor-pointer" />
                  <FaShoppingCart size={20} className="text-gray-400 hover:text-green-500 cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;