import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "./customer.repository";
import CustomerModel from "./customer.model";
import Customer from "@domain/customer/entity/customer";
import Address from "@domain/customer/value-object/address";

describe("CustomerRepository test", () => {
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

  it("should create a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "John Doe");
    const address = new Address("Main St", 123, "12345", "Springfield");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "1",
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      city: address.city,
      zipcode: address.zip
    })
  })

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Main St", 123, "12345", "Springfield");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    let customerModel = await CustomerModel.findOne({ where: { id: "1" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "1",
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      city: address.city,
      zipcode: address.zip
    })

    customer.changeName("Customer 2");

    await customerRepository.update(customer);

    customerModel = await CustomerModel.findOne({ where: { id: "1" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "1",
      name: "Customer 2",
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      city: address.city,
      zipcode: address.zip
    })
  })

  it("should find a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Main St", 123, "12345", "Springfield");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const foundCustomer = await customerRepository.find(customer.id);

    expect(customer).toStrictEqual(foundCustomer);
  })

  it("should throw an error when customer is not found", async () => {
    const customerRepository = new CustomerRepository();

    expect(async () => {
      await customerRepository.find("Unexpected ID");
    }).rejects.toThrow("Customer not found");
  })

  it("should find all customers", async () => {
    const customerRepository = new CustomerRepository();
    const customer1 = new Customer("1", "Customer 1");
    const address1 = new Address("Main St", 123, "12345", "Springfield");
    customer1.changeAddress(address1);
    customer1.addRewardPoints(10);

    const customer2 = new Customer("2", "Customer 2");
    const address2 = new Address("Main St", 456, "67890", "Springfield");
    customer2.changeAddress(address2);
    customer2.addRewardPoints(20);

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const foundCustomers = await customerRepository.findAll();

    expect(foundCustomers.length).toBe(2);
    expect(foundCustomers).toContainEqual(customer1);
    expect(foundCustomers).toContainEqual(customer2);
  })
})