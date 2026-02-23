import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { Company } from "@/redux/api/companiesApi";
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

interface InvoiceDetailsSectionProps {
  register: UseFormRegister<InvoiceFormValues>;
  companies: Company[];
  isAdmin: boolean;
  errors: FieldErrors<InvoiceFormValues>;
}

const sectionCls =
  "bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6";

const InvoiceDetailsSection = ({
  register,
  errors,
  companies,
  isAdmin,
}: InvoiceDetailsSectionProps) => (
  <div className={sectionCls}>
    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
      Invoice Details
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {isAdmin && (
        <FormSelect
          label="Company"
          required
          error={errors.companyId?.message}
          {...register("companyId", { required: "Company is required" })}
        >
          <option value="">Select a company</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </FormSelect>
      )}

      <FormSelect label="Invoice Type" {...register("invoiceType")}>
        <option value="invoice">Invoice</option>
        <option value="proforma">Proforma</option>
      </FormSelect>
    </div>
  </div>
);

export default InvoiceDetailsSection;
