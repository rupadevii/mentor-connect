import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/errorHandler.js";
import Session from "../models/Session.js";
import Topics from "../models/Topic.js";
import User from "../models/User.js";
import Topic from "../models/Topic.js";
import { createMeeting } from "../utils/createMeetings.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createSession = asyncHandler(async (req, res) => {
    const {eventName, desc, topic, eventDate, startTime, endTime} = req.body;

    if(!eventName || !desc || !topic || !eventDate || !startTime || !endTime){
        return res.status(400).json({message: "Please provide all required info."})
    }

    const overLapping = await Session.find({
        eventDate,
        createdBy: req.userId,
        $or: [
            {
                startTime: { $lte: endTime},
                endTime: { $gte: startTime}
            }
        ]
    })

    if(overLapping.length !== 0){
        return res.status(400).json({
            msg: "You have overlapping meetings.", 
            data: overLapping})
    }

    const difference = new Date(endTime) - new Date(startTime)
    if(difference!==3600000){
        return res.status(400).json({msg: "Session duration should exactly be one hour."})
    }

    let user = await User.findById(req.userId)
    let isAllowed = await Topics.find({
        _id: topic,
        level: { $lte: user.level}
    })

    if(isAllowed.length === 0){
        return res.status(400).json({msg: "You do not have access to create session with this topic.", data: null})
    }

    const session = await Session.create({
        eventName,
        desc,
        topic,
        eventDate,
        startTime,
        endTime,
        createdBy: req.userId
    })

    return res.status(200).json({msg: "Session Created successfully!", data: session})
})
    
export const bookSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    if(!sessionId){
        return res.status(400).json({msg: "Please provide all the required details."})
    }

    const session = await Session.findByIdAndUpdate({
        _id: sessionId,
        status: "AVAILABLE",
        joinee: null
    }, {
        status: "BOOKED",
        joinee: req.userId
    }, {
        new: true
    })

    console.log(session.startTime, session.endTime)

    const [mentor, joinee, url] = await Promise.all([
        User.findById(session.createdBy).select("email"), 
        User.findById(session.joinee).select("email"), 
        createMeeting({desc: session.desc, startTime: session.startTime, endTime: session.endTime})])

    await sendEmail({to: [mentor.email, joinee.email], subject: "Meeting Link", message: `<p>Join the meeting using ${url}</p>`})
    console.log(url)

    return res
            .status(200)
            .json({msg: "Session Booked Successfully!", data: session})
})

export const cancelSession = asyncHandler(async (req, res) => {
    const {sessionId} = req.params;

    if(!sessionId){
        return res
        .status(400)
        .json({ message: "Please provide all required information" });
    }

    const session = await Session.findByIdAndUpdate(
        {
            _id: sessionId,
            status: "BOOKED",
        },
        {
            joinee: null,
            status: "CANCELLED"
        },
        {
            new: true
        }
    )

    return res
        .status(201)
        .json({ message: "Session cancelled succesfully!", data: session });
})

export const getSessions = asyncHandler (async (req, res) => {
    const {
        topic,
        type = "Upcoming",
        pageNumber = 1,
        pageSize = 10,
    } = req.query

    const allowedTypes = [
        "Upcoming",
        "Cancelled",
        "Past",
        "My Bookings",
        "My Sessions"
    ]

    if(!allowedTypes.includes(type)){
        return res.status(400).json({msg: "Invalid Type. Provide the correct type.", allowedTypes})
    }

    let query = {}

    if(topic) query.topic = topic
    const date = new Date()
    
    switch(type){
        case allowedTypes[0]: 
            query = {
                ...query,
                status: {$in: ["AVAILABLE", "BOOKED"]},
                eventDate : {$gt: date},
                startTime: {$gt: date},
                createdBy: {$ne: req.userId}
            };
            break;
        case allowedTypes[1]: 
            query = {
                ...query,
                status: "CANCELLED"
            };
            break;
        case allowedTypes[2]: 
            query = {
                ...query,
                status: "COMPLETED"
            };
            break;
        case allowedTypes[3]: 
            query = {
                ...query,
                joinee: req.userId 
            };
            break;
        case allowedTypes[4]: 
            query = {
                ...query,
                createdBy: req.userId
            }
            break;
        default: query = {}
    }

    const sessionsPromise = Session.find(query)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate("createdBy joinee", "name email profilePicture")
        .populate("topic", "name")
    
    const totalCountPromise = Session.countDocuments()

    const [sessions, totalCount] = await Promise.all([
        sessionsPromise,
        totalCountPromise
    ])

    res.status(200).json({
        msg: "Sessions fetched successfully.",
        data: {
            sessions,
            pagination: {
                totalCount,
                hasNextPage: totalCount > (pageNumber - 1) * pageSize + pageSize,
                hasPreviousPage: pageNumber > 1,
                pageNumber,
                pageSize
            }
        }
    })
})

export const getDashboardStats = asyncHandler(async (req, res) => {
    const topicLookUpStages = [
        {
            $lookup : {
                from: "topics",
                localField: "topic",
                foreignField: "_id",
                as: "topic"
            }
        },
        {
            $unwind: {
                path: "$topic"
            }
        },
        {
            $project: {
                _id: 0,
                topic: "$topic",
                topicName: {$ifNull: ["$topic.name", "Unknown Topic"]},
                topicLevel: "$topic.level",
                count: 1
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]

    const date = new Date()
    const responses = await Promise.all([
        //sessions created by user (total, completed, cancelled, (booked by others))
        Session.aggregate([
            {
                $match: { createdBy: new mongoose.Types.ObjectId(req.userId)}
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status","COMPLETED"] }, 1, 0]}
                    },
                    cancelled: {
                        $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0]}
                    },
                    booked: {
                        $sum: { $cond: [{ $ne: ["$joinee", null] }, 1, 0]}
                    }
                }
            }
        ]),

        //sessions booked by user (total, completed, cancelled)
        Session.aggregate([
            {
                $match: { joinee: new mongoose.Types.ObjectId(req.userId) }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] }
                    },
                    cancelled: {
                        $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] }
                    }
                }
            }
        ]),

        //latest 5 sessions created by current user
        Session.find({ createdBy: req.userId })
            .sort({
                createdAt: -1
            })
            .limit(5)
            .populate("joinee", "name email")
            .populate("topic", "name level"),

        //next 5 upcoming bookings of user
        Session.find({
            joinee: req.userId,
            status: { $in: ["AVAILABLE", "BOOKED"] },
            eventDate : {$gt: date},
            startTime: {$gt: date},
        })
        .sort({
            eventDate: 1,
            startTime: 1
        })
        .limit(5)
        .populate("joinee", "name email")
        .populate("topic", "name level"),

        //Session status breakdown
        Session.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(req.userId) } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { _id: 0, status: "$_id", count: 1 } }
        ]),

        //Sessions grouped by topic (created by user)
        Session.aggregate([
            {
                $match: { createdBy: new mongoose.Types.ObjectId(req.userId) }
            },
            {
                $group: { _id: "$topic", count: { $sum: 1 } }
            },
            {
                $project: { _id: 0, topic: "$_id", count: 1}
            },
            ...topicLookUpStages
        ]),
        
        //booked sessions grouped by topic
        Session.aggregate([
            {
                $match: { joinee: new mongoose.Types.ObjectId(req.userId) },
            },
            {
                $group: { _id: "$topic", count: { $sum: 1 } }
            },
            {
                $project: { _id: 0, topic: "$_id", count: 1}
            },
            ...topicLookUpStages
        ]),

        //Most popular 5 topics
        Session.aggregate([
            {
                $group: { _id: "$topic", count: { $sum: 1 } }
            },
            {
                $sort: { count: -1}
            },
            {
                $limit: 5
            },
            {
                $project: { _id: 0, topic: "$_id", count: 1}
            },
            ...topicLookUpStages
        ])

    ])

    return res.status(200).json({
        data: responses,
    });
})