import { GoogleGenAI, Type } from "@google/genai";
import productService from "../products/product.service.js";
import stockService from "../stock/stock.service.js";
import { getAllCategories } from "../products/category.service.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-3.6-flash";

const tools = [
  {
    functionDeclarations: [
      {
        name: "get_all_products",
        description:
          "Get a list of all products with their key, name, category, total quantity in stock, and low stock threshold.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "get_low_stock_products",
        description:
          "Get all products where stock is at or below their low stock threshold.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "get_stock_history",
        description:
          "Get the stock movement history (in/out/adjustment) for one specific product. You need the product's MongoDB _id - get it first from get_all_products if you don't already have it.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            productId: {
              type: Type.STRING,
              description: "The MongoDB _id of the product",
            },
          },
          required: ["productId"],
        },
      },
      {
        name: "get_categories",
        description: "Get a list of all product categories.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
    ],
  },
];

/* Maps tool names to the real functions that run them */
const toolFunctions = {
  get_all_products: async () => {
    const products = await productService.getAllProducts();
    return products.map((p) => ({
      id: p._id,
      key: p.key,
      name: p.name,
      category: p.category?.name || "Uncategorized",
      totalQty: p.totalQty,
      lowStockThreshold: p.lowStockThreshold,
    }));
  },

  get_low_stock_products: async () => {
    const products = await stockService.getLowStockProducts();
    return products.map((p) => ({
      id: p._id,
      key: p.key,
      name: p.name,
      category: p.category?.name || "Uncategorized",
      totalQty: p.totalQty,
      lowStockThreshold: p.lowStockThreshold,
    }));
  },

  get_stock_history: async ({ productId }) => {
    const movements = await stockService.getStockHistory(productId);
    return movements.map((m) => ({
      type: m.type,
      quantity: m.quantity,
      previousQty: m.previousQty,
      newQty: m.newQty,
      reason: m.reason,
      date: m.createdAt,
      by: m.createdBy
        ? `${m.createdBy.firstName} ${m.createdBy.lastName}`
        : "Unknown",
    }));
  },

  get_categories: async () => {
    const categories = await getAllCategories();
    return categories.map((c) => ({ id: c._id, name: c.name }));
  },
};

/* Send a message to the assistant and get a plain-English reply */
const chat = async (message) => {
  const contents = [{ role: "user", parts: [{ text: message }] }];

  let response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: { tools },
  });

  // Keep letting Gemini call tools until it's ready to give a final answer
  while (response.functionCalls && response.functionCalls.length > 0) {
    const call = response.functionCalls[0];

    const toolFn = toolFunctions[call.name];

    if (!toolFn) {
      throw new Error(`Unknown tool requested: ${call.name}`);
    }

    const result = await toolFn(call.args || {});

    // Add the model's FULL turn exactly as Gemini sent it
    // (this keeps required hidden fields like thought_signature intact)
    contents.push(response.candidates[0].content);

    contents.push({
      role: "user",
      parts: [
        {
          functionResponse: {
            name: call.name,
            response: { result },
          },
        },
      ],
    });

    response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: { tools },
    });
  }

  return response.text;
};

export default { chat };