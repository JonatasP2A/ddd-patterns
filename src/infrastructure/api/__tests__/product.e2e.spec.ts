import { app, sequelize } from '../express';
import request from 'supertest';

describe("E2E Test product API", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  })

  afterAll(async () => {
    await sequelize.close();
  })

  it("should create product type A", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Product 1",
        price: 1000,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.price).toBe(1000);
  });

  it("should create product type B", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "b",
        name: "Product 2",
        price: 1000,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 2");
    expect(response.body.price).toBe(2000);
  });

  it("should throw error when missing required field", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Product 1"
      });

    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const response1 = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Product 1",
        price: 1000,
      });
    expect(response1.status).toBe(200);

    const response2 = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Product 2",
        price: 2000,
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app)
      .get("/product");

    const [product1, product2] = listResponse.body.products;
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);

    expect(product1.name).toBe("Product 1");
    expect(product1.price).toBe(1000);
    expect(product2.name).toBe("Product 2");
    expect(product2.price).toBe(2000);
  });
});