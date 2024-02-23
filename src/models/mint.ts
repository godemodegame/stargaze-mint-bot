import mongoose, { Schema, Document } from 'mongoose';
import { IMint } from '../interfaces';

export interface IUserModel extends IMint, Document {}

const UserSchema = new Schema<IMint>({
    telegram_id: {
        type: Number,
        required: true,
        unique: false
    },
    contractAddress: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    amount: {
        type: Number,
        default: 1,
    },
    mintdate: { 
        type: Date,
        required: true,
    },
    minted: {
        type: Boolean,
        default: false,
    }
});

export default mongoose.model<IUserModel>('User', UserSchema);