import { User } from "@repo/shared-types/types";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { UserCollection } from "../repository/userCollection";

export class UserController {
    private static instance: UserController;
    private userCollection: UserCollection;

    private constructor() {
        this.userCollection = UserCollection.getInstance();
        this.fetchUserDataController = this.fetchUserDataController.bind(this);
        this.updateUserDataController = this.updateUserDataController.bind(this);
    }

    public static getInstance(): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    public async fetchUserDataController(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.uid;

            if (!userId) {
                res.status(400).json({error: 'User ID is required'});
                return;
            }

            const user = await this.userCollection.getUserById(userId);

            if (!user) {
                res.status(404).json({error: 'User not found'});
                return;
            }

            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ error: 'Failed to fetch user data.', details: error instanceof Error ? error.message : 'Unknown error' });
        }
    }

    public async updateUserDataController(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.uid;

            if (!userId) {
                res.status(400).json({error: 'User ID is required'});
                return;
            }

            const userData: Partial<User> = req.body;

            if (userData.id && userData.id !== userId) {
                res.status(400).json({error: 'User ID in body does not match authenticated user ID'});
                return;
            }

            if (Object.keys(userData).length === 0) {
                res.status(400).json({error: 'No valid data provided'});
                return;
            }

            const {id, ...data} = userData;

            await this.userCollection.updateUser(userId, data);

            const updatedUser = await this.userCollection.getUserById(userId);

            if (!updatedUser) {
                res.status(404).json({error: 'User not found'});
                return;
            }
            
            res.status(200).json(updatedUser);
            
        } catch (error) {
            console.error('Error updating user data:', error);
            res.status(500).json({ error: 'Failed to update user data.', details: error instanceof Error ? error.message : 'Unknown error' });
        }
    }
}