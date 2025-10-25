
import React from 'react';
import { ICONS } from '../constants';
import { View } from '../types';

interface FooterProps {
    contactInfo: { address: string; phone: string; email: string };
    openingHours: { [key: string]: string };
    setView: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ contactInfo, openingHours, setView }) => {
    return (
        <footer className="bg-black text-white">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-4">Leominster Fish Bar</h3>
                        <p className="text-gray-400">Serving the best fish and chips in town.</p>
                         <button 
                            onClick={() => setView('admin-login')} 
                            className="text-gray-500 hover:text-white mt-4 text-sm"
                        >
                            Admin Login
                        </button>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-center justify-center md:justify-start">
                                {React.cloneElement(ICONS.location, { className: 'h-5 w-5 mr-3' })}
                                <span>{contactInfo.address}</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start">
                                {React.cloneElement(ICONS.phone, { className: 'h-5 w-5 mr-3' })}
                                <span>{contactInfo.phone}</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start">
                                {React.cloneElement(ICONS.email, { className: 'h-5 w-5 mr-3' })}
                                <a href={`mailto:${contactInfo.email}`} className="hover:text-white">{contactInfo.email}</a>
                            </li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold font-heading mb-4">Opening Hours</h3>
                        <ul className="space-y-1 text-gray-400">
                           {Object.entries(openingHours).map(([day, hours]) => (
                               <li key={day}>{day}: {hours}</li>
                           ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-800 pt-6 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Leominster Fish Bar. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
