import { Router } from 'express';
import ProductController from '../controllers/ProductController.js';
import authentication from '../middlewares/authentication.js';

const router = Router();

router
    .get('/:id', ProductController.getProductById)
    .get('', ProductController.getAllProducts)
    .get('/search/:search', ProductController.searchProducts);

router.use(authentication)

router
    .post('', ProductController.createProduct)
    .patch('/:id', ProductController.updateProduct)
    .post('/unpublish/:id', ProductController.unpublishProduct)
    .post('/publish/:id', ProductController.publishProduct)
    .get('/drafts/all', ProductController.getAllDraftProducts)
    .get('/publish/all', ProductController.getAllPublishedProducts);

export default router;
