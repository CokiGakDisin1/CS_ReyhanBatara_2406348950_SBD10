import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import TopUp from './pages/TopUp';
import Payment from './pages/Payment';

function App() {
  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 selection:bg-neon-purple selection:text-white font-sans">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<Profile />} />
            <Route path="topup" element={<TopUp />} />
            <Route path="payment" element={<Payment />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
