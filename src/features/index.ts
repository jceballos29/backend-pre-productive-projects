import { Router } from 'express';

import { authenticate, authorize } from '../shared/middleware';
import AreaRoutes from './areas/routes/area.routes';
import ProgramRoutes from './programs/routes/program.routes';
import AuthRouts from './users/routes/auth.routes';
import UserRoutes from './users/routes/user.routes';

import { Role } from './users/models/user';

const router = Router();

router.use('/auth', new AuthRouts().router);
router.use(
	'/areas',
	[authenticate, authorize([Role.ADMIN])],
	new AreaRoutes().router,
);
router.use(
	'/programs',
	[authenticate, authorize([Role.ADMIN])],
	new ProgramRoutes().router,
);
router.use('/users', authenticate, new UserRoutes().router);

export default router;
