import ProductFactory from "@domain/product/factory/product.factory";
import ListProductUsecase from "./list.product.usecase";

const product1 = ProductFactory.create("a", "Product A", 100);
const product2 = ProductFactory.create("b", "Product B", 100);

const input = {}

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    create: jest.fn(),
    update: jest.fn(),
  };
}

describe("Unit Test list product usecase", () => {
  it("should list products", async () => {
    const productRepository = MockRepository();
    const usecase = new ListProductUsecase(productRepository);

    const output = await usecase.execute(input);

    expect(output.products.length).toBe(2);

    expect(output.products[0].id).toBeDefined();
    expect(output.products[0].name).toBe("Product A");
    expect(output.products[0].price).toBe(100);

    expect(output.products[1].id).toBeDefined();
    expect(output.products[1].name).toBe("Product B");
    expect(output.products[1].price).toBe(200);
  });
});