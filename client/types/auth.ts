export interface GSTDetails {
  gstNumber: string;
  tradeName: string;
  legalName: string;
  address: string;
  status: string;
}

export interface SignupFormData extends GSTDetails {
  name: string;
  password: string;
}
