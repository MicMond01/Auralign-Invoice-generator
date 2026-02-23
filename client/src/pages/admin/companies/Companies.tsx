import { useState } from "react";
import CompanyForm from "./components/CompanyForm";
import Modal from "./components/Model";
import DeleteConfirmation from "@/components/modals/DeleteConfirmation";
import CompaniesList from "./components/CompaniesList";
import { ICompany } from "@/types/api/companies";
import { useGetCompaniesQuery } from "@/redux/api/adminApi";
import { useCreateCompanyMutation, useUpdateCompanyMutation, type CreateCompanyPayload } from "@/redux/api/companiesApi";
import { useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { ROUTES, TOAST_CONFIG } from "@/config/baseConfig";
import { toast } from "sonner";

const Companies = () => {
  const authState = useAppSelector((state) => state.auth);

  // Only fetch companies if authenticated and has token
  const { data: companiesData, isLoading } = useGetCompaniesQuery(undefined, {
    skip: !authState.isAuthenticated || !authState.tokens?.accessToken,
  });

  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const isSaving = isCreating || isUpdating;
  const navigate = useNavigate();

  const handleCreateNew = () => {
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (formMode === "create") {
        await createCompany(data as CreateCompanyPayload).unwrap();
        toast.success("Company created successfully");
      } else if (selectedCompany?.id) {
        await updateCompany({ id: selectedCompany.id, data }).unwrap();
        toast.success("Company updated successfully");
      }
      setIsFormOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || TOAST_CONFIG.MESSAGES.SAVE_ERROR);
    }
  };

  const confirmDelete = () => {
    // TODO: Implement delete confirmation
  };

  const handleViewDetails = (company: ICompany) => {
    navigate(ROUTES.COMPANY_DETAIL(company.id))

  };

  return (
    <div className="flex">
      {/* Main Content */}
      <main className="flex-1 min-w-0 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {!authState.isAuthenticated || !authState.tokens?.accessToken ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-500">Loading authentication...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Companies</h1>
                <p className="text-slate-500">Manage and view all registered companies.</p>
              </div>
              <CompaniesList
                companies={companiesData?.data || []}
                onCreateNew={handleCreateNew}
                onViewDetails={handleViewDetails}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      </main>

      {/* --- DIALOGS --- */}

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={formMode === 'create' ? "Create New Company" : "Edit Company Profile"}
      >
        <CompanyForm 
          defaultValues={formMode === 'edit' ? selectedCompany : undefined} 
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSaving={isSaving}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        title="Confirm Deletion"
      >
        <DeleteConfirmation 
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      </Modal>

    </div>
  );
};

export default Companies