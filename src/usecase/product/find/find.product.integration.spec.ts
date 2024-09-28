import ProductFactory from "@domain/product/factory/product.factory";
import FindProductUsecase from "./find.product.usecase";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "@infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "@infrastructure/product/repository/sequelize/product.repository";

describe("Unit Test find product usecase", () => {
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

  it("should find a product", async () => {
    const product = ProductFactory.create("a", "Product A", 100);
    
    const productRepository = new ProductRepository();
    await productRepository.create(product);
    
    const usecase = new FindProductUsecase(productRepository);
    
    const input = {
      id: product.id,
    }

    const output = await usecase.execute(input);
    expect(output.id).toBeDefined();
    expect(output.name).toBe("Product A");
    expect(output.price).toBe(100);
  });

  it("should throw an error when product not found", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUsecase(productRepository);

    expect(() => usecase.execute({ id: "Unexisting ID" })).rejects.toThrow("Product not found");
  });
});