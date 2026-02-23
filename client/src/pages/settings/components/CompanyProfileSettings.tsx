import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { 
  useGetCompanyByIdQuery, 
  useUpdateCompanyMutation, 
  useUploadCompanyLogoMutation, 
  useUploadCompanySignatureMutation 
} from "@/redux/api/companiesApi";
import { useAuthStore } from "@/stores/useAuthStore";

interface SettingsForm {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  accountDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  }[];
}

const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400";
const labelCls = "block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider";

function ImageUploader({ label, imageUrl, onUpload, isUploading }: { label: string, imageUrl?: string, onUpload: (file: File) => void, isUploading: boolean }) {
  return (
    <div className="space-y-2">
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-4">
        {imageUrl ? (
          <div className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden relative group">
            <img src={imageUrl} alt={label} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
            <Upload size={20} className="mb-1" />
            <span className="text-[10px] font-medium">No Image</span>
          </div>
        )}
        <div className="flex-1">
          <label className="cursor-pointer inline-block px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700 transition">
            {isUploading ? "Uploading..." : "Upload New Image"}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => {
                if (e.target.files?.[0]) onUpload(e.target.files[0]);
              }}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

const CompanyProfileSettings = () => {
  const { userCompanyId, isAdmin } = useAuthStore();
  
  const { data: companyData, isLoading } = useGetCompanyByIdQuery(userCompanyId, {
    skip: !userCompanyId || isAdmin, // Admin manages companies separately usually, but could use this if they have an active company
  });

  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const [uploadLogo, { isLoading: isUploadingLogo }] = useUploadCompanyLogoMutation();
  const [uploadSignature, { isLoading: isUploadingSig }] = useUploadCompanySignatureMutation();

  const company = companyData?.data?.company;

  const { register, handleSubmit, reset, watch, setValue } = useForm<SettingsForm>();

  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        email: company.email || "",
        phone: company.phone || "",
        website: company.website || "",
        address: company.address || "",
        city: company.city || "",
        country: company.country || "",
        accountDetails: company.accountDetails?.length ? company.accountDetails : [{ bankName: "", accountNumber: "", accountName: "" }]
      });
    }
  }, [company, reset]);

  const onSubmit = async (data: SettingsForm) => {
    if (!company) return;
    try {
      await updateCompany({ id: company._id, data }).unwrap();
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Error updating profile");
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!company) return;
    try {
      await uploadLogo({ id: company._id, file }).unwrap();
      toast.success("Logo uploaded");
    } catch {
      toast.error("Failed to upload logo");
    }
  };

  const handleSigUpload = async (file: File) => {
    if (!company) return;
    try {
      await uploadSignature({ id: company._id, file }).unwrap();
      toast.success("Signature uploaded");
    } catch {
      toast.error("Failed to upload signature");
    }
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse text-slate-400">Loading Profile...</div>;
  if (!company) return <div className="p-8 text-center text-slate-500">No company profile found.</div>;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Company Settings</h2>
        <p className="text-sm text-slate-500">Manage your company's public profile and invoice assets.</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 bg-slate-50/50">
        <ImageUploader 
          label="Company Logo" 
          imageUrl={company.logo} 
          onUpload={handleLogoUpload} 
          isUploading={isUploadingLogo} 
        />
        <ImageUploader 
          label="Authorized Signature" 
          imageUrl={company.signature} 
          onUpload={handleSigUpload} 
          isUploading={isUploadingSig} 
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Company Name *</label>
            <input {...register("name", { required: true })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input type="email" {...register("email")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input {...register("phone")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Website</label>
            <input {...register("website")} placeholder="https://" className={inputCls} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Street Address</label>
            <input {...register("address")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input {...register("city")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Country</label>
            <input {...register("country")} className={inputCls} />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">Receiving Account Details</h3>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Bank Name</label>
              <input {...register("accountDetails.0.bankName")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Account Number</label>
              <input {...register("accountDetails.0.accountNumber")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Account Holder Name</label>
              <input {...register("accountDetails.0.accountName")} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isUpdating}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfileSettings;
