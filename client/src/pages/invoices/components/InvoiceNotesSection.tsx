import type { UseFormRegister } from "react-hook-form";

interface InvoiceFormValues {
  companyId: string;
  customerId: string;
  invoiceType: "invoice" | "proforma";
  dueDate: string;
  isDraft: boolean;
  notes?: string;
  termsAndConditions?: string;
  items: { description: string; quantity: number; unitPrice: number }[];
}

interface InvoiceNotesSectionProps {
  register: UseFormRegister<InvoiceFormValues>;
}

const sectionCls =
  "bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6";
const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400";
const labelCls =
  "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

const InvoiceNotesSection = ({ register }: InvoiceNotesSectionProps) => (
  <div className={sectionCls}>
    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
      Additional Info
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className={labelCls}>Notes</label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Any notes for the customer..."
          className={`${inputCls} resize-none`}
        />
      </div>
      <div>
        <label className={labelCls}>Terms & Conditions</label>
        <textarea
          {...register("termsAndConditions")}
          rows={3}
          placeholder="Payment terms, policies..."
          className={`${inputCls} resize-none`}
        />
      </div>
    </div>

    {/* Save as draft? */}
    <div className="flex items-center gap-2 pt-1">
      <input
        type="checkbox"
        id="isDraft"
        {...register("isDraft")}
        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <label
        htmlFor="isDraft"
        className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none"
      >
        Save as draft (won't change status to &quot;sent&quot;)
      </label>
    </div>
  </div>
);

export default InvoiceNotesSection;
