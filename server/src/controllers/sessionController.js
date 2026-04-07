import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/errorHandler.js";
import Session from "../models/Session.js";
import Topics from "../models/Topic.js";
import User from "../models/User.js";
import Topic from "../models/Topic.js";

export const createSession = asyncHandler(async (req, res) => {
    const { eventName, desc, topic, eventDate, startTime, endTime } = req.body;

    if (!eventName || !desc || !topic || !eventDate || !startTime || !endTime) {
        return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    //TODO: Validation needs to be added
    // 1. Event date should be future date
    // 2. startTime < endTime (diff should be min 20 mins)
    // 3. User should not be able to create multiple session in the same time
    const overlapping = await Session.find({
        eventDate,
        createdBy: req.userId,
        startTime,
        $or: [
            {
                startTime: { $lte: endTime },
                endTime: { $gte: startTime },
            },
        ],
    });

    if (overlapping.length !== 0) {
            return res.status(400).json({
            message: "You have overlap meeetings",
            data: overlapping,
        });
    }

    // 4. have the validation as per the user-level
    let user = await User.findById(req.userId);
    let isAllowed = await Topics.find({
        _id: topic, //_id: new mongoose.Types.ObjectId(topic),
        level: { $lte: user.level },
    });

    if (isAllowed.length === 0) {
        return res.status(404).json({
            message: "You do not have access to create session with this topic",
            data: null,
        });
    }

    // Create session
    const session = await Session.create({
        eventName,
        desc,
        topic,
        eventDate,
        startTime,
        endTime,
        createdBy: req.userId,
    });

    // Send response with token
    return res
        .status(201)
        .json({ message: "Session Created succesfully", data: session });
});

export const createSession2 = asyncHandler(async (req, res) => {
    const { eventName, desc, topic, eventDate, startTime, endTime } = req.body;

    // Validation
    if (!eventName || !desc || !topic || !eventDate || !startTime || !endTime) {
        return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Start a Mongoose session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction(); // TRANS

    try {
        // Your existing validation logic (overlapping sessions, topic access) here
        const overlapping = await Session.find({
        eventDate,
        createdBy: req.userId,
        $or: [
            {
                startTime: { $lte: endTime },
                endTime: { $gte: startTime },
            },
        ],
        }).session(session); // Use session for queries within transaction

        if (overlapping.length !== 0) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "You have overlap meetings",
                data: overlapping,
            });
        }

        let user = await User.findById(req.userId).session(session);
        let isAllowed = await Topics.find({
            _id: topic,
            level: { $lte: user.level },
        }).session(session);

        if (isAllowed.length === 0) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "You do not have access to create session with this topic",
                data: null,
            });
        }

        // Create session within the transaction
        const sessionData = new Session({
            eventName,
            desc,
            topic,
            eventDate,
            startTime,
            endTime,
            createdBy: req.userId,
        });
        const savedSession = await sessionData.save({ session }); // Use session for save

        // If you need to update the user's session count, do it here within the same transaction
        // await User.findByIdAndUpdate(req.userId, { $inc: { sessionCount: 1 } }, { session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Session Created successfully",
            data: savedSession,
        });
    } catch (error) {
        // Abort the transaction on any error
        await session.abortTransaction();
        session.endSession();
        console.error("[TRANSACTION ERROR]:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// PATCH /session/book/:sessionId
export const bookSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    // Validation
    if (!sessionId) {
        return res
        .status(400)
        .json({ message: "Please provide all required information" });
    }

    const session = await Session.findByIdAndUpdate(
        {
            _id: sessionId,
            status: "AVAILABLE",
            joinee: null,
        }, //filter condt
        {
            joinee: req.userId,
            status: "BOOKED",
        }, // object for updation
    );

    return res
        .status(201)
        .json({ message: "Session Booked succesfully", data: session });
});

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
        }
    )

    return res
        .status(201)
        .json({ message: "Session Booked succesfully", data: session });
})

// ZOD Effect
// const getSessionDetailsPayloadSchema = z.object({
//   topicId: z.string().optional(), // Assuming topicId should be a string if present
//   type: z
//     .enum(["Upcoming", "Cancelled", "Past", "My Bookings", "My Sessions"])
//     .default("Upcoming"),
//   pageNumber: z.coerce.number().int().positive().default(1),
//   pageSize: z.coerce.number().int().positive().default(10),
// });

export const getSessions = asyncHandler(async (req, res) => {
    const {
        topicId,
        type = "Upcoming",
        pageNumber = 1,
        pageSize = 10,
    } = req.query;

    // const result = getSessionDetailsPayloadSchema.safeParse(req.query);
    // if (!result.success) {
    //     // Handle validation errors
    //     console.error(result.error);
    //     return res.status(400).json({ error: result.error });
    // }

    console.log("topicId", topicId);

    const allowedTypes = [
        "Upcoming",
        "Cancelled",
        "Past",
        "My Bookings",
        "My Sessions",
    ];

    if (!allowedTypes.includes(type)) {
        return res.status(400).json({
            message: "Type is wrong, provide the correct types",
            allowedTypes: allowedTypes,
        });
    }

    let query = {};

    if (topicId) {
        query.topic = topicId;
    }
    const date = new Date();
    const currentTime = `${date.getHours()}:${date.getMinutes()}`;
    if (type === allowedTypes[0]) {
        query = {
            ...query,
            status: { $in: ["AVAILABLE", "BOOKED"] },
            eventDate: { $gt: date },
            startTime: { $gt: currentTime },
        };
    } else if (type === allowedTypes[1]) {
        query = {
            ...query,
            status: "CANCELLED",
        };
    } else if (type === allowedTypes[2]) {
        query = {
            ...query,
            status: "COMPLETED",
        };
    } else if (type === allowedTypes[3]) {
        query = {
            ...query,
            joineeId: req.userId,
        };
    } else if (type === allowedTypes[4]) {
        query = {
            ...query,
            createdBy: req.userId,
        };
    }

    // Create session
    const sessionsPromise = Session.find(query)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate("createdBy joinee", "name email");

    const totalCountPromise = Session.countDocuments();
    const [sessions, totalCount] = await Promise.all([
        sessionsPromise,
        totalCountPromise,
    ]);

    console.log("sessions", sessions);

    // Send response with token
    return res.status(200).json({
        message: "Session Fetched succesfully",
        data: {
        sessions,
        pagination: {
            totalCount,
            hasNextPage: totalCount > (pageNumber - 1) * pageSize + pageSize,
            hasPrevPage: pageNumber > 1,
            pageNumber,
            pageSize,
        },
        },
    });
});

export const getDashboardStats = asyncHandler(async (req, res) => {

    const topicLookupStages = [
        {
            $lookup: {
                from: "topics", //collection which needs to be looked upto
                localField: "topic", // current group stage output key which can be used to join with topics collection,
                foreignField: "_id", // the primary key that can be used to join with topic collection
                as: "topic", //result stored as array fields named topic
            },
        },
        {
        // flatten the array and give us the obj
            $unwind: {
                path: "$topic",
            },
        },
        {
            $project: {
                _id: 0, //hiding it
                topic: "$topic",
                topicName: { $ifNull: ["$topic.name", "Unknown Topic"] },
                topicLevel: "$topic.level",
                count: 1, //show it
            },
        },
        {
            $sort: { count: -1 },
        },
    ];

    const responses = await Promise.all([
        // Q1 → Total sessions created by current user → How many sessions I created
        // Q2 → Completed sessions created by current user → How many of my sessions are completed
        // Q3 → Cancelled sessions created by current user → How many of my sessions got cancelled
        // Q4 → Booked sessions created by current user → How many of my sessions were booked

        Session.aggregate([
        {
            $match: { createdBy: new mongoose.Types.ObjectId(req.userId) }, //indexing
        },
        {
            $group: {
                _id: null, //whatever record u r having make it a single group
                total: { $sum: 1 },
                completed: {
                    $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
                },
                cancelled: {
                    $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] },
                },
                booked: {
                    $sum: { $cond: [{ $ne: ["$joineeId", null] }, 1, 0] },
                },
            },
        },
        ]),

        // Q5 → Total sessions booked by current user → How many sessions I booked
        // Q6 → Completed sessions booked by current user → How many sessions I attended successfully
        // Q7 → Cancelled sessions booked by current user → How many of my bookings got cancelled

        Session.aggregate([
            {
                $match: { joinee: new mongoose.Types.ObjectId(req.userId) }, //indexing
            },
            {
                $group: {
                _id: null, //whaeevr record u r having make it a single group
                total: { $sum: 1 },
                completed: {
                    $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
                },
                cancelled: {
                    $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] },
                },
                },
            },
        ]),

        // Q8 → Latest 5 sessions created by current user → Show my recent created sessions

        Session.find({ createdBy: req.userId })
            .sort({
                createdAt: -1,
            })
            .limit(5)
            .populate("joinee", "name email")
            .populate("topic", "name level"),
        
        // Q9 → Next 5 upcoming bookings → Show my upcoming sessions
        Session.find({
            joinee: req.userId,
            status: { $in: ["AVAILABLE", "BOOKED"] },
        })
        .sort({
            eventDate: 1,
            startTime: 1,
        })
        .limit(5)
        .populate("joinee", "name email")
        .populate("topic", "name level"),

        // Q10 → Session status breakdown → Distribution of my sessions by status
        Session.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(req.userId) } },
            { $group: { _id: "$status", count: { $sum: 1 } } }, // {_id; "COMPLETED", count:2, }
            { $project: { _id: 0, status: "$_id", count: 1 } }, // {status:"Completed", count:2}
        ]),

        // Q11 → My sessions grouped by topic → Topics I teach most
        Session.aggregate([
            {
                $match: { createdBy: new mongoose.Types.ObjectId(req.userId) },
            },
            {
                $group: { _id: "$topic", count: { $sum: 1 } },
            },
            { 
                $project: { _id: 0, topic: "$_id", count: 1 } },
                ...topicLookupStages,
        ]),

        // Q12 → My bookings grouped by topic → Topics I learn most
        Session.aggregate([
            {
                $match: { joinee: new mongoose.Types.ObjectId(req.userId) },
            },
            {
                $group: { _id: "$topic", count: { $sum: 1 } },
            },
            { 
                $project: { _id: 0, topic: "$_id", count: 1 } 
            },
                ...topicLookupStages,
        ]),

        // Q13 → Platform top 5 topics → Most popular topics on platform
        Session.aggregate([
            {
                $group: { _id: "$topic", count: { $sum: 1 } },
            },
            {
                $sort: { count: -1 }, //most popular 
            },
            {
                $limit: 5,
            },
            {
                $project: { _id: 0, topic: "$_id", count: 1}
            },
            ...topicLookupStages,
        ]),
    ]);
    
    return res.json({
        data: responses,
    });
});