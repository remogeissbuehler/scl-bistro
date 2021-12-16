import { Schema, model } from 'mongoose';

export interface IUser {
    username: string;
    fullname: string;
    hash: string;
    rights?: string[];
}

const schema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    fullname: String,
    hash: { type: String, required: true },
    rights: [String]
});

export const User = model<IUser>('User', schema);
