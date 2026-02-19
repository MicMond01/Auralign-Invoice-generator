import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    ChevronDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import { selectCurrentUser } from "@/redux/selectors/authSelectors";
import { useNavigate } from "react-router-dom";
import {
    useGetCustomersQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
    type Customer,
    type CreateCustomerPayload,
} from "@/redux/api/customersApi";
import { useGetCompaniesQuery, type Company } from "@/redux/api/companiesApi";
import { TOAST_CONFIG } from "@/config/baseConfig";

// ── Status badge ──────────────────────────────────────────────────
const StatusBadge = ({ active }: { active: boolean }) => (
    <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${active
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
            }`}
    >
        {active ? "Active" : "Inactive"}
    </span>
);

// ── Customer Form Modal ───────────────────────────────────────────
interface CustomerFormProps {
    companies: Company[];
    initial?: Customer | null;
    onClose: () => void;
    onSaved: () => void;
    userRole?: string;
    userCompanyId?: string;
}

const CustomerFormModal = ({
    companies,
    initial,
    onClose,
    onSaved,
    userRole,
    userCompanyId,
}: CustomerFormProps) => {
    const [createCustomer, { isLoading: creating }] = useCreateCustomerMutation();
    const [updateCustomer, { isLoading: updating }] = useUpdateCustomerMutation();
    const isSaving = creating || updating;
    const isAdmin = userRole === "admin";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateCustomerPayload>({
        defaultValues: initial
            ? {
                companyId:
                    typeof initial.companyId === "object"
                        ? initial.companyId._id
                        : initial.companyId,
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

    const onSubmit = async (data: CreateCustomerPayload) => {
        try {
            if (initial) {
                await updateCustomer({ id: initial._id, data }).unwrap();
                toast.success("Customer updated successfully");
            } else {
                await createCustomer(data).unwrap();
                toast.success("Customer created successfully");
            }
            onSaved();
            onClose();
        } catch (err: any) {
            toast.error(
                err?.data?.message ?? TOAST_CONFIG.MESSAGES.SAVE_ERROR
            );
        }
    };

    const inputCls =
        "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400";
    const labelCls = "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
                        onClick={onClose}
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
                                    {...register("companyId", { required: "Company is required" })}
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
                            onClick={onClose}
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

// ── Main Page ─────────────────────────────────────────────────────
const CustomersPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectCurrentUser);
    const isAdmin = user?.role === "admin";
    const userCompanyId = typeof user?.companyId === 'string'
        ? user.companyId
        : (user?.companyId as any)?._id; // Handle populated object if necessary

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterCompanyId, setFilterCompanyId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        dispatch(
            setBreadcrumbs([
                { label: "Dashboard", path: "/dashboard" },
                { label: "Customers" },
            ])
        );
    }, [dispatch]);

    // If Admin: use filterCompanyId (or undefined for all).
    // If User: force userCompanyId.
    const queryCompanyId = isAdmin ? (filterCompanyId || undefined) : userCompanyId;

    const { data, isLoading, isFetching, refetch } = useGetCustomersQuery({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        companyId: queryCompanyId,
    }, {
        // skip query if user is not admin and has no companyId (shouldn't happen for valid users)
        skip: !isAdmin && !userCompanyId
    });

    // Only fetch companies list if Admin
    const { data: companiesData } = useGetCompaniesQuery(undefined, {
        skip: !isAdmin,
    });

    const [deleteCustomer] = useDeleteCustomerMutation();

    const companies = companiesData?.data?.companies ?? [];
    const customers = data?.data?.customers ?? [];
    const total = data?.data?.total ?? 0;
    const pages = data?.data?.pages ?? 1;

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteCustomer(id).unwrap();
            toast.success(TOAST_CONFIG.MESSAGES.DELETE_SUCCESS);
        } catch {
            toast.error(TOAST_CONFIG.MESSAGES.DELETE_ERROR);
        }
    };

    const openCreate = () => {
        setEditingCustomer(null);
        setShowModal(true);
    };

    const openEdit = (customer: Customer, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent row click
        setEditingCustomer(customer);
        setShowModal(true);
    };

    const handleRowClick = (customer: Customer) => {
        navigate(`/dashboard/customers/${customer._id}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Customers
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {total} customer{total !== 1 ? "s" : ""} in total
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                >
                    <Plus size={16} /> Add Customer
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by name, email or phone..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Company filter - Only Admin */}
                {isAdmin && (
                    <div className="relative">
                        <select
                            value={filterCompanyId}
                            onChange={(e) => {
                                setFilterCompanyId(e.target.value);
                                setPage(1);
                            }}
                            className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Companies</option>
                            {companies.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={14}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                {[
                                    "Name",
                                    "Email",
                                    "Phone",
                                    isAdmin ? "Company" : null,
                                    "City",
                                    "Status",
                                    "Actions",
                                ]
                                    .filter(Boolean)
                                    .map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider whitespace-nowrap"
                                        >
                                            {h}
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {isLoading || isFetching ? (
                                <tr>
                                    <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center">
                                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={isAdmin ? 7 : 6}
                                        className="py-10 text-center text-slate-400 text-sm"
                                    >
                                        No customers found.&nbsp;
                                        <button
                                            onClick={openCreate}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            Add your first one
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                customers.map((c) => (
                                    <tr
                                        key={c._id}
                                        onClick={() => handleRowClick(c)}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                                            {c.name}
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                                            {c.email ?? "—"}
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                                            {c.phone ?? "—"}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                                                {typeof c.companyId === "object"
                                                    ? (c.companyId as { name: string }).name
                                                    : "—"}
                                            </td>
                                        )}
                                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                                            {c.city ?? "—"}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <StatusBadge active={c.isActive} />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={(e) => openEdit(c, e)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(c._id, e)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-xs text-slate-500">
                            Page {page} of {pages} ({total} total)
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                                disabled={page >= pages}
                                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <CustomerFormModal
                    companies={companies}
                    initial={editingCustomer}
                    onClose={() => setShowModal(false)}
                    onSaved={refetch}
                    userRole={user?.role}
                    userCompanyId={userCompanyId}
                />
            )}
        </div>
    );
};

export default CustomersPage;
