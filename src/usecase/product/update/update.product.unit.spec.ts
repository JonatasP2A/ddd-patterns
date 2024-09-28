import ProductFactory from "@domain/product/factory/product.factory";
import UpdateProductUsecase from "./update.product.usecase";

const product = ProductFactory.create("a", "Product A", 100);

const input = {
  id: product.id,
  name: "Product B",
  price: 200,
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
}

describe("Unit Test update product usecase", () => {
  it("should update product", async () => {
    const productRepository = MockRepository();
    const usecase = new UpdateProductUsecase(productRepository);

    const output = await usecase.execute(input);

    expect(output.id).toBe(product.id);
    expect(output.name).toBe("Product B");
    expect(output.price).toBe(200);
  });

  it("should throw error when product not found", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    })
    const usecase = new UpdateProductUsecase(productRepository);

    expect(() => usecase.execute(input)).rejects.toThrow("Product not found");
  });
});