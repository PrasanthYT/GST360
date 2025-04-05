"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, X, MessageSquare, Loader2, Bot, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function GSTExpert() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm GST Expert, your tax assistant. Ask me any question about GST or taxation in India.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Simulate Gemini AI behavior with the training data from file 2
  const taxationTrainingData = [
    {
      question: "What is GST?",
      answer: "GST (Goods and Services Tax) is a unified indirect tax system in India that replaced multiple taxes like VAT, service tax, and excise duty.",
    },
    {
      question: "How many types of GST are there?",
      answer: "There are four types: CGST, SGST, IGST, and UTGST.",
    },
    {
      question: "What is the GST rate in India?",
      answer: "GST rates are 0%, 5%, 12%, 18%, and 28% depending on the item or service.",
    },
    {
      question: "Who needs to register for GST?",
      answer: "Businesses with turnover above ₹40 lakh (₹20 lakh for services) must register. It's ₹20 lakh/₹10 lakh for special category states.",
    },
    {
      question: "What is GSTIN?",
      answer: "GSTIN is a 15-digit unique identification number assigned to a registered taxpayer under GST.",
    },
    {
      question: "What is the threshold limit for GST registration?",
      answer: "₹40 lakh for goods and ₹20 lakh for services. ₹20 lakh and ₹10 lakh for special states.",
    },
    {
      question: "Is GST registration free?",
      answer: "Yes, GST registration on the GST portal is completely free of cost.",
    },
    {
      question: "What is the HSN code?",
      answer: "HSN (Harmonized System of Nomenclature) code is used to classify goods under GST.",
    },
    {
      question: "What is the SAC code?",
      answer: "SAC (Services Accounting Code) is used to classify services under GST.",
    },
    {
      question: "What is exempt from GST?",
      answer: "Essential goods like milk, fruits, vegetables, education services, and healthcare are exempt.",
    },
    {
      question: "How to register for GST online?",
      answer: "Visit gst.gov.in, go to 'Services' > 'Registration' > 'New Registration', and follow the steps.",
    },
    {
      question: "What are the documents required for GST registration?",
      answer: "PAN, Aadhaar, address proof, bank details, and photographs of key persons.",
    },
    {
      question: "What is GSTR-1?",
      answer: "It is a return for reporting details of outward supplies of goods and services.",
    },
    {
      question: "What is GSTR-3B?",
      answer: "GSTR-3B is a monthly summary return of inward and outward supplies, and tax liability.",
    },
    {
      question: "When to file GSTR-1?",
      answer: "Monthly by the 11th of the next month or quarterly depending on turnover.",
    },
    {
      question: "When to file GSTR-3B?",
      answer: "Usually by the 20th of the next month.",
    },
    {
      question: "What is the composition scheme in GST?",
      answer: "It's for small businesses with turnover up to ₹1.5 crore to pay tax at a fixed rate with less compliance.",
    },
    {
      question: "Can I cancel my GST registration?",
      answer: "Yes, you can apply for cancellation on the GST portal with a valid reason.",
    },
    {
      question: "What is ARN in GST?",
      answer: "ARN (Application Reference Number) is generated after submission of GST registration or amendment request.",
    },
    {
      question: "How to check GST return filing status?",
      answer: "Log in to gst.gov.in and go to 'Services' > 'Returns' > 'Track Return Status'.",
    },
    {
      question: "What is Input Tax Credit (ITC)?",
      answer: "ITC is the credit on input taxes paid on purchases used for business. It can be used to offset output tax liability.",
    },
    {
      question: "Can I claim ITC on capital goods?",
      answer: "Yes, if used for business purposes and not restricted under Section 17(5).",
    },
    {
      question: "What are taxes?",
      answer: "Taxes are mandatory financial charges imposed by the government on individuals or businesses to fund public services and infrastructure.",
    },
    {
      question: "What is income tax?",
      answer: "Income tax is a direct tax paid by individuals and businesses on their earned income based on applicable tax slabs in India.",
    },
    {
      question: "What is GSTR-9?",
      answer: "GSTR-9 is the annual return to be filed by regular taxpayers under GST.",
    },
    {
      question: "Who needs to file GSTR-9C?",
      answer: "Taxpayers with turnover above ₹5 crore need to file GSTR-9C – a reconciliation statement.",
    },
    {
      question: "What is reverse charge mechanism?",
      answer: "In RCM, the recipient of goods/services pays the GST instead of the supplier.",
    },
    {
      question: "What is the QRMP scheme?",
      answer: "Quarterly Return Filing and Monthly Payment scheme for taxpayers with turnover up to ₹5 crore.",
    },
    {
      question: "What is GSTR-2B?",
      answer: "Auto-drafted ITC statement generated for buyers from suppliers' GSTR-1, 5, 6.",
    },
    {
      question: "Is Aadhaar authentication mandatory for GST?",
      answer: "Yes, for new registrations and certain amendments, Aadhaar authentication is required.",
    },
    {
      question: "Can a person have multiple GST registrations?",
      answer: "Yes, for different states or business verticals in the same state.",
    },
    {
      question: "What are the best ways to legally reduce tax liability?",
      answer: "Taxpayers can reduce tax liability by utilizing deductions under Section 80C, 80D, 80E, investing in tax-saving instruments, and optimizing salary components.",
    }
  ]

  // Simple NLP function to find the best match for a user query
  const findBestAnswer = (query: string) => {
    // Normalize query (lowercase, remove extra spaces)
    const normalizedQuery = query.toLowerCase().trim()
    
    // First check for keyword matches
    if (!normalizedQuery || normalizedQuery.length < 2) {
      return "Please ask a question about GST or taxation in India."
    }
    
    // Check if the query is not tax-related
    const nonTaxKeywords = ["hello", "hi", "hey", "your name", "how are you", "weather", "sports", "movies", "food"]
    if (nonTaxKeywords.some(keyword => normalizedQuery.includes(keyword))) {
      return "I'm trained only to answer questions related to taxation in India. Please ask something related to tax or GST."
    }
    
    // Check for direct keyword matches first
    const keywordMatches = {
      "gst": "GST (Goods and Services Tax) is a unified indirect tax system in India that replaced multiple taxes like VAT, service tax, and excise duty.",
      "tax": "Taxes are mandatory financial charges imposed by the government on individuals or businesses to fund public services and infrastructure.",
      "itc": "ITC is the credit on input taxes paid on purchases used for business. It can be used to offset output tax liability.",
      "input tax credit": "ITC is the credit on input taxes paid on purchases used for business. It can be used to offset output tax liability.",
    }
    
    for (const [keyword, answer] of Object.entries(keywordMatches)) {
      if (normalizedQuery === keyword || normalizedQuery.includes(keyword)) {
        return answer
      }
    }
    
    // Try to find the best match from training data
    let bestMatch = null
    let highestScore = -1
    
    for (const item of taxationTrainingData) {
      // Calculate a simple relevance score
      const score = calculateRelevanceScore(normalizedQuery, item.question.toLowerCase())
      
      if (score > highestScore) {
        highestScore = score
        bestMatch = item.answer
      }
    }
    
    // Return the best match if score is above threshold, otherwise default response
    return highestScore > 0.2 
      ? bestMatch 
      : "I'm trained only to answer questions related to taxation in India. Please ask something related to tax or GST."
  }
  
  // Simple function to calculate relevance score between query and potential answer
  const calculateRelevanceScore = (query: string, question: string) => {
    // Split into words
    const queryWords = query.split(/\s+/)
    const questionWords = question.split(/\s+/)
    
    // Count matching words
    let matchCount = 0
    for (const word of queryWords) {
      if (word.length > 2 && questionWords.includes(word)) {
        matchCount++
      }
    }
    
    // Calculate score based on matches and query length
    return matchCount / Math.max(queryWords.length, questionWords.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // Simulate API delay
      setTimeout(() => {
        const response = findBestAnswer(userMessage)
        setMessages((prev) => [...prev, { role: "assistant", content: response }])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error getting response:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again later." },
      ])
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-card border rounded-lg shadow-lg w-80 sm:w-96 mb-4 overflow-hidden flex flex-col"
            style={{ height: "500px" }}
          >
            <div className="bg-primary p-3 text-primary-foreground flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <h3 className="font-medium">GST Expert</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, i) => (
                  <div key={i} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3",
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === "assistant" && (
                          <Avatar className="h-6 w-6 bg-primary/10">
                            <Bot className="h-4 w-4 text-primary" />
                          </Avatar>
                        )}
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        {message.role === "user" && (
                          <Avatar className="h-6 w-6 bg-primary">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 bg-primary/10">
                          <Bot className="h-4 w-4 text-primary" />
                        </Avatar>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about GST or taxation..."
                className="min-h-10 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="h-12 w-12 rounded-full shadow-lg">
          <MessageSquare className="h-6 w-6" />
        </Button>
        <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
      </motion.div>
    </div>
  )
}