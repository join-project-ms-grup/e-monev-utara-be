import { Router } from 'express'
import cekToken from '../middlewares/auth.js';
import * as controller from '../controllers/_info-controller.js';

const routes = Router();

routes.use(cekToken);
routes.get('/dashboard-card-data', controller.DashboardCardData);

export default routes;