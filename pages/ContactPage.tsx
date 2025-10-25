
import React from 'react';
import { ICONS } from '../constants';

interface ContactPageProps {
  contactInfo: { address: string; phone: string; email: string; };
}

const ContactPage: React.FC<ContactPageProps> = ({ contactInfo }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you shortly.");
    e.currentTarget.reset();
  };

  return (
    <div className="bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-40">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white font-heading">Get In Touch</h1>
          <p className="mt-4 text-lg text-gray-400">We'd love to hear from you. Send us a message or give us a call.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-black p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Full Name</label>
                <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-brand-red focus:border-brand-red" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email Address</label>
                <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-brand-red focus:border-brand-red" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400">Message</label>
                <textarea id="message" name="message" rows={5} required className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-brand-red focus:border-brand-red"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-brand-red hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-red">
                  Send Message
                </button>
              </div>
            </form>
          </div>
          
          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-black p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-white mb-4 font-heading">Our Details</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  {React.cloneElement(ICONS.location, { className: 'h-6 w-6 mr-4 mt-1 text-brand-red flex-shrink-0' })}
                  <span>{contactInfo.address}</span>
                </li>
                <li className="flex items-center">
                  {React.cloneElement(ICONS.phone, { className: 'h-6 w-6 mr-4 text-brand-red' })}
                  <span>{contactInfo.phone}</span>
                </li>
                <li className="flex items-center">
                  {React.cloneElement(ICONS.email, { className: 'h-6 w-6 mr-4 text-brand-red' })}
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-white">{contactInfo.email}</a>
                </li>
              </ul>
            </div>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                <div className="bg-gray-800 flex items-center justify-center">
                   <p className="text-gray-500">Map Placeholder</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
