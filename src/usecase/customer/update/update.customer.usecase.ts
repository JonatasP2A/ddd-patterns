import CustomerRepositoryInterface from "@domain/customer/repository/customer-repository.interface";
import { InputUpdateCustomerDTO, OutputUpdateCustomerDTO } from "./update.customer.dto";
import Address from "@domain/customer/value-object/address";

export default class UpdateCustomerUseCase {
  constructor(private customerRepository: CustomerRepositoryInterface) {}

  async execute(input: InputUpdateCustomerDTO): Promise<OutputUpdateCustomerDTO> {
    const customer = await this.customerRepository.find(input.id);
    customer.changeName(input.name);
    customer.changeAddress(
      new Address(
        input.address.street, 
        input.address.number, 
        input.address.zip, 
        input.address.city
      )
    );
    await this.customerRepository.update(customer);

    return {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.address.street,
        number: customer.address.number,
        zip: customer.address.zip,
        city: customer.address.city
      }
    };
  }
}