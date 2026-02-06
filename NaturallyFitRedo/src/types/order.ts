export interface AccountOrderItem {
  name: string;
  quantity: number;
  total: number;
}

export interface AccountOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: AccountOrderItem[];
  itemCount: number;
}

export interface AccountOrdersResponse {
  orders: AccountOrder[];
}
