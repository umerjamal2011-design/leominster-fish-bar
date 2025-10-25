import React, { useState, useMemo } from 'react';
import { AdminView, Order, OrderStatus, MenuItem, Category, PizzaPrice } from '../types';
import Modal from '../components/Modal';
import { supabase } from '../supabaseClient';

// PROPS for the main dashboard component
interface AdminDashboardPageProps {
  onLogout: () => void;
  orders: Order[];
  fetchOrders: () => void;
  menuData: MenuItem[];
  setMenuData: React.Dispatch<React.SetStateAction<MenuItem[]>>; // For optimistic updates
  categories: Category[];
  fetchInitialData: () => void; // To refresh everything
  contactInfo: { address: string; phone: string; email: string; };
  setContactInfo: React.Dispatch<React.SetStateAction<{ address: string; phone: string; email: string; }>>;
  openingHours: { [key: string]: string; };
  setOpeningHours: React.Dispatch<React.SetStateAction<{ [key: string]: string; }>>;
}

// #region --- ORDER MANAGER ---
const OrderManager: React.FC<{ orders: Order[], fetchOrders: () => void }> = ({ orders, fetchOrders }) => {
    const updateStatus = async (orderId: number, status: OrderStatus) => {
        const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
        if (error) {
            console.error("Error updating status:", error);
            alert("Could not update order status.");
        } else {
            fetchOrders(); // Re-fetch to confirm change
        }
    };
    
    const statusColors: Record<OrderStatus, string> = {
        'New': 'bg-blue-500',
        'Preparing': 'bg-yellow-500',
        'Ready for Collection': 'bg-green-500',
        'Out for Delivery': 'bg-green-500',
        'Completed': 'bg-gray-500',
        'Cancelled': 'bg-red-500',
    };

    return <div className="space-y-4">
        {orders.map(order => (
            <div key={order.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg">{order.customer.name} - #{order.order_uid.substring(0, 8)}</p>
                        <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-2xl">£{order.total.toFixed(2)}</p>
                        <p className={`text-xs px-2 py-1 rounded-full text-white inline-block mt-1 ${statusColors[order.status]}`}>{order.status}</p>
                    </div>
                </div>
                <div className="mt-4 border-t border-gray-700 pt-4">
                    <p className="font-semibold">{order.order_type.toUpperCase()} | {order.payment_method.toUpperCase()}</p>
                     {/* In a real app, you'd fetch and display order_items here */}
                     <div className="mt-4">
                        <select 
                            value={order.status} 
                            onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                            className="w-full bg-gray-700 p-2 rounded"
                        >
                            <option>New</option>
                            <option>Preparing</option>
                            <option>Ready for Collection</option>
                            <option>Out for Delivery</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>
        ))}
    </div>;
};

// #endregion

// #region --- MENU MANAGER ---

const MenuItemFormModal: React.FC<{
    item: Partial<MenuItem> | null, 
    onClose: () => void, 
    onSave: (item: Partial<MenuItem>) => void,
    categories: Category[],
}> = ({ item, onClose, onSave, categories }) => {
    const [formData, setFormData] = useState<Partial<MenuItem>>(
        item || { name: '', price: 0, category_id: categories[0]?.id || 0, image_url: '', pizza_prices: null }
    );
    const categoryDetails = useMemo(() => categories.find(c => c.id === formData.category_id), [formData.category_id, categories]);
    const isPizza = categoryDetails?.name === "Pizzas";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'category_id' ? parseInt(value, 10) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };
    
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);
        if (isPizza) {
            const priceObj = (formData.pizza_prices as PizzaPrice) || { '10"': 0, '12"': 0, '14"': 0 };
            setFormData(prev => ({ ...prev, pizza_prices: { ...priceObj, [name]: numValue }, price: null }));
        } else {
            setFormData(prev => ({ ...prev, price: numValue, pizza_prices: null }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return <Modal isOpen={true} onClose={onClose} title={item?.id ? 'Edit Menu Item' : 'Add Menu Item'}>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded" />
            <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
            <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-2 border rounded">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Image URL" required className="w-full p-2 border rounded" />
            
            {isPizza ? (
                <div className="grid grid-cols-3 gap-2">
                    <input type="number" step="0.01" name="10&quot;" value={(formData.pizza_prices as PizzaPrice)?.['10"'] || ''} onChange={handlePriceChange} placeholder="10&quot; Price" className="w-full p-2 border rounded" />
                    <input type="number" step="0.01" name="12&quot;" value={(formData.pizza_prices as PizzaPrice)?.['12"'] || ''} onChange={handlePriceChange} placeholder="12&quot; Price" className="w-full p-2 border rounded" />
                    <input type="number" step="0.01" name="14&quot;" value={(formData.pizza_prices as PizzaPrice)?.['14"'] || ''} onChange={handlePriceChange} placeholder="14&quot; Price" className="w-full p-2 border rounded" />
                </div>
            ) : (
                <input type="number" step="0.01" name="price" value={typeof formData.price === 'number' ? formData.price : ''} onChange={handlePriceChange} placeholder="Price" className="w-full p-2 border rounded" />
            )}
            
            <button type="submit" className="w-full bg-brand-red text-white py-2 rounded">Save</button>
        </form>
    </Modal>;
}


const MenuManager: React.FC<{ 
    menuData: MenuItem[], 
    categories: Category[],
    fetchInitialData: () => void
}> = ({ menuData, categories, fetchInitialData }) => {
    const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const handleSaveItem = async (itemToSave: Partial<MenuItem>) => {
        // Remove client-side joined 'category' property before upserting
        const { category, ...dbItem } = itemToSave;

        const { error } = await supabase.from('menu_items').upsert(dbItem);
        if (error) {
            alert('Error saving item: ' + error.message);
        } else {
            fetchInitialData(); // Refresh all data
        }
        setEditingItem(null);
        setIsAdding(false);
    };

    const handleDeleteItem = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const { error } = await supabase.from('menu_items').delete().eq('id', id);
            if (error) {
                alert('Error deleting item: ' + error.message);
            } else {
                fetchInitialData();
            }
        }
    };
    
    const handleAddCategory = async () => {
        const trimmedCategory = newCategory.trim();
        if (trimmedCategory === '') return;
        if (categories.some(c => c.name.toLowerCase() === trimmedCategory.toLowerCase())) {
            alert('Category already exists.');
            return;
        }
        
        const { error } = await supabase.from('categories').insert({ name: trimmedCategory });
        if (error) {
            alert('Error adding category: ' + error.message);
        } else {
            setNewCategory('');
            fetchInitialData();
        }
    };
    
    const handleDeleteCategory = async (categoryToDelete: Category) => {
        const isCategoryInUse = menuData.some(item => item.category_id === categoryToDelete.id);
        if (isCategoryInUse) {
            alert('Cannot delete category as it is currently in use. Please move or delete menu items from this category first.');
            return;
        }
        if (window.confirm(`Are you sure you want to delete the category "${categoryToDelete.name}"?`)) {
            const { error } = await supabase.from('categories').delete().eq('id', categoryToDelete.id);
            if(error) {
                alert('Error deleting category: ' + error.message);
            } else {
                fetchInitialData();
            }
        }
    };

    const groupedMenu = useMemo(() => menuData.reduce((acc, item) => {
        const catName = item.category?.name || 'Uncategorized';
        (acc[catName] = acc[catName] || []).push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>), [menuData]);


    return <div>
        {(isAdding || editingItem) && <MenuItemFormModal item={editingItem} onClose={() => { setEditingItem(null); setIsAdding(false); }} onSave={handleSaveItem} categories={categories} />}
        
        <div className="bg-gray-900 p-4 rounded-lg mb-8">
            <h3 className="text-2xl font-bold mb-4">Manage Categories</h3>
            <div className="mb-4 max-h-48 overflow-y-auto pr-2">
                {categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between bg-gray-800 p-2 rounded mb-2">
                        <span>{cat.name}</span>
                        <button onClick={() => handleDeleteCategory(cat)} className="text-red-500 hover:text-red-400 font-bold px-2">Delete</button>
                    </div>
                ))}
            </div>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-grow bg-gray-700 p-2 rounded"
                />
                <button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</button>
            </div>
        </div>

        <div className="text-right mb-4">
            <button onClick={() => setIsAdding(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add New Item</button>
        </div>

        {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category} className="mb-8">
                <h3 className="text-2xl font-bold mb-4">{category}</h3>
                <div className="space-y-2">
                    {(items as MenuItem[]).map(item => (
                        <div key={item.id} className="bg-gray-800 p-3 rounded flex justify-between items-center">
                            <span>{item.name}</span>
                            <div>
                                <button onClick={() => setEditingItem(item)} className="bg-blue-600 text-white py-1 px-3 rounded mr-2">Edit</button>
                                <button onClick={() => handleDeleteItem(item.id)} className="bg-red-600 text-white py-1 px-3 rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>;
};
// #endregion

// #region --- SETTINGS MANAGER ---
const SettingsManager: React.FC<Pick<AdminDashboardPageProps, 'contactInfo' | 'setContactInfo' | 'openingHours' | 'setOpeningHours'>> = 
({ contactInfo, setContactInfo, openingHours, setOpeningHours }) => {
    
    const [isSaving, setIsSaving] = useState(false);

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContactInfo(prev => ({...prev, [e.target.name]: e.target.value}));
    };
    
    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpeningHours(prev => ({...prev, [e.target.name]: e.target.value}));
    };
    
    const handleSaveSettings = async () => {
        setIsSaving(true);
        const { error } = await supabase.from('settings').update({
            contact_info: contactInfo,
            opening_hours: openingHours,
            updated_at: new Date().toISOString()
        }).eq('id', 1);

        if (error) {
            alert("Error saving settings: " + error.message);
        } else {
            alert("Settings saved successfully!");
        }
        setIsSaving(false);
    };

    return <div>
        <div className="bg-gray-800 p-4 rounded-lg mb-8">
            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
            <div className="space-y-3">
                <input name="address" value={contactInfo.address} onChange={handleContactChange} className="w-full bg-gray-700 p-2 rounded" />
                <input name="phone" value={contactInfo.phone} onChange={handleContactChange} className="w-full bg-gray-700 p-2 rounded" />
                <input name="email" value={contactInfo.email} onChange={handleContactChange} className="w-full bg-gray-700 p-2 rounded" />
            </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Opening Hours</h3>
            <div className="space-y-3">
                {Object.entries(openingHours).map(([day, hours]) => (
                    <div key={day} className="grid grid-cols-3 items-center gap-2">
                         <span className="text-gray-300 col-span-1">{day}</span>
                         <input name={day} value={hours} onChange={handleHoursChange} className="w-full bg-gray-700 p-2 rounded col-span-2" />
                    </div>
                ))}
            </div>
        </div>
        <div className="mt-8 text-right">
            <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:bg-gray-500"
            >
                {isSaving ? 'Saving...' : 'Save All Settings'}
            </button>
        </div>
    </div>;
};
// #endregion

// #region --- MAIN DASHBOARD COMPONENT ---
const AdminDashboardPage: React.FC<AdminDashboardPageProps> = (props) => {
  const [view, setView] = useState<AdminView>('orders');

  const renderCurrentView = () => {
    switch (view) {
      case 'orders':
        return <OrderManager orders={props.orders} fetchOrders={props.fetchOrders} />;
      case 'menu':
        return <MenuManager 
            menuData={props.menuData} 
            categories={props.categories}
            fetchInitialData={props.fetchInitialData}
        />;
      case 'settings':
        return <SettingsManager {...props} />;
      default:
        return null;
    }
  };

  const navButtonClasses = (buttonView: AdminView) => 
    `px-4 py-2 rounded-lg font-semibold transition-colors ${view === buttonView ? 'bg-brand-red text-white' : 'bg-gray-700 hover:bg-gray-600'}`;

  return (
    <div className="min-h-screen bg-dark-bg text-white p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-heading">Admin Dashboard</h1>
        <button onClick={props.onLogout} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Logout</button>
      </header>

      <nav className="flex space-x-2 sm:space-x-4 mb-8 pb-4 border-b border-gray-700">
        <button onClick={() => setView('orders')} className={navButtonClasses('orders')}>Orders ({props.orders.filter(o => o.status === 'New').length})</button>
        <button onClick={() => setView('menu')} className={navButtonClasses('menu')}>Menu</button>
        <button onClick={() => setView('settings')} className={navButtonClasses('settings')}>Settings</button>
      </nav>

      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
