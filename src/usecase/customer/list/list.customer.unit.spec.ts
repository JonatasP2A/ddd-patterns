import CustomerFactory from "@domain/customer/factory/customer.factory";
import Address from "@domain/customer/value-object/address";
import ListCustomerUseCase from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress(
  'John Doe',
  new Address('Main St', 123, '12345', 'Springfield')
);

const customer2 = CustomerFactory.createWithAddress(
  'Jane Doe',
  new Address('Elm St', 456, '54321', 'Springfield 2')
);

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe('Unit Test list customer usecase', () => {
  it('should list customers', async () => {
    const customerRepository = MockRepository();
    const usecase = new ListCustomerUseCase(customerRepository);

    const output = await usecase.execute({});

    expect(output.customers.length).toBe(2);

    expect(output.customers[0].id).toBe(customer1.id);
    expect(output.customers[0].name).toBe(customer1.name);
    expect(output.customers[0].address.street).toBe(customer1.address.street);
    expect(output.customers[0].address.number).toBe(customer1.address.number);
    expect(output.customers[0].address.zip).toBe(customer1.address.zip);
    expect(output.customers[0].address.city).toBe(customer1.address.city);

    expect(output.customers[1].id).toBe(customer2.id);
    expect(output.customers[1].name).toBe(customer2.name);
    expect(output.customers[1].address.street).toBe(customer2.address.street);
    expect(output.customers[1].address.number).toBe(customer2.address.number);
    expect(output.customers[1].address.zip).toBe(customer2.address.zip);
    expect(output.customers[1].address.city).toBe(customer2.address.city);
  });
});