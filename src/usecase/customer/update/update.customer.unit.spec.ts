import CustomerFactory from "@domain/customer/factory/customer.factory";
import Address from "@domain/customer/value-object/address";
import UpdateCustomerUseCase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress(
  "John Doe",
  new Address("Main St", 123, "12345", "Springfield")
);

const input = {
  id: customer.id,
  name: "Jane Doe",
  address: {
    street: "Elm St",
    number: 456,
    zip: "54321",
    city: "Springfield 2"
  }
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test update customer usecase", () => {
  it("should update a customer", async () => {
    const customerRepository = MockRepository();
    const usecase = new UpdateCustomerUseCase(customerRepository);

    const output = await usecase.execute(input);

    expect(output).toEqual(input);
  });

  it("should throw an error if customer is not found", async () => {
    const customerRepository = MockRepository();
    const usecase = new UpdateCustomerUseCase(customerRepository);

    customerRepository.find.mockImplementation(() => {
      throw new Error("Customer not found");
    })

    await expect(usecase.execute(input)).rejects.toThrow("Customer not found");
  });

  it("should throw an error if street is missing", async () => {
    const customerRepository = MockRepository();
    const usecase = new UpdateCustomerUseCase(customerRepository);

    const inputWithoutStreet = {
      id: customer.id,
      name: "Jane Doe",
      address: {
        street: "",
        number: 456,
        zip: "54321",
        city: "Springfield 2"
      }
    };

    await expect(usecase.execute(inputWithoutStreet)).rejects.toThrow(
      "Street is required"
    );
  });

  it("should throw an error if name is missing", async () => {
    const customerRepository = MockRepository();
    const usecase = new UpdateCustomerUseCase(customerRepository);

    const inputWithoutName = { ...input, name: "" };

    await expect(usecase.execute(inputWithoutName)).rejects.toThrow(
      "Customer: Name is required"
    );
  });
});