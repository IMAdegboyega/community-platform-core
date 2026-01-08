import React from 'react';
import Image from 'next/image';

const Layout = ({ children }) => {
  return (
    <div className='flex h-screen bg-white overflow-hidden'>
      {/* Left Section - Fixed Branding */}
      <section className='w-2/5 hidden lg:block relative h-screen'>
        {/* Background Image */}
        <Image
          src="/img/AuthBackground.png"
          alt="Auth"
          width={800}
          height={800}
          className='h-full w-full object-cover'
        />

        {/* Logo - Fixed Position */}
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <Image
            src="/icon/logo-brand.svg"
            alt="Klekky Logo"
            width={200}  
            height={500}
          />
        </div>
      </section>

      {/* Right Section - Scrollable Content */}
      <section className='flex-1 h-screen overflow-y-auto bg-white'>
        <div className='min-h-full flex items-center justify-center py-12 px-4'>
          <div className='w-full max-w-md'>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Layout;