

import React, { useState, useCallback, useEffect } from 'react';
import { View, CartItem, MenuItem, Order, Category } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ContactPage from './pages/ContactPage';
import CartSidebar from './components/CartSidebar';
import PizzaCustomizationModal from './components/PizzaCustomizationModal';
import LoadingScreen from './components/LoadingScreen';
import SearchOverlay from './components/SearchOverlay';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { supabase, areCredentialsPlaceholders } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

const RlsHelpScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg text-white p-8">
        <div className="text-center max-w-3xl">
            <h1 className="text-4xl font-bold mb-4 font-heading text-red-500">Database Permission Error</h1>
            <p className="text-xl mb-6 text-gray-300">
                The application connected to Supabase but was blocked from reading data. This is typically caused by missing Row Level Security (RLS) policies.
            </p>
            <div className="bg-gray-900 p-6 rounded-lg text-left">
                <h2 className="text-2xl font-semibold mb-4">Required Action: Enable Read Access</h2>
                <p className="mb-4 text-gray-400">
                    By default, new Supabase tables are protected and require you to create a "policy" to allow access.
                </p>
                <p className="mb-4">
                    Please go to your Supabase project's <strong className="text-yellow-400">SQL Editor</strong>, paste the following commands, and click "Run". This will safely allow your app to read the public menu, category, and settings data.
                </p>
                <pre className="bg-gray-800 p-4 rounded-md text-green-300 overflow-x-auto text-sm">
                    <code>
{`-- Enable read access for all users on the categories table
CREATE POLICY "Allow public read access to categories"
ON public.categories
FOR SELECT
USING (true);

-- Enable read access for all users on the menu_items table
CREATE POLICY "Allow public read access to menu items"
ON public.menu_items
FOR SELECT
USING (true);

-- Enable read access for all users on the settings table
CREATE POLICY "Allow public read access to settings"
ON public.settings
FOR SELECT
USING (true);`}
                    </code>
                </pre>
                <p className="mt-6 text-gray-400">
                    After running the SQL, <a href="#" onClick={() => window.location.reload()} className="text-green-400 hover:underline font-bold">refresh this page</a> to load the application.
                </p>
            </div>
        </div>
    </div>
);

const App: React.FC = () => {
    if (areCredentialsPlaceholders()) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg text-white p-8">
                <div className="text-center max-w-2xl">
                    <h1 className="text-4xl font-bold mb-4 font-heading">Welcome to Leominster Fish Bar Setup</h1>
                    <p className="text-xl mb-6 text-gray-300">Your application is almost ready. You just need to connect it to your Supabase backend.</p>
                    <div className="bg-gray-900 p-6 rounded-lg text-left">
                        <h2 className="text-2xl font-semibold mb-4">Configuration Steps:</h2>
                        <ol className="list-decimal list-inside space-y-4">
                            <li>
                                Go to your Supabase project dashboard. If you don't have one, create a new project at <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">supabase.com</a>.
                            </li>
                            <li>
                                In your Supabase project, go to <strong className="text-yellow-400">Project Settings &gt; API</strong>.
                            </li>
                            <li>
                                You will find your <strong className="text-yellow-400">Project URL</strong> and your <strong className="text-yellow-400">Project API key (anon public)</strong>.
                            </li>
                            <li>
                                Open the file <code className="bg-gray-700 p-1 rounded text-sm">supabaseClient.ts</code> in your editor.
                            </li>
                            <li>
                                Replace the placeholder values for <code className="bg-gray-700 p-1 rounded text-sm">supabaseUrl</code> and <code className="bg-gray-700 p-1 rounded text-sm">supabaseAnonKey</code> with the ones from your dashboard.
                            </li>
                        </ol>
                        <p className="mt-6 text-gray-400">Once you have updated the credentials, this message will disappear and your application will connect to your database.</p>
                    </div>
                </div>
            </div>
        );
    }

    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<any>(null);
    const [view, setView] = useState<View>('home');
    const [session, setSession] = useState<Session | null>(null);

    // App-wide dynamic data state
    const [menuData, setMenuData] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [contactInfo, setContactInfo] = useState({ address: '', phone: '', email: '' });
    const [openingHours, setOpeningHours] = useState({});
    const [orders, setOrders] = useState<Order[]>([]);

    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [customizingPizza, setCustomizingPizza] = useState<MenuItem | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // --- Supabase Data Fetching ---
    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const { data: categoriesData, error: catError } = await supabase.from('categories').select('*');
            if (catError) throw catError;
            setCategories(categoriesData || []);

            const { data: menuData, error: menuError } = await supabase.from('menu_items').select('*');
            if (menuError) throw menuError;
            
            // Join category name to menu item for easier display
            const menuWithCategories = menuData?.map(item => ({
                ...item,
                category: categoriesData?.find(c => c.id === item.category_id)
            })) || [];

            setMenuData(menuWithCategories as MenuItem[]);

            const { data: settingsData, error: settingsError } = await supabase.from('settings').select('*').eq('id', 1).single();
            if (settingsError) throw settingsError;

            if (settingsData) {
                setContactInfo(settingsData.contact_info);
                setOpeningHours(settingsData.opening_hours);
            } else {
                // If settings are not found, it's a critical setup error.
                throw new Error("Settings not found in the database. Please ensure the initial data script has been run.");
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
            setFetchError(error);
        } finally {
            setTimeout(() => setIsLoading(false), 500);
        }
    }, []);

    // Auth listener and data fetching setup
    useEffect(() => {
        fetchInitialData();
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            // This handles navigation after login/logout events.
            // Using the callback form of setView ensures we have the latest view state.
            setView(currentView => {
                if (session && currentView === 'admin-login') {
                    return 'admin'; // User just logged in, navigate to dashboard
                }
                if (!session && currentView === 'admin') {
                    return 'home'; // User just logged out from dashboard, navigate to home
                }
                return currentView; // No change needed
            });
        });

        return () => subscription.unsubscribe();
    }, [fetchInitialData]);
    
    // Fetch orders if authenticated
    const fetchOrders = useCallback(async () => {
        if (!session) return;
        try {
            const { data, error } = await supabase.from('orders').select('*, customer:customers(*)').order('created_at', { ascending: false });
            if (error) throw error;
            // A real app would fetch order_items as well and join them.
            // For simplicity, we'll handle that on a per-order basis if needed.
            setOrders(data as any || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }, [session]);
    
    useEffect(() => {
        fetchOrders();
    }, [session, fetchOrders]);

    useEffect(() => {
        if (!session) {
            return;
        }

        // Subscribe to realtime changes so every admin session sees new/updated orders instantly.
        const channel = supabase
            .channel('orders-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session, fetchOrders]);

    // Polling fallback: fetch orders every X seconds when realtime isn't available or as a backup.
    useEffect(() => {
        if (!session) return;
        const POLL_INTERVAL_MS = 8000; // 8 seconds
        const id = setInterval(() => {
            fetchOrders();
        }, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, [session, fetchOrders]);


    const handleAddToCart = useCallback((itemToAdd: CartItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === itemToAdd.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === itemToAdd.id ? { ...item, quantity: item.quantity + itemToAdd.quantity } : item
                );
            }
            return [...prevCart, itemToAdd];
        });
        setIsCartOpen(true);
    }, []);

    const handleUpdateQuantity = useCallback((cartItemId: string, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.id !== cartItemId);
            }
            return prevCart.map(item => item.id === cartItemId ? { ...item, quantity: newQuantity } : item);
        });
    }, []);

    const handleRemoveFromCart = useCallback((cartItemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
    }, []);
    
    const handleClearCart = useCallback(() => { setCart([]); }, []);

    const handlePizzaCustomize = (menuItem: MenuItem) => { setCustomizingPizza(menuItem); };

    const handleSearchSubmit = () => {
        setView('menu');
        setIsSearchOpen(false);
    };
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        // The onAuthStateChange listener will handle navigation.
    };
    
    const handlePlaceOrder = async (
        orderData: Omit<Order, 'id' | 'order_uid' | 'created_at' | 'items'> & { items: CartItem[] }
    ): Promise<{ ok: boolean; message?: string }> => {
        try {
            // 1. Find or create customer
            let customerId: number | undefined;
            const { data: existingCustomer, error: existingCustomerError } = await supabase
                .from('customers')
                .select('id')
                .eq('email', orderData.customer.email)
                .maybeSingle();

            if (existingCustomerError) {
                console.error('Error looking up customer', existingCustomerError);
                return { ok: false, message: 'Unable to verify your customer details. Please try again.' };
            }

            if (existingCustomer?.id) {
                customerId = existingCustomer.id;
            } else {
                const { data: newCustomer, error: customerError } = await supabase
                    .from('customers')
                    .insert(orderData.customer)
                    .select('id')
                    .single();

                if (customerError || !newCustomer) {
                    console.error('Error creating customer', customerError);
                    return {
                        ok: false,
                        message: customerError?.message || 'We could not create your customer record. Please try again.',
                    };
                }

                customerId = newCustomer.id;
            }

            if (!customerId) {
                return { ok: false, message: 'Customer information is missing. Please try again.' };
            }

            // 2. Create the order
            const { data: newOrder, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_id: customerId,
                    subtotal: orderData.subtotal,
                    delivery_charge: orderData.delivery_charge,
                    total: orderData.total,
                    order_type: orderData.order_type,
                    payment_method: orderData.payment_method,
                    status: 'New',
                })
                .select()
                .single();

            if (orderError || !newOrder) {
                console.error('Error creating order', orderError);
                return {
                    ok: false,
                    message: orderError?.message || 'Unable to create your order. Please try again.',
                };
            }

            // 3. Create the order items
            const orderItems = orderData.items.map(cartItem => ({
                order_id: newOrder.id,
                menu_item_id: cartItem.menuItem.id,
                menu_item_name: cartItem.menuItem.name,
                quantity: cartItem.quantity,
                unit_price: cartItem.unitPrice,
                customizations: cartItem.customizations,
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

            if (itemsError) {
                console.error('Error creating order items', itemsError);
                await supabase.from('orders').delete().eq('id', newOrder.id);
                return {
                    ok: false,
                    message: itemsError.message || 'Unable to save the items in your order. Please try again.',
                };
            }
            
            // Refresh orders list for admin
            await fetchOrders();

            return { ok: true };
        } catch (error: any) {
            console.error('Unexpected error placing order', error);
            return {
                ok: false,
                message: error?.message || 'Something went wrong while placing your order. Please try again.',
            };
        }
    };


    const handleSetView = (newView: View) => {
        if (newView === 'admin' && !session) {
            setView('admin-login');
            return;
        }
        if (newView !== 'menu') {
            setSearchQuery('');
        }
        window.scrollTo(0, 0);
        setView(newView);
    };

    const renderView = () => {
        switch (view) {
            case 'admin-login':
                return <AdminLoginPage />;
            case 'admin':
                if (session) {
                    return <AdminDashboardPage 
                        onLogout={handleLogout}
                        orders={orders}
                        fetchOrders={fetchOrders}
                        menuData={menuData}
                        setMenuData={setMenuData}
                        categories={categories}
                        fetchInitialData={fetchInitialData}
                        contactInfo={contactInfo}
                        setContactInfo={setContactInfo}
                        openingHours={openingHours}
                        setOpeningHours={setOpeningHours}
                    />;
                }
                // If somehow we are on 'admin' view without a session, show login
                return <AdminLoginPage />;
            case 'menu':
                return <MenuPage 
                    menuData={menuData} 
                    categories={categories} 
                    onAddToCart={handleAddToCart}
                    onCustomizePizza={handlePizzaCustomize}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />;
            case 'contact':
                return <ContactPage contactInfo={contactInfo} />;
            case 'home':
            default:
                return <HomePage setView={handleSetView} menuData={menuData} categories={categories} />;
        }
    };
    
    if (fetchError) {
        // This regex checks for a specific Supabase error code related to RLS
        if (/PGRST 203/i.test(fetchError.message)) {
             return <RlsHelpScreen />;
        }
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg text-white p-8">
                <h1 className="text-3xl font-bold text-red-500">Error Loading Data</h1>
                <p className="text-lg mt-4">{fetchError.message}</p>
                <p className="text-gray-400 mt-2">Could not connect to the database. Please check your Supabase credentials and network connection.</p>
            </div>
        );
    }

    return (
        <div className="bg-dark-bg text-white min-h-screen font-sans">
            <LoadingScreen isLoading={isLoading} />
            <Header 
                setView={handleSetView} 
                toggleCart={() => setIsCartOpen(!isCartOpen)} 
                cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                currentView={view}
                toggleSearch={() => setIsSearchOpen(!isSearchOpen)}
            />
            <main>
                {renderView()}
            </main>
            <Footer 
                contactInfo={contactInfo} 
                openingHours={openingHours}
                setView={handleSetView}
            />
            <CartSidebar 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onClearCart={handleClearCart}
                onPlaceOrder={handlePlaceOrder}
            />
            {customizingPizza && (
                <PizzaCustomizationModal 
                    pizza={customizingPizza}
                    onClose={() => setCustomizingPizza(null)}
                    onAddToCart={handleAddToCart}
                />
            )}
            <SearchOverlay 
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
            />
        </div>
    );
};

export default App;
