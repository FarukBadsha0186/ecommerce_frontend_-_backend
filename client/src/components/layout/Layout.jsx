// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Header from './Header';
// import Footer from './Footer';
// import { useCart } from '../../context/CartContext';

// const Layout = () => {
//   const { cartItems } = useCart();
//   const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header cartItemCount={cartItemCount} />
//       <main className="flex-grow pt-20">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Layout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useCart } from '../../context/CartContext';


const Layout = () => {
  const { cartItems } = useCart();
  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header cartItemCount={cartItemCount} />
      <main className="flex-grow pt-20">
        <Outlet /> {/* 👈 এখানে পেজ রেন্ডার হবে */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;