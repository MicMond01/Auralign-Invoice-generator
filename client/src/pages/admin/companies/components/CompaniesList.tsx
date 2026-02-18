import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ICompany } from "@/types/api/companies";
import { ChevronRight, Download, Edit2, Filter, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/baseConfig";


const CompaniesList = ({ companies, onViewDetails, onCreateNew, isLoading }: any) => {
  
    const navigate = useNavigate()
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search companies..." 
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Button variant="secondary" className="whitespace-nowrap"><Filter size={18} className="mr-2" />All Statuses</Button>
          <Button variant="secondary" className="whitespace-nowrap"><Download size={18} className="mr-2" />Export</Button>
          <Button onClick={onCreateNew} className="whitespace-nowrap"><Plus size={18} className="mr-2" />Create New</Button>
        </div>
      </div>

      {/* Responsive List/Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Country</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                             {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-4 px-6 text-center text-slate-400">Loading companies...</td>
                  </tr>
                ) : (
                  <>
              {companies.map((company: ICompany) => (
                <tr 
                  key={company.id} 
                  className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => onViewDetails(company)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        company.id === "1" ? "bg-blue-100 text-blue-600" : 
                        company.id === "2" ? "bg-orange-100 text-orange-600" : 
                        "bg-emerald-100 text-emerald-600"
                      }`}>
                        {company.name.substring(0, 1)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{company.name}</div>
                        <div className="text-xs text-slate-500 md:hidden">{company.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 hidden md:table-cell">{company.email}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 hidden lg:table-cell">{company.country}</td>
                  <td className="py-4 px-6">
                    <Badge variant={company.isActive ? "secondary" : "destructive"}>{company.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button  onClick={() => navigate(ROUTES.COMPANY_DETAIL(company.id))} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-blue-600 hover:shadow-sm transition-all group-hover:opacity-100 md:opacity-0">
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
               </>
               
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>Showing 1-3 of 48 companies</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50">
              <ChevronRight className="rotate-180" size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-200">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors">3</button>
            <span className="px-2">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesList