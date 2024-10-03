import { app, sequelize } from '../express';
import request from 'supertest';

describe("E2E Test customer API", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  })

  afterAll(async () => {
    await sequelize.close();
  })

  it("should create customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "John Doe",
        address: {
          street: "Jl. Raya",
          city: "Jakarta",
          zip: "12345",
          number: 123
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John Doe");
    expect(response.body.address.street).toBe("Jl. Raya");
    expect(response.body.address.city).toBe("Jakarta");
    expect(response.body.address.zip).toBe("12345");
    expect(response.body.address.number).toBe(123);
  });

  it("should throw error when missing required field", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "John Doe"
      });

    expect(response.status).toBe(500);
  });

  it("should list all customers", async () => {
    const response1 = await request(app)
      .post("/customer")
      .send({
        name: "John Doe",
        address: {
          street: "Jl. Raya",
          city: "Jakarta",
          zip: "12345",
          number: 123
        },
      });
    expect(response1.status).toBe(200);

    const response2 = await request(app)
      .post("/customer")
      .send({
      name: "Jane Doe",
      address: {
        street: "Jl. Merdeka",
        city: "Jakarta",
        zip: "12345",
        number: 123
      },
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app)
      .get("/customer")
      .send();

    const [customer1, customer2] = listResponse.body.customers;

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.customers).toHaveLength(2);
    expect(customer1.name).toBe("John Doe");
    expect(customer1.address.street).toBe("Jl. Raya");
    expect(customer2.name).toBe("Jane Doe");
    expect(customer2.address.street).toBe("Jl. Merdeka");
  });

  it("should list all customers XML", async () => {
    const response1 = await request(app)
      .post("/customer")
      .send({
        name: "John Doe",
        address: {
          street: "Jl. Raya",
          city: "Jakarta",
          zip: "12345",
          number: 123
        },
      });
    expect(response1.status).toBe(200);

    const response2 = await request(app)
      .post("/customer")
      .send({
      name: "Jane Doe",
      address: {
        street: "Jl. Merdeka",
        city: "Jakarta",
        zip: "12345",
        number: 123
      },
      });
    expect(response2.status).toBe(200);

    const listResponseXML = await request(app)
      .get("/customer")
      .set("Accept", "application/xml")
      .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
    expect(listResponseXML.text).toContain("<customers>");
    expect(listResponseXML.text).toContain("<customer>");
    expect(listResponseXML.text).toContain("<name>John Doe</name>");
    expect(listResponseXML.text).toContain("<address>");
    expect(listResponseXML.text).toContain("<street>Jl. Raya</street>");
    expect(listResponseXML.text).toContain("<city>Jakarta</city>");
    expect(listResponseXML.text).toContain("<zip>12345</zip>");
    expect(listResponseXML.text).toContain("<number>123</number>");
    expect(listResponseXML.text).toContain("</address>");
    expect(listResponseXML.text).toContain("</customer>");

    expect(listResponseXML.text).toContain("<customer>");
    expect(listResponseXML.text).toContain("<name>Jane Doe</name>");
    expect(listResponseXML.text).toContain("<address>");
    expect(listResponseXML.text).toContain("<street>Jl. Merdeka</street>");
    expect(listResponseXML.text).toContain("<city>Jakarta</city>");
    expect(listResponseXML.text).toContain("<zip>12345</zip>");
    expect(listResponseXML.text).toContain("<number>123</number>");
    expect(listResponseXML.text).toContain("</address>");
    expect(listResponseXML.text).toContain("</customer>");
    expect(listResponseXML.text).toContain("</customers>");
  });
});