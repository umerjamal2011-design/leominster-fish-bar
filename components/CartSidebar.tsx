import React, { useState, useMemo } from 'react';
import { CartItem, Customer, Order, OrderType, PaymentMethod } from '../types';
import { ICONS } from '../constants';

type PlaceOrderData = Omit<Order, 'id' | 'order_uid' | 'created_at' | 'items'> & { items: CartItem[] };

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (orderData: PlaceOrderData) => Promise<void>;
}

const CheckoutForm: React.FC<{onPlaceOrder: (customer: Customer, paymentMethod: PaymentMethod) => void, orderType: OrderType}> = ({ onPlaceOrder, orderType }) => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const customerDetails: Customer = {
            name: formData.get('name') as string,
            address: formData.get('address') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
        };
        onPlaceOrder(customerDetails, paymentMethod);
    };

    return (
        <form onSubmit={handleSubmit} className="text-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Details</h3>
            <div className="space-y-4">
                <input type="text" name="name" placeholder="Name" required className="w-full p-2 border rounded"/>
                <input type="text" name="address" placeholder="Address (for delivery)" required={orderType === 'delivery'} className="w-full p-2 border rounded"/>
                <input type="tel" name="phone" placeholder="Phone Number" required className="w-full p-2 border rounded"/>
                <input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded"/>
            </div>

            <h3 className="text-lg font-semibold my-4 text-gray-800">Payment Method</h3>
            <div className="flex space-x-4 mb-4">
                <label className="flex-1">
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="sr-only" />
                    <div className={`p-3 border rounded-lg text-center cursor-pointer ${paymentMethod === 'card' ? 'border-brand-red bg-red-50' : 'border-gray-300'}`}>Card</div>
                </label>
                <label className="flex-1">
                    <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="sr-only" />
                    <div className={`p-3 border rounded-lg text-center cursor-pointer ${paymentMethod === 'cash' ? 'border-brand-red bg-red-50' : 'border-gray-300'}`}>Cash</div>
                </label>
            </div>
            
            {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    {/* This is a dummy form for card details. In a real app, use a service like Stripe. */}
                    <input type="text" placeholder="Card Number" className="w-full p-2 border rounded"/>
                    <div className="flex space-x-3">
                        <input type="text" placeholder="MM / YY" className="w-1/2 p-2 border rounded"/>
                        <input type="text" placeholder="CVC" className="w-1/2 p-2 border rounded"/>
                    </div>
                </div>
            )}
            
            <button type="submit" className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Place Order & Pay
            </button>
        </form>
    );
};


const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onPlaceOrder }) => {
  const [orderType, setOrderType] = useState<OrderType>('collection');
  const [deliveryDistance, setDeliveryDistance] = useState(0); // in miles
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [cartItems]);
  
  const deliveryCharge = useMemo(() => {
    if (orderType === 'collection') return 0;
    if (deliveryDistance <= 1) return 0;
    if (deliveryDistance <= 5) return deliveryDistance - 1;
    return 4; // Max charge
  }, [orderType, deliveryDistance]);

  const hasFreeDrink = subtotal > 40;
  const total = subtotal + deliveryCharge;
  
  const isDeliveryDisabled = orderType === 'delivery' && subtotal < 17;

  const handleOrderPlaced = async (customer: Customer, paymentMethod: PaymentMethod) => {
    setIsPlacingOrder(true);
    const orderData: PlaceOrderData = {
      customer,
      items: cartItems,
      subtotal,
      delivery_charge: deliveryCharge,
      total,
      order_type: orderType,
      payment_method: paymentMethod,
      status: 'New',
    };
    
    await onPlaceOrder(orderData);
    
    setIsPlacingOrder(false);
    setCheckoutStep('success');
    setTimeout(() => {
        onClearCart();
        setCheckoutStep('cart');
        onClose();
    }, 5000);
  }

  const handleCloseAndReset = () => {
    onClose();
    // Add a small delay to allow the closing animation to finish before resetting state
    setTimeout(() => {
        setCheckoutStep('cart');
        setOrderType('collection');
    }, 300);
  }

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full text-gray-800">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
                {checkoutStep === 'form' ? 'Checkout' : 'Your Order'}
            </h2>
            <button onClick={handleCloseAndReset} className="p-2 text-gray-500 hover:text-gray-800">{ICONS.close}</button>
          </div>

          {cartItems.length === 0 && checkoutStep !== 'success' ? (
            <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                <img src="https://i.postimg.cc/8zDx45bf/empty-cart.png" alt="Empty cart" className="w-48 h-48 mb-4 opacity-50"/>
                <p className="text-gray-500 text-lg">Your cart is empty.</p>
                <button onClick={handleCloseAndReset} className="mt-4 bg-brand-red text-white font-bold py-2 px-6 rounded-lg hover:bg-red-800 transition-colors">Start Ordering</button>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4">
              {checkoutStep === 'success' ? (
                 <div className="flex flex-col justify-center items-center text-center h-full">
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h3>
                    <p className="text-gray-600">Thank you! Your order is being prepared.</p>
                    <p className="text-gray-600 mt-2">You will be redirected shortly.</p>
                </div>
              ) : checkoutStep === 'form' ? (
                <CheckoutForm onPlaceOrder={handleOrderPlaced} orderType={orderType} />
              ) : (
                <>
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between mb-4 border-b pb-4">
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{item.menuItem.name}</p>
                        {item.customizations.size && <p className="text-sm text-gray-500">Size: {item.customizations.size}</p>}
                        {item.customizations.stuffedCrust && <p className="text-sm text-gray-500">+ Stuffed Crust</p>}
                        {item.customizations.saltAndVinegar && <p className="text-sm text-gray-500">+ Salt & Vinegar</p>}
                        <p className="text-sm text-gray-500">£{item.unitPrice.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">{ICONS.minus}</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">{ICONS.plus}</button>
                        <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 p-1">{ICONS.trash}</button>
                      </div>
                    </div>
                  ))}
                  {hasFreeDrink && (
                    <div className="text-green-600 font-semibold bg-green-50 p-3 rounded-lg my-4">
                      🎉 Free large bottle of drink added to your order!
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {cartItems.length > 0 && checkoutStep === 'cart' && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-around mb-4">
                <button onClick={() => setOrderType('collection')} className={`px-4 py-2 rounded-lg font-semibold ${orderType === 'collection' ? 'bg-brand-red text-white' : 'bg-gray-200'}`}>Collection</button>
                <button onClick={() => setOrderType('delivery')} className={`px-4 py-2 rounded-lg font-semibold ${orderType === 'delivery' ? 'bg-brand-red text-white' : 'bg-gray-200'}`}>Delivery</button>
              </div>
              
              {orderType === 'delivery' && (
                <div className="my-4">
                  <label htmlFor="distance" className="block text-sm font-medium text-gray-700">Delivery Distance (miles)</label>
                  <select id="distance" value={deliveryDistance} onChange={(e) => setDeliveryDistance(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm rounded-md">
                    <option value="0">Select distance...</option>
                    <option value="1">Up to 1 mile (Free)</option>
                    <option value="2">2 miles (£1.00)</option>
                    <option value="3">3 miles (£2.00)</option>
                    <option value="4">4 miles (£3.00)</option>
                    <option value="5">5 miles (£4.00)</option>
                  </select>
                  {subtotal < 17 && <p className="text-red-600 text-sm mt-2">Minimum order for delivery is £17.00.</p>}
                </div>
              )}
              
              <div className="space-y-2 text-lg">
                <div className="flex justify-between"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>£{deliveryCharge.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-xl"><span>Total</span><span>£{total.toFixed(2)}</span></div>
              </div>

              <button 
                onClick={() => setCheckoutStep('form')} 
                disabled={isDeliveryDisabled || isPlacingOrder} 
                className="w-full mt-4 bg-brand-red text-white font-bold py-3 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isPlacingOrder ? 'Placing Order...' : 'Checkout'}
              </button>
            </div>
          )}
        </div>
      </div>
      {isOpen && <div onClick={handleCloseAndReset} className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}
    </>
  );
};

export default CartSidebar;
