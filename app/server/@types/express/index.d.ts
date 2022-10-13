// Getting the Request Type from Express and adding user property as a string
// so we can create the email in our checkAuth and Auth 

declare namespace Express {
    export interface Request {
        user: string;
    }
    
}