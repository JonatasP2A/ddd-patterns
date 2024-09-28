import Customer from "@domain/customer/entity/customer";
import Address from "@domain/customer/value-object/address";
import FindCustomerUsecase from "./find.customer.usecase";

const customer = new Customer("1", "John Doe");
const address = new Address("Main St", 123, "12345", "Springfield");
customer.changeAddress(address);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe("Unit Test find customer use case", () => {
  
  it("should find a customer", async () => {
    const customerRepository = MockRepository();
    const usecase = new FindCustomerUsecase(customerRepository);

    const input = {
      id: "1"
    };

    const output = {
      id: "1",
      name: "John Doe",
      address: {
        street: "Main St",
        city: "Springfield",
        number: 123,
        zip: "12345"
      }
    }
    
    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

  it("should not found a customer", async () => {
    const customerRepository = MockRepository();
    customerRepository.find.mockImplementation(() => {
      throw new Error("Customer not found");
    })
    const usecase = new FindCustomerUsecase(customerRepository);

    const input = {
      id: "1"
    };

    expect(() => {
      return usecase.execute(input)
    }).rejects.toThrow("Customer not found");
  })
});