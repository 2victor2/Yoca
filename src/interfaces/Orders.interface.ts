import { number } from "yup";

export interface IOrderProduct {
  quantity: number;
  productId: string;
}

export interface ICreateOrder {
  ordersProducts: IOrderProduct[];
  table: string;
  employeeId: string;
  billId: number;
}

export interface IIngredientsArray {
  ingredientId: string;
  amount: number;
}
