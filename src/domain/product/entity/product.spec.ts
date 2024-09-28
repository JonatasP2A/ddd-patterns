import Product from "./product"

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => new Product("", "Product 1", 100)).toThrow("Product: ID is required")
  })

  it("should throw error when name is empty", () => {
    expect(() => new Product("1", "", 100)).toThrow("Product: Name is required")
  })

  it("should throw error when price is equal or less than 0", () => {
    expect(() => new Product("1", "Product 1", -1)).toThrow("Product: Price must be greater than 0")
  })

  it("should throw error when id, name and price is equal or less than 0", () => {
    expect(() => new Product("", "", -1)).toThrow(
      "Product: ID is required, Product: Name is required, Product: Price must be greater than 0"
    )
  })

  it("should change name", () => {
    const product = new Product("1", "Product 1", 100)
    product.changeName("Product 2")
    expect(product.name).toBe("Product 2")
  })

  it("should change price", () => {
    const product = new Product("1", "Product 1", 100)
    product.changePrice(150)
    expect(product.price).toBe(150)
  })
})