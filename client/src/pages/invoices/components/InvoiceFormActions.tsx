import { Save } from "lucide-react";

interface InvoiceFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

const InvoiceFormActions = ({
  isLoading,
  onCancel,
}: InvoiceFormActionsProps) => (
  <div className="flex justify-end gap-3">
    <button
      type="button"
      onClick={onCancel}
      className="px-6 py-2.5 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isLoading}
      className="flex items-center gap-2 px-6 py-2.5 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-sm"
    >
      <Save size={16} />
      {isLoading ? "Saving…" : "Create Invoice"}
    </button>
  </div>
);

export default InvoiceFormActions;
