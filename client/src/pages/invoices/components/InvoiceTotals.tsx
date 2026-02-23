import { formatCurrency } from "@/utils/formatCurrency";

interface InvoiceTotalsProps {
  subtotal: number;
  grandTotal: number;
}

const InvoiceTotals = ({ subtotal, grandTotal }: InvoiceTotalsProps) => (
  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
    <div className="w-72 space-y-2">
      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
        <span>Subtotal:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
        <span>Grand Total:</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  </div>
);

export default InvoiceTotals;
