import { Router } from 'express';
import customerController from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createCustomerValidation,
  updateCustomerValidation,
  getCustomerValidation,
  deleteCustomerValidation,
  listCustomersValidation,
} from '../validations/customer.validation';
import { createLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Customer CRUD
router.post('/', createLimiter, validate(createCustomerValidation), customerController.create);
router.get('/', validate(listCustomersValidation), customerController.getAll);
router.get('/search', customerController.search);
router.get('/company/:companyId', customerController.getByCompany);
router.get('/:id', validate(getCustomerValidation), customerController.getById);
router.put('/:id', validate(updateCustomerValidation), customerController.update);
router.delete('/:id', validate(deleteCustomerValidation), customerController.delete);

export default router;