import React, { useRef, useState, MouseEvent, useEffect } from 'react';
import { View, Category, MenuItem } from '../types';
import { ICONS } from '../constants';

interface HomePageProps {
    setView: (view: View) => void;
    menuData: MenuItem[];
    categories: Category[];
}

const HomePage: React.FC<HomePageProps> = ({ setView, menuData, categories }) => {
    // Define a preferred order for categories
    const categoryOrderPreference: string[] = [
        "SPECIALS",
        "KEBABS",
        "Fish and Chips",
        "Pizzas",
        "Burgers",
        "One-Stop Chicken Shop",
        "Pies & Pasties",
        "Kids Menu",
        "EXTRAS",
        "SAUCES",
        "DRINKS",
        "Pizza Meal Deals",
    ];

    const allCategoriesFromData = [...new Set(menuData.map(item => item.category?.name))].filter(Boolean) as string[];

    const displayedCategories = categoryOrderPreference
        .filter(catName => allCategoriesFromData.includes(catName))
        .concat(allCategoriesFromData.filter(catName => !categoryOrderPreference.includes(catName)));


    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [visibleCategories, setVisibleCategories] = useState<string[]>([]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const viewport = container.parentElement;
        if (!viewport) return;

        const debounce = <F extends (...args: any[]) => any>(func: F, wait: number): ((...args: Parameters<F>) => void) => {
            let timeout: ReturnType<typeof setTimeout> | null = null;
            return (...args: Parameters<F>): void => {
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(() => func(...args), wait);
            };
        };

        const checkVisibleItems = () => {
            const viewportRect = viewport.getBoundingClientRect();
            const newVisibleCategories: string[] = [];

            Array.from(container.children).forEach((child, index) => {
                const item = child as HTMLElement;
                const itemRect = item.getBoundingClientRect();

                if (itemRect.left >= viewportRect.left - 1 && itemRect.right <= viewportRect.right + 1) {
                    newVisibleCategories.push(displayedCategories[index]);
                }
            });
            
            setVisibleCategories(currentVisible => {
                if (currentVisible.length === newVisibleCategories.length && currentVisible.every((val, i) => val === newVisibleCategories[i])) {
                    return currentVisible;
                }
                return newVisibleCategories;
            });
        };

        const debouncedHandler = debounce(checkVisibleItems, 50);

        container.addEventListener('scroll', debouncedHandler, { passive: true });
        window.addEventListener('resize', debouncedHandler, { passive: true });

        setTimeout(checkVisibleItems, 100);

        return () => {
            container.removeEventListener('scroll', debouncedHandler);
            window.removeEventListener('resize', debouncedHandler);
        };
    }, [displayedCategories]);


    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current && scrollContainerRef.current.children.length > 1) {
            const firstItem = scrollContainerRef.current.children[0] as HTMLElement;
            const secondItem = scrollContainerRef.current.children[1] as HTMLElement;
            const scrollAmount = secondItem.offsetLeft - firstItem.offsetLeft;

            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="text-white">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center h-screen flex flex-col justify-center items-start text-white"
                style={{ backgroundImage: "url('https://i.postimg.cc/fbzDYJy0/nollgo-Gemini-Generated-Image-z95ektz95ektz95e-1.jpg')" }}
            >
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-2xl">
                        <h1 
                            className="text-6xl md:text-8xl font-heading font-bold uppercase tracking-wider leading-tight"
                            style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}
                        >
                            Traditional <br /> Fish & Chips
                        </h1>
                        <button 
                            onClick={() => setView('menu')} 
                            className="mt-8 bg-brand-red hover:bg-red-800 text-white font-bold py-3 px-8 text-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                        >
                            Shop all
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="py-16 bg-dark-bg">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto text-white">
                        <h2 className="font-heading font-bold text-4xl xl:text-5xl">
                            <span className="font-script text-brand-red block text-5xl xl:text-6xl mb-2">Welcome to</span>
                            Leominster Fish Bar
                        </h2>
                        <div className="text-gray-300 text-lg mt-6 max-w-3xl mx-auto text-left space-y-6 leading-relaxed">
                            <p>
                                We serve the finest traditional British fish and chips with a modern twist. Located in the heart of Leominster, our cozy shop offers a warm and inviting atmosphere perfect for family meals and quick bites alike.
                            </p>
                            <blockquote className="text-white font-semibold border-l-4 border-brand-red pl-6 py-2 my-4 text-xl italic">
                                We make our fresh pizza dough in our own kitchen on a daily basis for our delicious fresh base pizzas.
                            </blockquote>
                            <p>
                                We pride ourselves on using sustainably sourced fish, hand-cut potatoes, and homemade batter for that authentic, crispy taste. Beyond the classic fish and chips, our menu also features a variety of delicacies, savory pies, and seasonal specials.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Browse Our Menu Section */}
            <section 
                className="py-20 bg-cover bg-center"
                style={{ backgroundImage: "url('https://i.postimg.cc/QtzFHP87/102.png')" }}
            >
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-heading font-bold text-4xl xl:text-5xl uppercase">
                            Browse Our Menu
                        </h2>
                    </div>
                    <div className="relative group">
                         <button 
                            onClick={() => scroll('left')}
                            className="absolute top-1/2 -left-4 md:-left-10 -translate-y-1/2 z-20 bg-black bg-opacity-40 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0"
                            aria-label="Scroll left"
                        >
                            {ICONS.chevronLeft}
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="absolute top-1/2 -right-4 md:-right-10 -translate-y-1/2 z-20 bg-black bg-opacity-40 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0"
                            aria-label="Scroll right"
                        >
                           {ICONS.chevronRight}
                        </button>
                        <div
                            ref={scrollContainerRef}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                            className="flex space-x-6 overflow-x-auto pb-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing px-[calc(50%-8rem)] md:px-[calc(50%-9rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {displayedCategories.map(category => (
                                <CategoryImage key={category} category={category} setView={setView} isCenter={visibleCategories.includes(category)} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const CategoryImage: React.FC<{ category: string; setView: (view: View) => void; isCenter: boolean }> = ({ category, setView, isCenter }) => {
    const categoryInfo: { [key: string]: { img: string; } } = {
        "SPECIALS": { img: 'https://i.postimg.cc/MG6hwjqB/resized-sfc-deal.png' },
        "KEBABS": { img: 'https://i.postimg.cc/CL9ybtF7/Gemini-Generated-Image-zdjbjvzdjbjvzdjb.png' },
        "Fish and Chips": { img: 'https://i.postimg.cc/N0cR2gSx/fish-and-chips.png' },
        "Pizzas": { img: 'https://i.postimg.cc/ZRFZHhbb/pizza.png' },
        "Burgers": { img: 'https://i.postimg.cc/pLmmZkmy/burger.png' },
        "One-Stop Chicken Shop": { img: 'https://i.postimg.cc/d16WBJfH/brest.png' },
        "Pies & Pasties": { img: 'https://i.postimg.cc/FRnh6Xdc/pie.png' },
        "Kids Menu": { img: 'https://i.postimg.cc/bJVVv46Y/kids.jpg' },
        "EXTRAS": { img: 'https://i.postimg.cc/D0XNMnhq/EXTRA.png' },
        "SAUCES": { img: 'https://i.postimg.cc/6pfpPN5X/sauces.png' },
        "DRINKS": { img: 'https://i.postimg.cc/k4GqJ3nS/drinks.png' },
        "Pizza Meal Deals": { img: 'https://i.postimg.cc/y8Bv8S0T/pizza-deals.png' },
    };

    const info = categoryInfo[category];
    if (!info) return null;

    return (
        <div 
            className="relative rounded-lg overflow-hidden cursor-pointer group w-64 h-64 md:w-72 md:h-72 flex-shrink-0 snap-center"
            onClick={() => setView('menu')}
        >
            <img src={info.img} alt={category} className={`w-full h-full object-cover object-bottom transition-transform duration-500 ${isCenter ? 'scale-110' : 'group-hover:scale-110'}`} />
            <div className={`absolute inset-0 bg-black transition-all duration-500 flex items-center justify-center ${isCenter ? 'bg-opacity-10' : 'bg-opacity-70 group-hover:bg-opacity-10'}`}>
                <h3 className="text-white text-xl md:text-2xl font-bold font-heading uppercase text-center p-2">
                    {category}
                </h3>
            </div>
        </div>
    );
};

export default HomePage;
