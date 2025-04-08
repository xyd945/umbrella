import { Router } from 'express';
import { analyzeWebsite } from '../controllers/scanController';

const router = Router();

// Analyze website route
router.post('/analyze', analyzeWebsite);

export default router; 