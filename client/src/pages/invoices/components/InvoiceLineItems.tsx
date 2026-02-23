import {
  useFieldArray,
  type Control,
  type UseFormRegister,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

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

interface InvoiceLineItemsProps {
  control: Control<InvoiceFormValues>;
  register: UseFormRegister<InvoiceFormValues>;
}

const sectionCls =
  "bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6";
const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400";

const InvoiceLineItems = ({ control, register }: InvoiceLineItemsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <div className={sectionCls}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Invoice Items
        </h3>
        <button
          type="button"
          onClick={() =>
            append({ description: "", quantity: 1, unitPrice: 0 })
          }
          className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
        >
          <Plus size={15} /> Add Item
        </button>
      </div>

      {/* Column headers */}
      <div className="hidden md:grid grid-cols-[1fr_80px_100px_32px] gap-3 text-xs font-medium text-slate-500 uppercase tracking-wider px-1">
        <span>Description</span>
        <span>Qty</span>
        <span>Unit Price</span>
        <span />
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-[1fr_80px_100px_32px] gap-3 items-start"
          >
            <input
              placeholder="Item description"
              {...register(`items.${index}.description`, { required: true })}
              className={inputCls}
            />
            <input
              type="number"
              placeholder="Qty"
              min="1"
              {...register(`items.${index}.quantity`, {
                valueAsNumber: true,
                min: 1,
              })}
              className={inputCls}
            />
            <input
              type="number"
              placeholder="Price"
              min="0"
              step="0.01"
              {...register(`items.${index}.unitPrice`, {
                valueAsNumber: true,
                min: 0,
              })}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-30 mt-0.5"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceLineItems;
