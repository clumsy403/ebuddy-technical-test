import { NextFunction, Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '../config/firebaseConfig';

export interface AuthenticatedRequest extends Request {
    user?: DecodedIdToken;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Please provide an authenticated token' });
        return;
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).json({ error: 'Invalid token' });
    }
}