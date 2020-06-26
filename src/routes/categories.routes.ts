import { Router } from 'express';

import { getRepository } from 'typeorm';
import Category from '../models/Category';
import CreateCategoryService from '../services/CreateCategoryService';

const categoriesRoutes = Router();

categoriesRoutes.get('/', async (request, response) => {
  const categoriesRepository = getRepository(Category);

  const categories = await categoriesRepository.find();

  return response.json(categories);
});

categoriesRoutes.post('/', async (request, response) => {
  const { title } = request.body;

  const createCategory = new CreateCategoryService();

  const category = await createCategory.execute({
    title,
  });

  response.json(category);
});

export default categoriesRoutes;
