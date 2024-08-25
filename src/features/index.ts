import { Router } from 'express';
import AreaRoutes from './areas';
import UserRoutes from './users';

const router = Router();

router.use('/areas', new AreaRoutes().router);
router.use('/users', new UserRoutes().router);

export default router;
