import { useEffect, useRef, useState } from "react";
import { Spinner } from "../common/Loader";
import { ChatBubbleIcon, SendIcon, SparklesIcon, XIcon } from "../common/Icons";
import { sendMessage } from "../../services/assistant.service";

const WELCOME_MESSAGE = {
  role: "assistant",
  text: "Hi! I can help you look up products, categories, and stock levels. What would you like to know?",
};

/* Turns basic Markdown (**bold**, `code`) into styled JSX, without
   pulling in a full Markdown library — the assistant only ever uses
   these two patterns, so a small regex split is enough. */
const renderFormattedText = (text) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const handleToggle = () => {
    setIsOpen((previous) => !previous);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = input.trim();

    if (!trimmed || sending) {
      return;
    }

    setError("");
    setMessages((previous) => [...previous, { role: "user", text: trimmed }]);
    setInput("");

    try {
      setSending(true);

      const data = await sendMessage(trimmed);

      setMessages((previous) => [
        ...previous,
        { role: "assistant", text: data.reply },
      ]);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-96 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary-700 to-primary-600 px-5 py-4">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">Sruwan Assistant</h3>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className="rounded-lg p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                    message.role === "user"
                      ? "rounded-br-sm bg-primary-600 text-white"
                      : "rounded-bl-sm bg-background text-text-primary"
                  }`}
                >
                  {message.role === "assistant"
                    ? renderFormattedText(message.text)
                    : message.text}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-background px-4 py-2.5">
                  <Spinner size="sm" />
                  <span className="text-sm text-text-secondary">
                    Thinking...
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about products, stock..."
              disabled={sending}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating bubble button */}
      <button
        type="button"
        onClick={handleToggle}
        title="Sruwan Assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 hover:shadow-xl"
      >
        {isOpen ? (
          <XIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleIcon className="h-6 w-6" />
        )}
      </button>
    </>
  );
};

export default ChatWidget;
