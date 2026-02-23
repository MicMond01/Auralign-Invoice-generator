import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CompanyForm = ({ defaultValues, onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState(defaultValues || {
    name: "", email: "", phone: "", website: "", address: "", city: "", country: "", status: "Active",
    accountDetails: [{ bankName: "", accountNumber: "", accountName: "", isPrimary: true }]
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAccountChange = (e: any, index: number) => {
    const updatedAccounts = [...formData.accountDetails];
    updatedAccounts[index] = { ...updatedAccounts[index], [e.target.name]: e.target.value };
    setFormData({ ...formData, accountDetails: updatedAccounts });
  };

  return (
    <div className="space-y-4">
            <Field className="max-w-sm">
      <FieldLabel htmlFor="name">Company Name</FieldLabel>
      <Input  id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Acme Corp" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
          <Field className="max-w-sm">
      <FieldLabel htmlFor="name">Email</FieldLabel>
        <Input name="email" value={formData.email} onChange={handleChange} placeholder="contact@company.com" />
        </Field>
          <Field className="max-w-sm">
      <FieldLabel htmlFor="name">Phone</FieldLabel>
        <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 ..." />
        </Field>
      </div>
        <Field className="max-w-sm">
      <FieldLabel htmlFor="website">Website</FieldLabel>
      <Input name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
      </Field>
       <Field className="max-w-sm">
      <FieldLabel htmlFor="address">Address</FieldLabel>
      <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Street address" />
      </Field>
      
      <div className="grid grid-cols-2 gap-4">
          <Field className="max-w-sm">
      <FieldLabel htmlFor="city">City</FieldLabel>
        <Input name="city" value={formData.city} onChange={handleChange} placeholder="City name" />
        </Field>
          <Field className="max-w-sm">
      <FieldLabel htmlFor="country">Country</FieldLabel>
        <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country name" />
        </Field>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Primary Account Details</h4>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <Field className="max-w-sm">
            <FieldLabel htmlFor="bankName">Bank Name *</FieldLabel>
            <Input name="bankName" value={formData.accountDetails[0]?.bankName} onChange={(e) => handleAccountChange(e, 0)} placeholder="e.g. Chase Bank" required />
          </Field>
          <Field className="max-w-sm">
            <FieldLabel htmlFor="accountNumber">Account Number *</FieldLabel>
            <Input name="accountNumber" value={formData.accountDetails[0]?.accountNumber} onChange={(e) => handleAccountChange(e, 0)} placeholder="1234567890" required />
          </Field>
        </div>
        <Field className="max-w-sm">
          <FieldLabel htmlFor="accountName">Account Name *</FieldLabel>
          <Input name="accountName" value={formData.accountDetails[0]?.accountName} onChange={(e) => handleAccountChange(e, 0)} placeholder="Acme Corp LLC" required />
        </Field>
      </div>
      
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Status</label>
        <select 
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none bg-white text-sm"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-4">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit(formData)}>Save Changes</Button>
      </div>
    </div>
  );
};

export default CompanyForm