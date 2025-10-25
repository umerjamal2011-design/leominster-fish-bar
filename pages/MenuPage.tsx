import React, { useMemo } from 'react';
import { ICONS } from '../constants';
import { Category, CartItem, MenuItem } from '../types';
import MenuItemCard from '../components/MenuItemCard';

interface MenuPageProps {
  menuData: MenuItem[];
  categories: Category[];
  onAddToCart: (item: CartItem) => void;
  onCustomizePizza: (item: MenuItem) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ menuData, categories, onAddToCart, onCustomizePizza, searchQuery, setSearchQuery }) => {
  const filteredMenu = useMemo(() => {
    if (!searchQuery) {
        return menuData;
    }
    const lowercasedQuery = searchQuery.toLowerCase().trim();
    if (!lowercasedQuery) return menuData;
    
    return menuData.filter(item => 
        item.name.toLowerCase().includes(lowercasedQuery) ||
        (item.description && item.description.toLowerCase().includes(lowercasedQuery))
    );
  }, [searchQuery, menuData]);

  const groupedMenu = filteredMenu.reduce((acc, item) => {
    const categoryName = item.category?.name || 'Uncategorized';
    (acc[categoryName] = acc[categoryName] || []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categoryOrder: string[] = [
    "SPECIALS",
    "KEBABS",
    "Fish and Chips",
    "Pizzas",
    "Pizza Meal Deals",
    "Burgers",
    "One-Stop Chicken Shop",
    "Pies & Pasties",
    "Kids Menu",
    "EXTRAS",
    "SAUCES",
    "DRINKS",
  ];

  const orderedGroupedMenu = Object.entries(groupedMenu).sort(([catA], [catB]) => {
      const indexA = categoryOrder.indexOf(catA);
      const indexB = categoryOrder.indexOf(catB);
      if (indexA === -1) return 1; // Put new categories at the end
      if (indexB === -1) return -1;
      return indexA - indexB;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-40">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-12 font-heading">Our Menu</h1>
      
      {searchQuery && (
        <div className="mb-10 text-center bg-gray-900 p-4 rounded-lg">
          <p className="text-xl text-gray-300">
            Showing results for: <strong className="text-white">"{searchQuery}"</strong>
          </p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-2 inline-flex items-center text-brand-red hover:text-red-400 transition-colors"
          >
            {React.cloneElement(ICONS.close, { className: 'h-5 w-5 mr-1' })}
            Clear Search
          </button>
        </div>
      )}

      {orderedGroupedMenu.length > 0 ? (
        orderedGroupedMenu.map(([category, items]) => (
          <div key={category} className="mb-16">
            <h2 className="text-3xl font-bold text-white border-b-4 border-gray-700 pb-2 mb-8 font-heading">{category}</h2>
            
            {category === "KEBABS" && (
               <p className="text-center -mt-4 mb-8 text-lg text-gray-300 bg-gray-800 p-4 rounded-lg">
                  We offer Mediterranean Chicken and Lamb Doner. All served with salad and cold sauce.
               </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {(items as MenuItem[]).map(item => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={onAddToCart}
                  onCustomizePizza={onCustomizePizza}
                />
              ))}
            </div>
            {category === "Pizzas" && (
              <p className="text-center mt-8 text-lg text-gray-300 bg-gray-800 p-4 rounded-lg">
                <strong>£3.00 extra for stuffed crust</strong> available on all pizzas!
              </p>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-white mb-4 font-heading">No Results Found</h2>
            <p className="text-gray-400 text-lg">
                We couldn't find any items matching your search for "{searchQuery}".
            </p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
