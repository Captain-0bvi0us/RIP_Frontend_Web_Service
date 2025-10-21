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