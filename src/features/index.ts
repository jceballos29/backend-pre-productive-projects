import { Router } from 'express';
import AreaRoutes from './areas/routes/area.routes';
import UserRoutes from './users/routes/user.routes';

const router = Router();

router.use('/areas', new AreaRoutes().router);
router.use('/users', new UserRoutes().router);

export default router;
