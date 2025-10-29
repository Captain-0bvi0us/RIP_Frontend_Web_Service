export interface IFactor {
  id: number;
  title: string;
  text: string;
  image?: string;
  argument?: number;
  status?: boolean;
}

export interface IPaginatedFactors {
  items: IFactor[];
  total: number;
}

export interface ICrumb {
  label: string;
  path?: string;
  active?: boolean;
}

export interface ICartBadge {
    frax_id: number | null;
    count: number;
}
