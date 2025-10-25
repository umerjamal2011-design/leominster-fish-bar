import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { MenuItem, CartItem, PizzaPrice } from '../types';

interface PizzaCustomizationModalProps {
  pizza: MenuItem;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const PizzaCustomizationModal: React.FC<PizzaCustomizationModalProps> = ({ pizza, onClose, onAddToCart }) => {
  const [size, setSize] = useState<'10"' | '12"' | '14"'>('10"');
  const [stuffedCrust, setStuffedCrust] = useState(false);

  const prices = pizza.pizza_prices as PizzaPrice;
  if (!prices) {
    // This should not happen if the component is used correctly
    return null; 
  }


  const currentPrice = useMemo(() => {
    let price = prices[size];
    if (stuffedCrust) {
      price += 3.00;
    }
    return price;
  }, [size, stuffedCrust, prices]);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${pizza.id}-${size}-${stuffedCrust}`,
      menuItem: pizza,
      quantity: 1,
      unitPrice: currentPrice,
      customizations: {
        size,
        stuffedCrust,
      },
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Customize ${pizza.name}`}>
      <div className="space-y-6 text-gray-800">
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Size</h4>
          <div className="flex space-x-2">
            {(Object.keys(prices) as Array<keyof PizzaPrice>).map(s => (
              <button 
                key={s} 
                onClick={() => setSize(s)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${size === s ? 'bg-brand-red text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {s} - £{prices[s].toFixed(2)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="flex items-center text-lg text-gray-700 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <input 
              type="checkbox"
              checked={stuffedCrust}
              onChange={(e) => setStuffedCrust(e.target.checked)}
              className="h-5 w-5 text-brand-red border-gray-300 rounded focus:ring-brand-red"
            />
            <span className="ml-3 font-semibold">Add Stuffed Crust</span>
            <span className="ml-auto font-bold text-brand-red">+£3.00</span>
          </label>
        </div>
        <div className="pt-6 border-t">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-800">Total: £{currentPrice.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              className="bg-brand-red text-white font-bold py-3 px-6 rounded-lg hover:bg-red-800 transition-colors duration-200 text-lg"
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PizzaCustomizationModal;
