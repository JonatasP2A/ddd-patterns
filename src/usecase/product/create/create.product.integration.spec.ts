import CreateProductUseCase from "./create.product.usecase";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "@infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "@infrastructure/product/repository/sequelize/product.repository";

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

describe("Unit Test create product usecase", () => {
  let sequelize: Sequelize;

  beforeEach( async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  })

  afterEach(async () => {
    await sequelize.close();
  })

  it("should create a product type A", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const output = await usecase.execute(inputTypeA);
    expect(output.id).toBeDefined();
    expect(output.name).toBe("Product A");
    expect(output.price).toBe(100);
  });

  it("should create a product type B", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const output = await usecase.execute(inputTypeB);
    
    expect(output.id).toBeDefined();
    expect(output.name).toBe("Product B");
    expect(output.price).toBe(200);
  });

  it("should throw an error when creating a product with invalid type", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      type: "c",
      name: "Product C",
      price: 100,
    };

    expect(() => usecase.execute(input)).rejects.toThrow("Invalid product type");
  });

  it("should throw an error when creating a product with invalid name", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const inputWithoutName = {
      ...inputTypeA,
      name: "",
    };

    expect(() => usecase.execute(inputWithoutName)).rejects.toThrow("Name is required");
  });

  it("should throw an error when creating a product with invalid price", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const inputWithoutPrice = {
      ...inputTypeA,
      price: 0,
    };

    expect(() => usecase.execute(inputWithoutPrice)).rejects.toThrow("Price must be greater than 0");
  });
});