import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import { useGetUsersQuery, useDeleteUserMutation } from "@/redux/api/usersApi";
import { TOAST_CONFIG } from "@/config/baseConfig";
import DataTable from "@/components/tables/DataTable";

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetUsersQuery({ page, pageSize: 10 });
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: "Dashboard", path: "/dashboard" }, { label: "Users" }]));
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(TOAST_CONFIG.MESSAGES.FETCH_ERROR);
  }, [error]);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success(TOAST_CONFIG.MESSAGES.DELETE_SUCCESS);
    } catch {
      toast.error(TOAST_CONFIG.MESSAGES.DELETE_ERROR);
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
        ]}
        data={data?.data ?? []}
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
