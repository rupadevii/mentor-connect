import mongoose from "mongoose";

const topicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    level: {
        type: Number,
        required: true,
        unique: true
    }
})

const Topic = mongoose.model("Topic", topicSchema)

export default Topic