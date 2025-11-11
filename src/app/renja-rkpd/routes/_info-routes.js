import { Router } from 'express'
import * as controller from '../controllers/_info-controller.js';

const routes = Router();

routes.get('/dashboard-card-data', controller.DashboardCardData);
routes.post('/ranking', controller.rangkingSKPD);

export default routes;