import ProductFactory from "@domain/product/factory/product.factory";
import ListProductUsecase from "./list.product.usecase";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "@infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "@infrastructure/product/repository/sequelize/product.repository";

const product1 = ProductFactory.create("a", "Product A", 100);
const product2 = ProductFactory.create("b", "Product B", 100);

const input = {}

describe("Unit Test list product usecase", () => {
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

  it("should list products", async () => {
    const productRepository = new ProductRepository();
    await productRepository.create(product1);
    await productRepository.create(product2);
    
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