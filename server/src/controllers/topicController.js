import { asyncHandler } from "../middlewares/errorHandler.js";
import Topic from "../models/Topic.js";

export const getTopics = asyncHandler(async (req, res) => {
    const topics = await Topic.find({})

    res.status(200).json({message: "Topics fetched Successfully", data: topics })
})