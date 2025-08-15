import express from 'express';
import { getProductById, getProducts } from '../controllers/product.controller';

const router = express.Router();

// GET /api/products?search=term
router.get('/', getProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

export default router;
