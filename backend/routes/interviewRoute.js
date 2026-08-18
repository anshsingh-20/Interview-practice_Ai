import express from "express";
import { GoogleGenAI } from "@google/genai";
import Interview from "../models/Interview.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const getAIInstance = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not define");
  }
  return new GoogleGenAI({ apiKey });
};

router.post("/generate", protect, async (req, res, next) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "topic is required" });
  }
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `give me one realistic technical interview questions and answer on the topic of ${topic}`,
    });
    res.json({ question: response.text.trim() });
  } catch (error) {
    next(error);
  }
});

router.post("/submit", protect, async (req, res, next) => {
  const { topic, question, userAnswer } = req.body;

  if (!topic || !question) {
    return res.status(400).json({ error: "Topic and question are required" });
  }

  try {
    const ai = getAIInstance();
    const prompt = `You are an interviewer . Evalute the user's answer to the technical question.
Topic: ${topic}
Question: ${question}
User's Answer: ${userAnswer}
Analyze the answer
provide constructive feedback on rating out of 10.
Schema:{
"rating": (number),
"feedback": string
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    let rating = 0;
    let feedback = "could not parse AI response";

    try {
      let cleanedText = response.text.trim();

      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.substring(7);
      }

      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3);
      }

      const parsed = JSON.parse(cleanedText);
      rating =
        typeof parsed.rating === "number"
          ? parsed.rating
          : Number(parsed.rating) || 0;
      feedback = parsed.feedback || cleanedText;
    } catch (parseError) {
      console.log(parseError);
      feedback = response.text;
      const ratingMatch = response.text.match(/"rating":\s*(\d+)/);

      if (ratingMatch) {
        rating = Number(ratingMatch[1]) || 5;
      } else {
        rating = 5;
      }
    }

    const newInterview = await Interview.create({
      userId: req.user._id,
      topic,
      question,
      userAnswer: userAnswer || "",
      feedback,
      rating,
    });

    res.status(201).json(newInterview);
  } catch (error) {
    next(error);
  }
});

router.get("/", protect, async (req, res, next) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(interviews);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", protect, async (req, res, next) => {
  const { notes, rating } = req.body;

  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!interview) {
      return res.status(404).json({
        error: "Interview not found",
      });
    }

    if (notes !== undefined) interview.notes = notes;
    if (rating !== undefined) interview.rating = rating;
    const updatedInterview = await interview.save();
    res.json(updatedInterview);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", protect, async (req, res, next) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!interview) {
      return res.status(404).json({ error: "interview not found" });
    }
    res.json({ message: "interview history item removed" });
  } catch (error) {
    next(error);
  }
});

export default router;
