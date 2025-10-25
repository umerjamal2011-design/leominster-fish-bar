
import React from 'react';

interface LoadingScreenProps {
    isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
    return (
        <div 
            className={`fixed inset-0 bg-dark-bg z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-hidden={!isLoading}
        >
            <div className="text-center">
                <img 
                    src="https://i.postimg.cc/MKMSvBCd/Leo-Fishbar-Logo-150x150.png" 
                    alt="Leominster Fish Bar Logo" 
                    className="h-24 w-24 mx-auto animate-pulse" 
                />
                <h1 
                    className="font-script text-white text-4xl mt-4"
                    style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)' }}
                >
                    Leominster Fish Bar
                </h1>
                <p className="text-gray-300 mt-2 text-lg tracking-widest">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
