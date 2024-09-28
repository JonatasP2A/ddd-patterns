import Customer from "@domain/customer/entity/customer";
import Address from "@domain/customer/value-object/address";
import CustomerModel from "@infrastructure/customer/respository/sequelize/customer.model";
import CustomerRepository from "@infrastructure/customer/respository/sequelize/customer.repository";
import { Sequelize } from "sequelize-typescript";
import FindCustomerUsecase from "./find.customer.usecase";

describe("Test find customer use case", () => {
  let sequelize: Sequelize;

  beforeEach( async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  })

  afterEach(async () => {
    await sequelize.close();
  })

  it("should find a customer", async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new FindCustomerUsecase(customerRepository);

    const customer = new Customer("1", "John Doe");
    const address = new Address("Main St", 123, "12345", "Springfield");
    customer.changeAddress(address);
    await customerRepository.create(customer);

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
});