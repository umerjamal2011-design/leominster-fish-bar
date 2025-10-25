
import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { ICONS } from '../constants';

interface HeaderProps {
    setView: (view: View) => void;
    toggleCart: () => void;
    cartCount: number;
    currentView: View;
    toggleSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, toggleCart, cartCount, currentView, toggleSearch }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (currentView !== 'home') {
            setScrolled(true);
            return;
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        
        handleScroll(); // Check on initial render for home
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentView]);

    const navLinkClasses = "uppercase tracking-wider font-heading hover:text-gray-300 transition-colors text-xl";

    const MobileMenu = () => (
        <div className="fixed inset-0 bg-dark-bg z-50 p-4 flex flex-col">
            <div className="flex justify-end">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white">
                    {ICONS.close}
                </button>
            </div>
            <nav className="flex flex-col items-center justify-center flex-grow space-y-8 -mt-12">
                <a href="#home" onClick={(e) => { e.preventDefault(); setView('home'); setIsMobileMenuOpen(false); }} className={`${navLinkClasses} text-4xl`}>Home</a>
                <a href="#menu" onClick={(e) => { e.preventDefault(); setView('menu'); setIsMobileMenuOpen(false); }} className={`${navLinkClasses} text-4xl`}>Catalog</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); setView('contact'); setIsMobileMenuOpen(false); }} className={`${navLinkClasses} text-4xl`}>Contact</a>
                <div className="pt-8 flex items-center space-x-8 text-2xl">
                    <div className="flex items-center space-x-1 cursor-pointer">
                        <span>GBP</span>
                        {ICONS.chevronDown}
                    </div>
                    <button onClick={() => { toggleSearch(); setIsMobileMenuOpen(false); }} className="hover:text-gray-300">{ICONS.search}</button>
                    <button className="hover:text-gray-300">{ICONS.user}</button>
                </div>
            </nav>
        </div>
    );

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${scrolled ? 'bg-dark-bg shadow-lg' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`flex items-center justify-between relative transition-all duration-300 ${scrolled ? 'h-24 md:h-32' : 'h-32 md:h-48'}`}>
                        {/* Left Side: Hamburger on mobile, Nav on desktop */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-white">
                                {ICONS.menu}
                            </button>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#home" onClick={(e) => { e.preventDefault(); setView('home'); }} className={navLinkClasses}>Home</a>
                            <a href="#menu" onClick={(e) => { e.preventDefault(); setView('menu'); }} className={navLinkClasses}>Catalog</a>
                            <a href="#contact" onClick={(e) => { e.preventDefault(); setView('contact'); }} className={navLinkClasses}>Contact</a>
                        </nav>

                        {/* Centered Logo */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                           <div className="cursor-pointer" onClick={() => setView('home')}>
                               {ICONS.logo(scrolled)}
                           </div>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-2 md:space-x-6">
                            <div className="hidden md:flex items-center space-x-1 cursor-pointer text-lg">
                                <span>GBP</span>
                                {ICONS.chevronDown}
                            </div>
                            <button onClick={toggleSearch} className="hidden md:block hover:text-gray-300">{ICONS.search}</button>
                            <button className="hidden md:block hover:text-gray-300">{ICONS.user}</button>
                            <button onClick={toggleCart} className="relative p-2 -mr-2 rounded-full hover:text-gray-300">
                                {ICONS.cart}
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-brand-red rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            {isMobileMenuOpen && <MobileMenu />}
        </>
    );
};

export default Header;