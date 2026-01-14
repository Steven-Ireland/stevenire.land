import React from 'react';
import Head from 'next/head';
import Banner from './Banner';
import Footer from './Footer';
import BackgroundEffect from './BackgroundEffect';

const Layout = ({ children }) => {
  return (
    <div className="Page">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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