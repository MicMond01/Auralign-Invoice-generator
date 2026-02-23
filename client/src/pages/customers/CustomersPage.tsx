import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import { useGetCustomersQuery, useDeleteCustomerMutation, type Customer } from "@/redux/api/customersApi";
import { useGetCompaniesQuery } from "@/redux/api/companiesApi";
import { TOAST_CONFIG } from "@/config/baseConfig";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCustomerModalStore } from "@/stores/useCustomerModalStore";

import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import CustomerSearchBar from "./components/CustomerSearchBar";
import CompanyFilterDropdown from "./components/CompanyFilterDropdown";
import CustomerTableRow from "./components/CustomerTableRow";
import CustomerFormModal from "./components/CustomerFormModal";

const CustomersPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAdmin, userCompanyId } = useAuthStore();
    const { openCreate, openEdit } = useCustomerModalStore();

    const [page, setPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterCompanyId, setFilterCompanyId] = useState("");

    useEffect(() => {
        dispatch(
            setBreadcrumbs([
                { label: "Dashboard", path: "/dashboard" },
                { label: "Customers" },
            ])
        );
    }, [dispatch]);

    const queryCompanyId = isAdmin
        ? filterCompanyId || undefined
        : userCompanyId;

    const { data, isLoading, isFetching } = useGetCustomersQuery(
        {
            page,
            limit: 10,
            search: debouncedSearch || undefined,
            companyId: queryCompanyId,
        },
        { skip: !isAdmin && !userCompanyId }
    );

    const { data: companiesData } = useGetCompaniesQuery(undefined, {
        skip: !isAdmin,
    });

    const [deleteCustomer] = useDeleteCustomerMutation();

    const companies = companiesData?.data?.companies ?? [];
    const customers = data?.data?.customers ?? [];
    const total = data?.data?.total ?? 0;
    const pages = data?.data?.pages ?? 1;

    const handleDelete = async (id: string) => {
        try {
            await deleteCustomer(id).unwrap();
            toast.success(TOAST_CONFIG.MESSAGES.DELETE_SUCCESS);
        } catch {
            toast.error(TOAST_CONFIG.MESSAGES.DELETE_ERROR);
        }
    };

    const handleSearchChange = useCallback((value: string) => {
        setDebouncedSearch(value);
        setPage(1);
    }, []);

    const handleFilterChange = useCallback((value: string) => {
        setFilterCompanyId(value);
        setPage(1);
    }, []);

    const colCount = isAdmin ? 7 : 6;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Customers"
                subtitle={`${total} customer${total !== 1 ? "s" : ""} in total`}
                action={
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Plus size={16} /> Add Customer
                    </button>
                }
            />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <CustomerSearchBar onSearchChange={handleSearchChange} />
                {isAdmin && (
                    <CompanyFilterDropdown
                        companies={companies}
                        value={filterCompanyId}
                        onChange={handleFilterChange}
                    />
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                {["Name", "Email", "Phone", isAdmin ? "Company" : null, "City", "Status", "Actions"]
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
                                    <td colSpan={colCount} className="py-12 text-center">
                                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={colCount}
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
                                    <CustomerTableRow
                                        key={c._id}
                                        customer={c}
                                        isAdmin={isAdmin}
                                        onRowClick={(cust) =>
                                            navigate(`/dashboard/customers/${cust._id}`)
                                        }
                                        onEdit={openEdit}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    page={page}
                    pages={pages}
                    total={total}
                    onPageChange={setPage}
                />
            </div>

            {/* Modal */}
            <CustomerFormModal />
        </div>
    );
};

export default CustomersPage;
