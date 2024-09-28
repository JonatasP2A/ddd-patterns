import CreateCustomerUseCase from "./create.customer.usecase";

const input = {
  name: "John Doe",
  address: {
    street: "Main St",
    number: 123,
    zip: "12345",
    city: "Springfield"
  }
}

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe("Unit Test create customer usecase", () => {
  it("should create a customer", async () => {
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    const output = await usecase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      address: {
        street: input.address.street,
        number: input.address.number,
        zip: input.address.zip,
        city: input.address.city
      }
    })
  });

  it("should throw an error if name is missing", async () => {
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    input.name = "";

    await expect(usecase.execute(input)).rejects.toThrow("Name is required");
  });

  it("should throw an error if street is missing", async () => {
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    input.address.street = "";

    await expect(usecase.execute(input)).rejects.toThrow("Street is required");
  });
})