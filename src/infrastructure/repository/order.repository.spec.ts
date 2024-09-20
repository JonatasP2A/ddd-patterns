import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("OrderRepository test", () => {
  let sequelize: Sequelize;

  beforeEach( async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  })

  beforeEach(async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
  })

  afterEach(async () => {
    await sequelize.close();
  })

  it("should create a new order", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const updatedOrder = new Order("123", "123", [
      new OrderItem("1", "Product 1", 10, "123", 3),
    ]);

    await orderRepository.update(updatedOrder);

    const orderModel = await OrderModel.findOne({
      where: { id: updatedOrder.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: updatedOrder.total(),
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
          quantity: 3,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find an order", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);

    expect(order).toStrictEqual(foundOrder);
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();

    await expect(orderRepository.find("Unexisting ID")).rejects.toThrow("Order not found");
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer2 = new Customer("456", "Customer 2");
    const address = new Address("Street 2", 1, "Zipcode 2", "City 2");
    customer2.changeAddress(address);
    await customerRepository.create(customer2);

    const productRepository = new ProductRepository();
    const product1 = new Product("123", "Product 1", 10);
    await productRepository.create(product1);

    const product2 = new Product("456", "Product 2", 20);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      1
    );

    const order1 = new Order("123", "123", [orderItem1]);
    const order2 = new Order("456", "456", [orderItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();

    expect(foundOrders).toHaveLength(2);
    expect(foundOrders).toContainEqual(order1);
    expect(foundOrders).toContainEqual(order2);
  });
})