export interface ICompanies {
  success: boolean;
  message: string;
  data: ICompany[];
  pagination: Pagination;
}

export interface ICompany {
  _id: string;
  userId: UserId;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  primaryColor: string;
  accountDetails: AccountDetail[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface UserId {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AccountDetail {
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
  _id: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ICompanyResponse {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  company: ICompany;
}

// export interface Company {
//   _id: string;
//   userId: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   primaryColor: string;
//   accountDetails: AccountDetail[];
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   id: string;
// }

// export interface AccountDetail {
//   bankName: string;
//   accountNumber: string;
//   accountName: string;
//   isPrimary: boolean;
//   _id: string;
// }
