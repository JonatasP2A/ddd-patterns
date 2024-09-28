import ProductFactory from "@domain/product/factory/product.factory";
import CreateProductUseCase from "./create.product.usecase";

const productA = ProductFactory.create("a", "Product A", 100);
const productB = ProductFactory.create("b", "Product B", 100);

const inputTypeA = {
  type: "a",
  name: "Product A",
  price: 100,
};

const inputTypeB = {
  type: "b",
  name: "Product B",
  price: 100,
};

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn().mockReturnValue(Promise.resolve(productA)),
    update: jest.fn(),
  };
}

describe("Unit Test create product usecase", () => {
  it("should create a product type A", async () => {
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const output = await usecase.execute(inputTypeA);
    expect(output.id).toBeDefined();
    expect(output.name).toBe("Product A");
    expect(output.price).toBe(100);
  });

  it("should create a product type B", async () => {
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    productRepository.create.mockReturnValueOnce(Promise.resolve(productB));

    const output = await usecase.execute(inputTypeB);
    
    expect(output.id).toBeDefined();
    expect(output.name).toBe("Product B");
    expect(output.price).toBe(200);
  });

  it("should throw an error when creating a product with invalid type", async () => {
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      type: "c",
      name: "Product C",
      price: 100,
    };

    expect(() => usecase.execute(input)).rejects.toThrow("Invalid product type");
  });

  it("should throw an error when creating a product with invalid name", async () => {
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const inputWithoutName = {
      ...inputTypeA,
      name: "",
    };

    expect(() => usecase.execute(inputWithoutName)).rejects.toThrow("Name is required");
  });

  it("should throw an error when creating a product with invalid price", async () => {
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const inputWithoutPrice = {
      ...inputTypeA,
      price: 0,
    };

    expect(() => usecase.execute(inputWithoutPrice)).rejects.toThrow("Price must be greater than 0");
  });
});