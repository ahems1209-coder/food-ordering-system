import React from 'react';

const FoodCard = ({ food, addToCart }) => {
  return (
    <div className="group bg-white rounded-[2rem] p-3 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 overflow-hidden">
      
      {/* Image Section */}
      <div className="relative h-52 w-full overflow-hidden rounded-[1.5rem]">
        <img
          src={food.image || "https://via.placeholder.com/400x250"}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Veg/Non-Veg Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
          <div className={`h-2 w-2 rounded-full ${food.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
            {food.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-3 py-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className={`text-lg font-extrabold transition-colors ${food.isAvailable === false ? 'text-gray-400' : 'text-gray-800 group-hover:text-orange-500'}`}>
            {food.name}
          </h3>
          <span className={`text-xl font-black ${food.isAvailable === false ? 'text-gray-400' : 'text-gray-900'}`}>₹{food.price}</span>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-5 min-h-[32px]">
          {food.description}
        </p>

        {food.isAvailable === false ? (
          <div className="w-full bg-red-50 text-red-500 font-bold py-3 rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-sm uppercase tracking-wider">Out of Stock</span>
          </div>
        ) : (
          <button onClick={() => addToCart(food)} className="w-full bg-gray-100 text-gray-900 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 active:scale-95 shadow-sm">
            <span className="text-sm uppercase tracking-wider">Add to Cart</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodCard;