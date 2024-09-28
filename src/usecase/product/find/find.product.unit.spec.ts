import ProductFactory from "@domain/product/factory/product.factory";
import FindProductUsecase from "./find.product.usecase";

const product = ProductFactory.create("a", "Product A", 100);

const input = {
  id: product.id,
}

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
}

describe("Unit Test find product usecase", () => {
  it("should find a product", async () => {
    const productRepository = MockRepository();
    const usecase = new FindProductUsecase(productRepository);

    const output = await usecase.execute(input);
    expect(output.id).toBeDefined();
    expect(output.name).toBe("Product A");
    expect(output.price).toBe(100);
  });

  it("should throw an error when product not found", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    })
    const usecase = new FindProductUsecase(productRepository);

    expect(() => usecase.execute(input)).rejects.toThrow("Product not found");
  });
});