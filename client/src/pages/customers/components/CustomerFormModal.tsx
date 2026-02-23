import { X, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { TOAST_CONFIG } from "@/config/baseConfig";
import { useCustomerModalStore } from "@/stores/useCustomerModalStore";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  type CreateCustomerPayload,
} from "@/redux/api/customersApi";
import { useGetCompaniesQuery } from "@/redux/api/adminApi";

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400";
const labelCls =
  "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1";

const CustomerFormModal = () => {
  const { isOpen, editingCustomer: initial, close } = useCustomerModalStore();
  const { isAdmin, userCompanyId } = useAuthStore();

  const [createCustomer, { isLoading: creating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: updating }] = useUpdateCustomerMutation();
  const isSaving = creating || updating;

  const { data: companiesData } = useGetCompaniesQuery(undefined, {
    skip: !isAdmin || !isOpen,
  });
  const companies = (companiesData?.data as any) ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCustomerPayload>({
    defaultValues: initial
      ? {
          companyId:
            initial.companyId && typeof initial.companyId === "object"
              ? (initial.companyId as any)._id
              : initial.companyId || "",
          name: initial.name,
          email: initial.email,
          phone: initial.phone,
          address: initial.address,
          city: initial.city,
          state: initial.state,
          country: initial.country,
          taxId: initial.taxId,
          notes: initial.notes,
        }
      : {
          country: "Nigeria",
          companyId: !isAdmin ? userCompanyId : "",
        },
  });

  // Close on Escape
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  }, [close]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, handleEscape]);

  const onSubmit = async (data: CreateCustomerPayload) => {
    try {
      if (initial) {
        await updateCustomer({ id: initial._id, data }).unwrap();
        toast.success("Customer updated successfully");
      } else {
        await createCustomer(data).unwrap();
        toast.success("Customer created successfully");
      }
      close();
    } catch (err: any) {
      toast.error(err?.data?.message ?? TOAST_CONFIG.MESSAGES.SAVE_ERROR);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {initial ? "Edit Customer" : "Add New Customer"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {initial
                ? "Update customer details"
                : "Fill in the details to create a customer"}
            </p>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Company - Only show for Admin */}
          {isAdmin && (
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
                  {companies.map((c: any) => (
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
          )}

          {/* Name */}
          <div>
            <label className={labelCls}>Full Name *</label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="e.g. John Doe"
              className={inputCls}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                {...register("email")}
                placeholder="email@example.com"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input
                {...register("phone")}
                placeholder="+234 800 000 0000"
                className={inputCls}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={labelCls}>Address</label>
            <input
              {...register("address")}
              placeholder="Street address"
              className={inputCls}
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>City</label>
              <input
                {...register("city")}
                placeholder="Lagos"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input
                {...register("state")}
                placeholder="Lagos State"
                className={inputCls}
              />
            </div>
          </div>

          {/* Country + Tax ID */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Country</label>
              <input
                {...register("country")}
                placeholder="Nigeria"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Tax ID</label>
              <input
                {...register("taxId")}
                placeholder="RC-12345678"
                className={inputCls}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              {...register("notes")}
              rows={2}
              placeholder="Any additional notes..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving
                ? "Saving..."
                : initial
                  ? "Save Changes"
                  : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
