import { Bell, Building2, ChevronRight, LayoutDashboard, Menu, Plus, Settings, Users, X } from "lucide-react";
import { useState } from "react";
import SidebarItem from "./components/SidebarItem";
import { Button } from "@/components/ui/button";
import CompanyForm from "./components/CompanyForm";
import Modal from "./components/Model";
import DeleteConfirmation from "@/components/modals/DeleteConfirmation";
import CompaniesList from "./components/CompaniesList";
import { ICompany } from "@/types/api/companies";
import { useGetCompaniesQuery } from "@/redux/api/adminApi";

const Companies = () => {
  const { data: companiesData, isLoading } = useGetCompaniesQuery();
  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");



  const handleCreateNew = () => {
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleEdit = () => {
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Partial<ICompany>) => {
  
  };

  const confirmDelete = () => {
    console.log("Hi")
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans flex text-slate-900">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            <LayoutDashboard size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight">Admin Panel</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 py-4">
          <SidebarItem  icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem icon={Building2} label="Companies" active />
          <SidebarItem icon={Users} label="Users" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">JD</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">Jane Doe</div>
              <div className="text-xs text-slate-500 truncate">Admin</div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white shadow-xl p-4 animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-8">
               <span className="font-bold text-lg">Menu</span>
               <button onClick={() => setIsMobileMenuOpen(false)}><X size={20} /></button>
             </div>
             <nav className="space-y-2">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" />
                <SidebarItem icon={Building2} label="Companies" active />
                <SidebarItem icon={Users} label="Users" />
             </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-w-0 transition-all duration-300">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">
              Companies
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <Button className="hidden sm:flex bg-blue-600" onClick={handleCreateNew}><Plus size={20} className="mr-2" />Create New Company</Button>
            <button className="sm:hidden w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform" onClick={handleCreateNew}>
               <Plus size={24} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
            <>
              <div className="mb-6">
                <p className="text-slate-500">Manage and view all registered companies.</p>
              </div>
              <CompaniesList 
                companies={companiesData?.data || []} 
                onCreateNew={handleCreateNew}
              />
            </>
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