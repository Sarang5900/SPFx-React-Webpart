export interface IListItem {
  Title: string;
  Email: string;
  Phone: string;
  Password: string; 
}

export interface IRegistrationFormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  termsChecked: boolean;
  errorMessage: string | undefined;
  successMessage: string | undefined;
  showPassword: boolean;
  nameError: string | undefined;
  emailError: string | undefined;
  passwordError: string | undefined;
  phoneError: string | undefined;
  listItems: IListItem[];
  showTable: boolean;
}
