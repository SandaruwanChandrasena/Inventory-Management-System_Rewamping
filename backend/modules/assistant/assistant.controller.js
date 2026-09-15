import asyncHandler from "express-async-handler";
import assistantService from "./assistant.service.js";

const chatWithAssistant = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  const reply = await assistantService.chat(message);

  res.status(200).json({
    success: true,
    reply,
  });
});

export { chatWithAssistant };