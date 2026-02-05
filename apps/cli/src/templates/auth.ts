export const authMiddlewareTs = `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
`;

export const authMiddlewareJs = `import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
`;

export const authRouterTs = `import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

router.post('/login', validate(loginSchema), (req, res) => {
  // In a real app, you would validate credentials against a database
  const { username } = req.body;
  
  const user = { username, role: 'user' };
  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

  res.json({ accessToken, refreshToken });
});

export const authRouter = router;
`;

export const authRouterJs = `import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

router.post('/login', validate(loginSchema), (req, res) => {
  // In a real app, you would validate credentials against a database
  const { username } = req.body;
  
  const user = { username, role: 'user' };
  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

  res.json({ accessToken, refreshToken });
});

export const authRouter = router;
`;
