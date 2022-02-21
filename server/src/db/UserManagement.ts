import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { config } from 'common/config';
import { HydratedDocument } from 'mongoose';

// export class UserManagement {

async function hashPw(password: string) {
    const salt = await bcrypt.genSalt(config.misc.saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}


export async function addUser(username: string, password: string, fullname?: string, pendingApproval: boolean = true) {
    const hash = await hashPw(password);
    const newUser = new User({
        username: username,
        fullname: fullname,
        hash: hash,
        pendingApproval: pendingApproval
    });
    
    await newUser.save();
}

export async function updatePassword(username: string, newPassword: string) {
    const hash = await hashPw(newPassword);

    let res = await User.updateOne(
        { username },
        {
            '$set': { hash }
        }
    );

    if (res.modifiedCount == 0) {
        let e = new Error("no update");
        
        throw e;
    }
}

export async function getUsers() {
    const query = User.find({}, "-hash");
    return await query.exec();
}


// }