import React, { useState } from 'react';
import { MenuItem, CartItem, PizzaPrice, Category } from '../types';

interface MenuItemCardProps {
    item: MenuItem;
    onAddToCart: (item: CartItem) => void;
    onCustomizePizza: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart, onCustomizePizza }) => {
    const [saltAndVinegar, setSaltAndVinegar] = useState(false);

    const handleSimpleAddToCart = () => {
        if (typeof item.price !== 'number') return;
        
        onAddToCart({
            id: `${item.id}-${saltAndVinegar}`,
            menuItem: item,
            quantity: 1,
            unitPrice: item.price,
            customizations: { saltAndVinegar },
        });
    };

    const isPizza = item.category?.name === 'Pizzas';
    const canHaveSaltAndVinegar = item.category?.name === 'Fish and Chips';

    const renderPrice = () => {
        if (typeof item.price === 'number') {
            return `£${item.price.toFixed(2)}`;
        }
        if (item.pizza_prices) {
            const prices = item.pizza_prices as PizzaPrice;
            return `From £${prices['10"'].toFixed(2)}`;
        }
        return 'N/A';
    };

    return (
        <div className="bg-white rounded-lg text-gray-800 shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105">
            <img className="w-full h-48 object-cover" src={item.image_url} alt={item.name} />
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                {item.description && <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>}
                <div className="mt-auto">
                    {canHaveSaltAndVinegar && (
                         <div className="my-4">
                             <label className="flex items-center text-gray-700">
                                 <input 
                                     type="checkbox" 
                                     checked={saltAndVinegar}
                                     onChange={(e) => setSaltAndVinegar(e.target.checked)}
                                     className="h-4 w-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                                 />
                                 <span className="ml-2">Add Salt & Vinegar?</span>
                             </label>
                         </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-900">{renderPrice()}</span>
                        <button 
                            onClick={isPizza ? () => onCustomizePizza(item) : handleSimpleAddToCart} 
                            className="bg-brand-red text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200"
                        >
                            {isPizza ? 'Customize' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
