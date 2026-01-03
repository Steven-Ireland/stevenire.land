import React from 'react';
import Banner from './Banner';

const Layout = ({ children }) => {
  return (
    <div className="Page">
      <Banner />
      {children}
    </div>
  );
};

export default Layout;
