import { create } from "zustand";
import type { Customer } from "@/redux/api/customersApi";

interface CustomerModalState {
  isOpen: boolean;
  editingCustomer: Customer | null;
  openCreate: () => void;
  openEdit: (customer: Customer) => void;
  close: () => void;
}

export const useCustomerModalStore = create<CustomerModalState>((set) => ({
  isOpen: false,
  editingCustomer: null,
  openCreate: () => set({ isOpen: true, editingCustomer: null }),
  openEdit: (customer) => set({ isOpen: true, editingCustomer: customer }),
  close: () => set({ isOpen: false, editingCustomer: null }),
}));
