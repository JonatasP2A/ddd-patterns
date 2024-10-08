import Address from "../value-object/address"
import CustomerFactory from "./customer.factory"

describe("Customer Factory unit test", () => {
  it("should create a customer", () => {
    const customer = CustomerFactory.create("John Doe")

    expect(customer.id).toBeDefined()
    expect(customer.name).toBe("John Doe")
    expect(customer.address).toBeUndefined()
  })

  it("should create a customer with address", () => {
    const address = new Address("Main St", 123, "Springfield", "12345")
    const customer = CustomerFactory.createWithAddress("John Doe", address)

    expect(customer.id).toBeDefined()
    expect(customer.name).toBe("John Doe")
    expect(customer.address).toBe(address)
  })
})