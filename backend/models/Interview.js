import mongoose from "mongoose"

const InterviewSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true]
    },
    topic: {
        type: String,
        required: [true],
    },
    question: {
        type: String,
        required: true,
    },
    userAnswer: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true,
        default: " "
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    notes: {
        type: String,
        default: ""
    }



}, {
    timestamps: true
}

)

const Interview = mongoose.model("Interview",InterviewSchema)
export default Interview;