import { Zap } from "lucide-react";

const BrandHeader = () => (
  <div className="text-center space-y-3">
    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-2 transform active:scale-95 transition-transform">
      <Zap size={28} className="text-white fill-current" />
    </div>
    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
      Welcome back
    </h1>
    <p className="text-slate-500 font-medium px-4 leading-relaxed">
      Sign in to access your dashboard
    </p>
  </div>
);

export default BrandHeader;
