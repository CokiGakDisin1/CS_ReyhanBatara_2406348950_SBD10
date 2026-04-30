import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative min-h-screen font-sans flex flex-col overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-neon-purple/20 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-neon-blue/20 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-neon-purple/10 blur-[150px] animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />
      
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Outlet />
      </main>
      
      <footer className="relative z-10 py-6 text-center text-gray-500 text-sm border-t border-dark-border mt-auto backdrop-blur-md bg-dark-bg/50">
        <p className="flex items-center justify-center gap-2">
          <span className="text-neon-blue font-bold">FUNKOMART</span> 
          <span>&mdash;</span> 
          <span className="text-gray-400">The Best Tech Gear & Lifestyle</span>
        </p>
      </footer>
    </div>
  );
}
