export interface User {
    id: string;
    email: string | null;
    displayName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    age?: number | null;
    occupation?: string | null;
}