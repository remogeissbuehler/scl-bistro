import { Schema, model, ObjectId, AnyObject, isValidObjectId } from 'mongoose';
import { User }from './User';
import mongoose from 'mongoose';

function validateTime(time: string): boolean {
    if (!(/\d{2}:\d{2}/.test(time)))
        return false;
    

    let [hours, minutes] = time.split(':');
    let [h, m] = [Number(hours), Number(minutes)];
    
    return h >= 0 && h <= 24 && m >= 0 && m < 60;
}

interface IEntry {
    user: ObjectId,
    time: string
}

const entrySchema = new Schema<IEntry>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    time: {
        type: String,
        validate: {
            validator: validateTime
        }
    }
});

interface IInscription {
    date: Date,
    lunch?: IEntry[],
    dinner?: IEntry[],
    noLunch?: boolean,
    noDinner?: boolean
}

const schema = new Schema<IInscription>({
    date: { type: Schema.Types.Date, required: true, unique: true },
    lunch: { type: [entrySchema], required: false, default: null },
    dinner: [entrySchema],
    noLunch: Schema.Types.Boolean,
    noDinner: Schema.Types.Boolean
});

export const Inscription = model<IInscription>('Inscription', schema);
