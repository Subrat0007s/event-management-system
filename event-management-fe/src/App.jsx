import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./components/dashboard/Dashboard";
import Navbar from "./components/navbar/Navbar";
import EmailVerification from "./components/auth/EmailVerification";
import PaymentPage from "./pages/PaymentPage";
import EnhancedPaymentPage from "./pages/EnhancedPaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import { CartProvider } from "./context/CartContext";
import Cart from "./components/cart/Cart";

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <main className="min-h-[calc(100vh-60px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/enhanced-payment" element={<EnhancedPaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Cart />
    </CartProvider>
  );
}
