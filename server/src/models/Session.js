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
            type: Date,
            required: [true, 'Start time is required'],
        },
        endTime: {
            type: Date,
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
        },
        url: {
            type: String,
            default: null
        },
        mentorFeedback: {
            comment: {
                type: String,
            },
            submittedAt: {
                type: Date,
            }
        }, 
        menteeFeedback: {
            rating: {
                type: Number
            },
            comment: {
                type: String
            },
            submittedAt: {
                type: Date
            }
        }
    },
    {
        timestamps: true,
    }
);

sessionSchema.index({ createdBy: 1, status: 1 });
sessionSchema.index({ joinee: 1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
