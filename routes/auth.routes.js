import { Router } from 'express';
const router = new Router();
import Auth from '../controllers/auth'
const { login } = Auth

router.post('/auth/login', login);

export default router;
