import ProductRepository from '@infrastructure/product/repository/sequelize/product.repository';
import express, { Request, Response } from 'express';
import CreateProductUseCase from '../../../usecase/product/create/create.product.usecase';
import ListProductUsecase from '../../../usecase/product/list/list.product.usecase';

export const productRoute = express.Router();

productRoute.post('/', async (req: Request, res: Response) => {
  const { type, name, price } = req.body;
  const productRepository = new ProductRepository();
  const usecase = new CreateProductUseCase(productRepository);

  try {
    const input = { type, name, price };
    const output = await usecase.execute(input);
    res.send(output);
  } catch (error) {
    res.status(500).send(error);
  }
});

productRoute.get('/', async (req: Request, res: Response) => {
  const productRepository = new ProductRepository();
  const usecase = new ListProductUsecase(productRepository);

  try {
    const output = await usecase.execute({});
    res.send(output);
  } catch (error) {
    res.status(500).send(error);
  }
});