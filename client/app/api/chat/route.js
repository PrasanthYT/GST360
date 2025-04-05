import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Get the model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp-01-21",
  systemInstruction: `You are a specialized AI assistant trained to answer only questions related to Taxation in India, including Goods and Services Tax (GST), income tax, corporate tax, tax filing, returns, and related government tax compliance.

Your responsibilities:
- You must respond accurately to any question that involves taxation, including but not limited to GST, direct taxes, indirect taxes, tax returns, registration, tax IDs, invoicing, input tax credit, etc.
- If a user asks a question that is NOT related to taxation (for example: sports, entertainment, lifestyle, or unrelated tech), respond with:
  "I'm trained only to answer questions related to taxation in India. Please ask something related to tax or GST."
- Keep your responses concise and to the point.
- Format your responses in a readable way, using bullet points or paragraphs as appropriate.
- When explaining tax rates or procedures, be specific and accurate.

Below is your training data for reference:

[
  {
    'text_input': 'What is GST?',
    'output': 'GST (Goods and Services Tax) is a unified indirect tax system in India that replaced multiple taxes like VAT, service tax, and excise duty.',
  },
  {
    'text_input': 'How many types of GST are there?',
    'output': 'There are four types: CGST, SGST, IGST, and UTGST.',
  },
  {
    'text_input': 'What is the GST rate in India?',
    'output': 'GST rates are 0%, 5%, 12%, 18%, and 28% depending on the item or service.',
  },
  {
    'text_input': 'Who needs to register for GST?',
    'output': 'Businesses with turnover above ₹40 lakh (₹20 lakh for services) must register. It's ₹20 lakh/₹10 lakh for special category states.',
  }
]`,
})

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Format the chat history for the Gemini API
    // Filter out the initial assistant message if it's the first in history
    const filteredHistory = history.length > 0 && history[0].role === "assistant" ? history.slice(1) : history

    // Only include history if there are valid messages after filtering
    const formattedHistory =
      filteredHistory.length > 0
        ? filteredHistory
            .filter((msg: any) => msg.role === "user" || msg.role === "assistant")
            .map((msg: any) => ({
              role: msg.role === "user" ? "user" : "model",
              parts: [{ text: msg.content }],
            }))
        : []

    // Create chat options - only include history if it's not empty
    const chatOptions: any = {
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 1024,
      },
    }

    // Only add history if there are messages to add
    if (formattedHistory.length > 0) {
      chatOptions.history = formattedHistory
    }

    // Start a chat session
    const chatSession = model.startChat(chatOptions)

    // Send the message and get the response
    const result = await chatSession.sendMessage(message)
    const responseText = result.response.text()

    return NextResponse.json({ message: responseText })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

