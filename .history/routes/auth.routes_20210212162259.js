import { Router } from 'express';
const router = new Router();
import Auth from '../controllers/auth'
const { register, 
        login } = Auth

router.post('/auth/register', register);
router.post('/auth/login', login);

export default router;