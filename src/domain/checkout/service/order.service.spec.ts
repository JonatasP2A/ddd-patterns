import Customer from "../../customer/entity/customer"
import Order from "../entity/order"
import OrderItem from "../entity/order_item"
import OrderService from "./order.service"

describe("OrderService unit tests", () => {
  it("should place an order", () => {
    const customer = new Customer("c1", "Customer 1")
    const item1 = new OrderItem("1", "item 1", 10, "p1", 1)
    const order = OrderService.placeOrder(customer, [item1])

    expect(customer.rewardPoints).toBe(5)
    expect(order.total()).toBe(10)
  })

  it("should get total of all orders", () => {
    // Arrange
    const order1 = new Order("o1", "c1", [new OrderItem("1", "item 1", 100, "p1", 1)])
    const order2 = new Order("o2", "c1", [new OrderItem("2", "item 2", 200, "p2", 2)])
    const orders = [order1, order2]
    // Act
    const total = OrderService.total(orders)
    // Assert
    expect(total).toBe(500)
  })
})