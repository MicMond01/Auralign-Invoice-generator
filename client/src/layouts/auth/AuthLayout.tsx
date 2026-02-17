import { Outlet } from "react-router-dom";

const AuthLayout = () => (
   <div className="min-h-[100dvh] w-full bg-[#f8fafc] flex flex-col items-center justify-center p-5 relative overflow-hidden font-sans">
    {/* Decorative Soft Background Blobs */}
    <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60" />
    <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-60" />
    
    <div className="w-full max-w-md z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
     <Outlet />
    </div>
  </div>
);

export default AuthLayout;
