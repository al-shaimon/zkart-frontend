export interface VendorSignupData {
  password: string;
  vendor: {
    name: string;
    email: string;
    contactNumber: string;
    address: string;
  };
}

export interface CustomerSignupData {
  password: string;
  customer: {
    name: string;
    email: string;
    contactNumber: string;
    address: string;
  };
}

export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';
