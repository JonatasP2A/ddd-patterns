import CustomerRepositoryInterface from "@domain/customer/repository/customer-repository.interface"
import { InputListCustomerDto, OutputListCustomerDto } from "./list.customer.dto"
import Customer from "@domain/customer/entity/customer"

export default class ListCustomerUseCase {
  constructor(private customerRepository: CustomerRepositoryInterface) {}

  async execute(input: InputListCustomerDto): Promise<OutputListCustomerDto> {
    const customers = await this.customerRepository.findAll()
    return OutputMapper.toOutput(customers)
  }
}

class OutputMapper {
  static toOutput(customers: Customer[]): OutputListCustomerDto {
    return {
      customers: customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        address: {
          street: customer.address.street,
          number: customer.address.number,
          zip: customer.address.zip,
          city: customer.address.city
        }
      }))
    }
  }
}