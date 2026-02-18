import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";


const DeleteConfirmation = ({ onConfirm, onCancel }: any) => (
  <div className="text-center space-y-4">
    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
      <Trash2 size={24} />
    </div>
    <div className="space-y-2">
      <p className="text-slate-600">Are you sure you want to delete this company? This action cannot be undone.</p>
    </div>
    <div className="flex justify-center gap-3 pt-4">
      <Button variant="secondary" onClick={onCancel} className="w-full">Cancel</Button>
      <Button variant="destructive" onClick={onConfirm} className="w-full">Delete</Button>
    </div>
  </div>
);


export default DeleteConfirmation