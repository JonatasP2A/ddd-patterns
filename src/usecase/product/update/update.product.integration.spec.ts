import ProductFactory from "@domain/product/factory/product.factory";
import UpdateProductUsecase from "./update.product.usecase";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "@infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "@infrastructure/product/repository/sequelize/product.repository";

const product = ProductFactory.create("a", "Product A", 100);

const input = {
  id: product.id,
  name: "Product B",
  price: 200,
};

describe("Unit Test update product usecase", () => {
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

  it("should update product", async () => {
    const productRepository = new ProductRepository();
    await productRepository.create(product);
    
    const usecase = new UpdateProductUsecase(productRepository);

    const output = await usecase.execute(input);

    expect(output.id).toBe(product.id);
    expect(output.name).toBe("Product B");
    expect(output.price).toBe(200);
  });

  it("should throw error when product not found", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUsecase(productRepository);

    const inputWithUnexistingId = {
      ...input,
      id: "Unexisting ID",
    }

    expect(() => usecase.execute(inputWithUnexistingId)).rejects.toThrow("Product not found");
  });
});