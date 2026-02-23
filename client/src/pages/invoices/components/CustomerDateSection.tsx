import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { Customer } from "@/redux/api/customersApi";
import FormSelect from "@/components/forms/FormSelect";

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

interface CustomerDateSectionProps {
  register: UseFormRegister<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
  customers: Customer[];
  selectedCompanyId: string;
}

const sectionCls =
  "bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6";
const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400";
const labelCls =
  "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

const CustomerDateSection = ({
  register,
  errors,
  customers,
  selectedCompanyId,
}: CustomerDateSectionProps) => {
  const filteredCustomers = customers.filter((c) =>
    selectedCompanyId
      ? (typeof c.companyId === "object"
          ? (c.companyId as { _id: string })._id
          : c.companyId) === selectedCompanyId
      : true
  );

  return (
    <div className={sectionCls}>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        Customer & Dates
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormSelect
          label="Customer"
          required
          error={errors.customerId?.message}
          {...register("customerId", { required: "Customer is required" })}
        >
          <option value="">Select a customer</option>
          {filteredCustomers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
              {c.email ? ` — ${c.email}` : ""}
            </option>
          ))}
        </FormSelect>

        <div>
          <label className={labelCls}>Due Date *</label>
          <input
            type="date"
            {...register("dueDate", { required: "Due date is required" })}
            className={inputCls}
          />
          {errors.dueDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.dueDate.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDateSection;
