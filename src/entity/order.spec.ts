import Order from "./order"
import OrderItem from "./order_item"

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => new Order("", "123", [])).toThrow("ID is required")
  })

  it("should throw error when customerId is empty", () => {
    expect(() => new Order("1", "", [])).toThrow("CustomerID is required")
  })

  it("should throw error when items list is empty", () => {
    expect(() => new Order("1", "123", [])).toThrow("Item qtd must be greater than 0")
  })

  it("should calculate total", () => {
    const items = [
      new OrderItem("1", "Item 1", 20),
      new OrderItem("2", "Item 2", 10),
      new OrderItem("3", "Item 3", 30),
    ]
    const order = new Order("1", "123", items)

    expect(order.total()).toBe(60)
  })
})