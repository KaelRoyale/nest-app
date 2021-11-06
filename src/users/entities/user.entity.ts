import * as bcrypt from "bcrypt"
import * as mongoose from "mongoose"
import {} from "@nestjs/mongoose"

export class User {
   
    id: string;
    email: string;
    password: string;
    username: string;
    createdAt: Date = new Date();
    checkPassword(password: string, arg1: (err: any, isMatch: any) => void) {
        
    }
}
