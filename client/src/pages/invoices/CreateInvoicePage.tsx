import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import { ROUTES, TOAST_CONFIG } from "@/config/baseConfig";
import { useCreateInvoiceMutation, type CreateInvoicePayload } from "@/redux/api/invoicesApi";
import { useGetCompaniesQuery } from "@/redux/api/adminApi";
import { useGetCustomersQuery } from "@/redux/api/customersApi";
import { useAuthStore } from "@/stores/useAuthStore";

import InvoiceDetailsSection from "./components/InvoiceDetailsSection";
import CustomerDateSection from "./components/CustomerDateSection";
import InvoiceLineItems from "./components/InvoiceLineItems";
import InvoiceTotals from "./components/InvoiceTotals";
import InvoiceNotesSection from "./components/InvoiceNotesSection";
import InvoiceFormActions from "./components/InvoiceFormActions";

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

const CreateInvoicePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Breadcrumbs
  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Dashboard", path: "/dashboard" },
        { label: "Invoices", path: ROUTES.INVOICES },
        { label: "New Invoice" },
      ])
    );
  }, [dispatch]);

  const { isAdmin, userCompanyId } = useAuthStore();

  // API hooks
  const { data: companiesData } = useGetCompaniesQuery(undefined, { skip: !isAdmin });
  const { data: customersData } = useGetCustomersQuery({ page: 1, limit: 100 });
  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();

  const companies = (companiesData?.data as any) ?? [];
  const customers = customersData?.data?.customers ?? [];

  // Form
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    defaultValues: {
      companyId: !isAdmin ? userCompanyId : "",
      customerId: "",
      invoiceType: "invoice",
      dueDate: "",
      isDraft: false,
      notes: "",
      termsAndConditions: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const selectedCompanyId = watch("companyId");
  const items = watch("items");

  // Calculated totals
  const { subtotal, grandTotal } = useMemo(() => {
    const sub = items.reduce((sum, i) => sum + (i.quantity || 0) * (i.unitPrice || 0), 0);
    return { subtotal: sub, grandTotal: sub };
  }, [items]);

  // Submit
  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      const payload: CreateInvoicePayload = {
        companyId: data.companyId,
        customerId: data.customerId,
        invoiceType: data.invoiceType,
        dueDate: data.dueDate,
        isDraft: data.isDraft,
        notes: data.notes,
        termsAndConditions: data.termsAndConditions,
        items: data.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: (item.quantity || 0) * (item.unitPrice || 0),
        })),
        subtotal,
        grandTotal,
      };
      await createInvoice(payload).unwrap();
      toast.success(TOAST_CONFIG.MESSAGES.SAVE_SUCCESS);
      navigate(ROUTES.INVOICES);
    } catch (err: any) {
      toast.error(err?.data?.message ?? TOAST_CONFIG.MESSAGES.SAVE_ERROR);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(ROUTES.INVOICES)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={18} className="text-slate-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Create Invoice
          </h1>
          <p className="text-sm text-slate-500">
            Fill in the details below to generate a new invoice
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InvoiceDetailsSection
          register={register}
          errors={errors}
          companies={companies}
          isAdmin={isAdmin}
        />

        <CustomerDateSection
          register={register}
          errors={errors}
          customers={customers}
          selectedCompanyId={selectedCompanyId}
        />

        <InvoiceLineItems control={control} register={register} />

        <InvoiceTotals subtotal={subtotal} grandTotal={grandTotal} />

        <InvoiceNotesSection register={register} />

        <InvoiceFormActions
          isLoading={isLoading}
          onCancel={() => navigate(ROUTES.INVOICES)}
        />
      </form>
    </div>
  );
};

export default CreateInvoicePage;
