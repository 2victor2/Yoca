import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";

import Employee from "./Employee.model";

import Bill from "./Bill.model";
import OrderProduct from "./OrdersProducts.model";
import { Exclude, Expose } from "class-transformer";
import { IOrderProducts } from "../interfaces/Orders.interface";

@Entity("orders")
export default class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  table: string;

  @Column()
  status: string;

  @Column()
  total: number;

  
  @Column()
  employeeId: string;

  @Exclude()
  @ManyToOne(() => Employee, { eager: true })
  employee: Employee;

  @Column()
  billId: number;

  @ManyToOne(() => Bill)
  bill: Bill;

  @Exclude()
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    eager: true,
  })
  orderProducts: OrderProduct[];

  @Expose({ name: "products" })
  getProducts(): IOrderProducts[] {
    return this.orderProducts?.map(({ quantity, totalPrice, product }) => ({
      quantity,
      totalPrice,
      product,
    }));
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
