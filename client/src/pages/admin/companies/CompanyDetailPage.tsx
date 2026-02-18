import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, Calendar, ChevronRight, CreditCard, Edit2, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCompanyByIdQuery } from "@/redux/api/adminApi";
import Modal from "./components/Model";
import DeleteConfirmation from "@/components/modals/DeleteConfirmation";
import { useState } from "react";
import { ROUTES } from "@/config/baseConfig";
import CompanyForm from "./components/CompanyForm";
import { ICompany } from "@/types/api/companies";

const CompanyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: companyData, isLoading, error } = useGetCompanyByIdQuery(id || "", {
    skip: !id,
  });

  const company = companyData?.data?.data.company;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const confirmDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (_data: Partial<ICompany>) => {
    // TODO: Implement form submission
  };

  const handleBack = () => {
    navigate(ROUTES.COMPANIES);
  };

  const handleEdit = () => {
    setIsFormOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading company details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Company Not Found</h2>
          <p className="text-slate-500 mb-4">The company you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={handleBack}>Back to Companies</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => navigate(ROUTES.COMPANIES)} className="hover:text-blue-600 transition-colors">Companies</button>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium">{company.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={confirmDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"><Trash2 size={16} className="mr-2" />Delete</Button>
          <Button onClick={() => setIsFormOpen(true)}><Edit2 size={16} className="mr-2" />Edit Profile</Button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-[#F3EFE7] flex items-center justify-center shrink-0 relative">
          <Building2 className="text-[#A89F8B]" size={32} />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-white ${company.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-slate-900">{company.name}</h1>
            <Badge variant={company.isActive ? "secondary" : "destructive"}>{company.isActive ? "Active" : "Inactive"}</Badge>
       
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">#</span> ID: {company.id}-ACME
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} /> Tech & Services
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> Client since {new Date(company.createdAt).getFullYear()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: General Info & Location */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm relative group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">General Information</h3>
              <button onClick={() => setIsFormOpen(true)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-colors">
                <Edit2 size={16} />
              </button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-y-8 gap-x-4 mb-8">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                <div className="text-slate-900 font-medium">{company.email}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
                <div className="text-slate-900 font-medium">{company.phone}</div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Website</label>
                <a href={"https://"+company} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                  {`https://${company.name}.com`} <ChevronRight size={12} className="-rotate-45" />
                </a>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">About</label>
              <p className="text-slate-600 leading-relaxed text-sm">
                {"about us"}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="p-6 sm:p-8 flex-1 space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Location</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Address Line 1</label>
                  <div className="text-slate-900 font-medium">{company.address}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">City & State</label>
                  <div className="text-slate-900 font-medium">{company.city}, {company.state}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Country</label>
                    <div className="text-slate-900 font-medium">{company.country}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Fake Map */}
            <div className="w-full md:w-1/3 bg-[#A4C2B8] relative min-h-[200px]">
              <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/San_Francisco_map.png')] bg-cover bg-center mix-blend-multiply" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-600 rounded-full ring-4 ring-white shadow-lg animate-bounce" />
                <div className="w-32 bg-white/90 backdrop-blur text-[10px] font-bold text-center py-1 px-2 rounded-lg shadow-sm mt-2 transform -translate-x-1/3">
                  123 Innovation Dr
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Account & Signatures */}
        <div className="space-y-6">
          {/* Account Details */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" /> Account Details
              </h3>
              <button className="text-blue-600 text-xs font-bold hover:underline">Add New</button>
            </div>

            <div className="space-y-4">
              {company.accountDetails.length > 0 ? company.accountDetails.map((acc: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/30 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-blue-600">
                        <Building2 size={16} />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{acc.bankName}</span>
                    </div>
                    {acc.isPrimary && (
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] uppercase font-bold rounded">Primary</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 uppercase font-medium">Account Number</div>
                    <div className="text-slate-900 font-mono text-sm tracking-wider">{acc.accountNumber}</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/50">
                     <div className="text-xs text-slate-400 uppercase font-medium">Account Holder</div>
                     <div className="text-sm font-medium text-slate-700">{acc.accountName}</div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-400 text-sm">No accounts linked</div>
              )}
            </div>
          </div>

          {/* Authorized Signature */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Authorized Signature</h3>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50/50">
               <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center mb-2">
                 <span className="font-cursive text-2xl text-slate-400 italic">Sign</span>
               </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Created At</span>
                <span className="font-medium text-slate-900">Oct 12, 2023</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Last Updated</span>
                <span className="font-medium text-slate-900">2 hours ago</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-slate-500">Created By</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-200" />
                  <span className="font-medium text-slate-900">John Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Create/Edit Modal */}
            <Modal 
              isOpen={isFormOpen} 
              onClose={() => setIsFormOpen(false)} 
              title={"Edit Company Profile"}
            >
              <CompanyForm 
                defaultValues={company} 
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

export default CompanyDetailPage