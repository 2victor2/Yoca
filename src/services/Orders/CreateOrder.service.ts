import { In } from "typeorm";
import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { ICreateOrder } from "../../interfaces/Orders.interface";
import Bill from "../../models/Bill.model";
import Employee from "../../models/Employee.model";
import Order from "../../models/Order.model";
import OrderProduct from "../../models/OrdersProducts.model";
import Product from "../../models/Product.model";

class CreateOrderService {
  static async execute({
    ordersProducts,
    table,
    employeeId,
    billId,
  }: ICreateOrder): Promise<Order> {
    const orderRepo = AppDataSource.getRepository(Order);
    const productsRepo = AppDataSource.getRepository(Product);
    const employeeRepo = AppDataSource.getRepository(Employee);
    const orderProductRepo = AppDataSource.getRepository(OrderProduct);
    const billsRepo = AppDataSource.getRepository(Bill);

    const productsIds = [
      ...new Set(ordersProducts.map(({ productId }) => productId)),
    ];
    const products = await productsRepo.findBy({
      id: In(productsIds),
    });

    if (products.length !== productsIds.length) {
      throw new AppError("Invalid list of ids", 400);
    }

    const employee = await employeeRepo.findOneBy({
      id: employeeId,
    });

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    const bill = await billsRepo.findOneBy({
      id: billId,
    });

    if (!bill) {
      throw new AppError("Bill not found", 404);
    }

    const order = orderRepo.create({
      table,
      employeeId,
      billId,
      total: 0,
      status: "pending",
    });

    await orderRepo.save(order);

    ordersProducts.forEach(async ({ productId, quantity }) => {
      const orderProduct = orderProductRepo.create({
        orderId: order.id,
        productId,
        totalPrice: 0,
        quantity,
      });

      await orderProductRepo.save(orderProduct);
    });

    return order;
  }
}

export default CreateOrderService;
