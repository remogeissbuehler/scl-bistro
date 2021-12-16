import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { config } from '../../config';
import { HydratedDocument } from 'mongoose';

// export class UserManagement {

async function hashPw(username: string, password: string) {
    const salt = await bcrypt.genSalt(config.misc.saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}


export async function addUser(username: string, password: string, number?: number) {
    const hash = await hashPw(username, password);
    const newUser = new User({
        username: username,
        number: number,
        hash: hash
    });
    
    await newUser.save();
}

export async function getUsers() {
    const query = User.find({});
    return await query.exec();
}


// }