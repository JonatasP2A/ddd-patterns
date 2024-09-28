import Address from "../value-object/address"
import Customer from "./customer"

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => new Customer("", "John Doe")).toThrow("Customer: ID is required")
  })

  it("should throw error when name is empty", () => {
    expect(() => new Customer("123", "")).toThrow("Customer: Name is required")
  })

  it("should throw error when id and name is empty", () => {
    expect(() => new Customer("", "")).toThrow(
      "Customer: ID is required, Customer: Name is required"
    )
  })

  it("should change name", () => {
    const customer = new Customer("123", "John Doe")
    customer.changeName("Jane Doe")

    expect(customer.name).toBe("Jane Doe")
  })

  it("should activate customer", () => {
    const customer = new Customer("123", "John Doe")
    const address = new Address("Street 1", 123, "24220300", "Niterói")
    customer.changeAddress(address)

    customer.activate()

    expect(customer.isActive()).toBe(true)
  })

  it("should deactivate customer", () => {
    const customer = new Customer("123", "John Doe")

    customer.deactivate()

    expect(customer.isActive()).toBe(false)
  })

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("123", "John Doe")
      customer.activate()
    }).toThrow("Address is mandatory to activate a customer")
  })

  it("should add reward points", () => {
    const customer = new Customer("1", "John Doe")
    expect(customer.rewardPoints).toBe(0)

    customer.addRewardPoints(10)
    expect(customer.rewardPoints).toBe(10)

    customer.addRewardPoints(10)
    expect(customer.rewardPoints).toBe(20)
  })

})