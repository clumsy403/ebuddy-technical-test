import { USER_COLLECTION } from '@repo/shared-types/constants';
import { User } from '@repo/shared-types/types';
import { firestore } from '../config/firebaseConfig';


export class UserCollection {
    private static instance: UserCollection;
    private collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

    private constructor() {
        this.collection = firestore.collection(USER_COLLECTION);
    }

    public static getInstance(): UserCollection {
        if (!UserCollection.instance) {
            UserCollection.instance = new UserCollection();
        }
        return UserCollection.instance;
    }

    public async getUserById(userId: string): Promise<User | null> {
        try {
            const userDoc = await this.collection.doc(userId).get();

            if (!userDoc.exists) {
                return null;
            }

            return {id: userDoc.id, ...userDoc.data()} as User;
        } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            throw error;
        }
    }

    public async updateUser(userId: string, userData: Partial<User>): Promise<void> {
        try {
            const { id, ...data } = userData;
            await this.collection.doc(userId).set(data, {merge: true});
        } catch (error) {
            console.error(`Error updating user ${userId}:`, error);
            throw error;
        }
    }

    public async createUser(userId: string, userData: User): Promise<void> {
        try {
            const data = {  ...userData, id: userId, };
            await this.collection.doc(userId).set(data);
            console.log(`User ${userId} created successfully`);
        } catch (error) {
            console.error(`Error creating user ${userId}:`, error);
            throw error;
        }
    }
}