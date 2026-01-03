import React from 'react';
import Banner from './Banner';
import Footer from './Footer';
import BackgroundEffect from './BackgroundEffect';

const Layout = ({ children }) => {
  return (
    <div className="Page">
      <BackgroundEffect 
        scanlines={true} 
        vignette={true} 
      />
      <Banner />
      <main className="Main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;