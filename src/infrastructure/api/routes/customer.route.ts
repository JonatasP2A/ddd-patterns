import express, { Request, Response } from 'express';
import CreateCustomerUseCase from '../../../usecase/customer/create/create.customer.usecase';
import CustomerRepository from '@infrastructure/customer/respository/sequelize/customer.repository';
import ListCustomerUseCase from '../../../usecase/customer/list/list.customer.usecase';

export const customerRoute = express.Router();

customerRoute.post('/', async (req: Request, res: Response) => {
  const customerRepository = new CustomerRepository();
  const usecase = new CreateCustomerUseCase(customerRepository);

  try {
    const { name, address } = req.body;

    const customerDto = {
      name: name,
      address: {
        street: address.street,
        city: address.city,
        zip: address.zip,
        number: address.number,
      }
    };
    
    const output = await usecase.execute(customerDto);

    res.send(output);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

customerRoute.get('/', async (req: Request, res: Response) => {
  const customerRepository = new CustomerRepository();
  const usecase = new ListCustomerUseCase(customerRepository);

  try {
    const output = await usecase.execute({});
    res.send(output);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});