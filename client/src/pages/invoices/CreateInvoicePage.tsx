import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Trash2, Save, ArrowLeft, ChevronDown } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import {
    useCreateInvoiceMutation,
    type CreateInvoicePayload,
    type AdditionalCharge,
} from "@/redux/api/invoicesApi";
import { useGetCustomersQuery } from "@/redux/api/customersApi";
import { useGetCompaniesQuery } from "@/redux/api/companiesApi";

// ── Types ─────────────────────────────────────────────────────────
interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
}

interface InvoiceFormValues {
    companyId: string;
    customerId: string;
    invoiceType: "invoice" | "proforma";
    dueDate: string;
    isDraft: boolean;
    notes?: string;
    termsAndConditions?: string;
    items: InvoiceItem[];
}

// ── Page ──────────────────────────────────────────────────────────
const CreateInvoicePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [createInvoice, { isLoading }] = useCreateInvoiceMutation();

    const { data: companiesData } = useGetCompaniesQuery();
    const { data: customersData, refetch: refetchCustomers } =
        useGetCustomersQuery({ limit: 100 });

    const companies = companiesData?.data?.companies ?? [];
    const customers = customersData?.data?.customers ?? [];

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<InvoiceFormValues>({
        defaultValues: {
            invoiceType: "invoice",
            isDraft: false,
            items: [{ description: "", quantity: 1, unitPrice: 0 }],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const selectedCompanyId = watch("companyId");

    // refresh customers whenever company changes
    useEffect(() => {
        if (selectedCompanyId) refetchCustomers();
    }, [selectedCompanyId, refetchCustomers]);

    useEffect(() => {
        dispatch(
            setBreadcrumbs([
                { label: "Dashboard", path: "/dashboard" },
                { label: "Invoices", path: "/dashboard/invoices" },
                { label: "Create Invoice" },
            ])
        );
    }, [dispatch]);

    const items = watch("items");
    const subtotal = items.reduce(
        (acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0),
        0
    );
    const grandTotal = subtotal;

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
                    total: item.quantity * item.unitPrice,
                })),
                subtotal,
                grandTotal,
                additionalCharges: [] as AdditionalCharge[],
            };

            await createInvoice(payload).unwrap();
            toast.success("Invoice created successfully");
            navigate("/dashboard/invoices");
        } catch (err: any) {
            toast.error(
                err?.data?.message ??
                (err?.data?.errors?.join(", ")) ??
                "Failed to create invoice"
            );
            console.error(err);
        }
    };

    const inputCls =
        "w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400";
    const labelCls =
        "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
    const sectionCls =
        "bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6";

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2,
        }).format(amount);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Create New Invoice
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Fill in the details below to generate an invoice
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Company & Invoice Type */}
                <div className={sectionCls}>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Invoice Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Company */}
                        <div>
                            <label className={labelCls}>Company *</label>
                            <div className="relative">
                                <select
                                    {...register("companyId", {
                                        required: "Company is required",
                                    })}
                                    className={`${inputCls} appearance-none pr-8`}
                                >
                                    <option value="">Select a company</option>
                                    {companies.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                            </div>
                            {errors.companyId && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.companyId.message}
                                </p>
                            )}
                        </div>

                        {/* Invoice Type */}
                        <div>
                            <label className={labelCls}>Invoice Type</label>
                            <div className="relative">
                                <select
                                    {...register("invoiceType")}
                                    className={`${inputCls} appearance-none pr-8`}
                                >
                                    <option value="invoice">Invoice</option>
                                    <option value="proforma">Proforma</option>
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer & Due Date */}
                <div className={sectionCls}>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Customer & Dates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Customer */}
                        <div>
                            <label className={labelCls}>Customer *</label>
                            <div className="relative">
                                <select
                                    {...register("customerId", {
                                        required: "Customer is required",
                                    })}
                                    className={`${inputCls} appearance-none pr-8`}
                                >
                                    <option value="">Select a customer</option>
                                    {customers
                                        .filter((c) =>
                                            selectedCompanyId
                                                ? (typeof c.companyId === "object"
                                                    ? (c.companyId as { _id: string })._id
                                                    : c.companyId) === selectedCompanyId
                                                : true
                                        )
                                        .map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                                {c.email ? ` — ${c.email}` : ""}
                                            </option>
                                        ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                            </div>
                            {errors.customerId && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.customerId.message}
                                </p>
                            )}
                        </div>

                        {/* Due Date */}
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

                {/* Invoice Items */}
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
                                    {...register(`items.${index}.description`, {
                                        required: true,
                                    })}
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

                    {/* Totals */}
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
                </div>

                {/* Notes & Terms */}
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

                {/* Form actions */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
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
            </form>
        </div>
    );
};

export default CreateInvoicePage;
