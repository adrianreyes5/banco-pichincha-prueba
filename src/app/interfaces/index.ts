export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface Modal {
  title: string;
  showAction: boolean;
  message?: string;
}
