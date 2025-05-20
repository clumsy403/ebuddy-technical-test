import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import * as functions from 'firebase-functions';
import userRoutes from './routes/userRoutes';

dotenv.config();
const app: Express = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true}));

app.use('/', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});

// export default app;
export const api = functions.https.onRequest(app);