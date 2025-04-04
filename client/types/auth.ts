export interface GSTDetails {
  gstin: string;
  tradeName: string;
  legalName: string;
  address: string;
  status: string;
}

export interface SignupFormData extends GSTDetails {
  password: string;
  confirmPassword: string;
}
