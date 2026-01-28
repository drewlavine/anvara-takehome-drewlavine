import { type Request, type Response, type NextFunction } from 'express';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { prisma } from './db.js';
// These are needed to scope queries to the user's own data
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'SPONSOR' | 'PUBLISHER';
    sponsorId?: string;
    publisherId?: string;
  };
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const auth = betterAuth({
  database: new Pool({ connectionString }),
  secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-for-dev',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3847',
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [],
  advanced: {
    disableCSRFCheck: true,
  },
});

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      res.status(401).json({ error: 'Unauthorized: No valid session' });
      return;
    }

    const userId = session.user.id;

    // Look up user's role and associated IDs (SPONSOR or PUBLISHER)
    const sponsor = await prisma.sponsor.findUnique({
      where: { userId },
      select: { id: true },
    });

    const publisher = await prisma.publisher.findUnique({
      where: { userId },
      select: { id: true },
    });

    // Determine role based on profile type
    const role: 'SPONSOR' | 'PUBLISHER' | null = sponsor
      ? 'SPONSOR'
      : publisher
        ? 'PUBLISHER'
        : null;

    if (!role) {
      res.status(401).json({ error: 'Unauthorized: User has no role assigned' });
      return;
    }

    req.user = {
      id: userId,
      email: session.user.email || '',
      role,
      sponsorId: sponsor?.id,
      publisherId: publisher?.id,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized: Authentication failed' });
  }
}

export function roleMiddleware(allowedRoles: Array<'SPONSOR' | 'PUBLISHER'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
