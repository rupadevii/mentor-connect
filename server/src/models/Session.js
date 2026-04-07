import mongoose from 'mongoose';
import User from './User.js';
import Topic from './Topic.js'

const sessionSchema = new mongoose.Schema(
    {
        eventName: {
            type: String
        },
        eventDate: {
            type: Date,
            required: [true, 'Event Date is required'],
        },
        desc: {
            type: String,
            required: [true, 'Desc is required.']
        },
        startTime: {
            type: String,
            required: [true, 'Start time is required'],
        },
        endTime: {
            type: String,
            required: [true, 'End time is required'],
        },
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Topic,
            required: [true, "Topic is required."]
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true
        },
        joinee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            default: null
        },
        status: {
            type: String,
            enum: ["AVAILABLE", "BOOKED", "CANCELLED", "COMPLETED"],
            default: "AVAILABLE"
        }
    },
    {
        timestamps: true,
    }
);

sessionSchema.index({ createdBy: 1, status: 1 });
sessionSchema.index({ joineeId: 1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
