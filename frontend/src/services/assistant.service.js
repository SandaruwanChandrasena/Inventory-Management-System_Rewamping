import api from "./api";

/* Send a message to the AI assistant and get its reply.
   Note: the backend does NOT remember previous messages — each call
   is a fresh conversation from the AI's perspective, even though we
   show a running chat history on screen for the user. */
const sendMessage = async (message) => {
  const response = await api.post("/assistant/chat", { message });
  return response.data;
};

export { sendMessage };