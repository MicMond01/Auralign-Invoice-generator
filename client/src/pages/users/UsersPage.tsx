import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Power, KeyRound, PowerOff } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
  useResetUserPasswordMutation
} from "@/redux/api/adminApi";
import { TOAST_CONFIG } from "@/config/baseConfig";
import DataTable from "@/components/tables/DataTable";

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [activateUser] = useActivateUserMutation();
  const [resetUserPassword] = useResetUserPasswordMutation();

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: "Dashboard", path: "/dashboard" }, { label: "Users" }]));
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(TOAST_CONFIG.MESSAGES.FETCH_ERROR);
  }, [error]);

  const handleDelete = async (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this user?")) {
        await deleteUser(id).unwrap();
        toast.success(TOAST_CONFIG.MESSAGES.DELETE_SUCCESS);
      }
    } catch {
      toast.error(TOAST_CONFIG.MESSAGES.DELETE_ERROR);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateUser(id).unwrap();
      toast.success("User deactivated");
    } catch {
      toast.error("Error deactivating user");
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateUser(id).unwrap();
      toast.success("User activated");
    } catch {
      toast.error("Error activating user");
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      await resetUserPassword(id).unwrap();
      toast.success("Password reset initiated");
    } catch {
      toast.error("Error resetting password");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all platform users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus size={16} /> Add User
        </button>
      </div>
      <DataTable
        columns={[
          { key: "firstName", label: "First Name" },
          { key: "lastName",  label: "Last Name"  },
          { key: "email",     label: "Email"       },
          { key: "role",      label: "Role"        },
          { 
            key: "isActive",  
            label: "Status",
            render: (row: any) => (
              <span className={`px-2 py-1 rounded text-xs font-medium ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {row.isActive ? 'Active' : 'Deactivated'}
              </span>
            )
          },
          {
            key: "actions",
            label: "Actions",
            render: (row: any) => (
              <div className="flex gap-2">
                {row.isActive ? (
                  <button onClick={() => handleDeactivate(row._id)} title="Deactivate" className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <PowerOff size={16} />
                  </button>
                ) : (
                  <button onClick={() => handleActivate(row._id)} title="Activate" className="p-1 text-green-600 hover:bg-green-50 rounded">
                    <Power size={16} />
                  </button>
                )}
                <button onClick={() => handleResetPassword(row._id)} title="Reset Password" className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                  <KeyRound size={16} />
                </button>
              </div>
            )
          }
        ]}
        data={(data?.data?.users as any) ?? []}
        isLoading={isLoading}
        onDelete={handleDelete}
        totalPages={data?.meta?.totalPages ?? 1}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default UsersPage;
