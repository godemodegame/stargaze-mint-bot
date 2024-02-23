import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces';

export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema<IUser>({
    telegram_id: {
        type: Number,
        required: true,
        unique: true
    },
    seed: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: "user"
    }
});

export default mongoose.model<IUserModel>('User', UserSchema);