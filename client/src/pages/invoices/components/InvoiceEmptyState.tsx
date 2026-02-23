import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/baseConfig";

const InvoiceEmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="py-16 text-center">
      <FileText size={40} className="mx-auto text-slate-300 mb-3" />
      <p className="text-slate-400 mb-4">No invoices yet</p>
      <button
        onClick={() => navigate(ROUTES.CREATE_INVOICE)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Create your first invoice
      </button>
    </div>
  );
};

export default InvoiceEmptyState;
