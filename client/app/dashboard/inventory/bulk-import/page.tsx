"use client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText } from "lucide-react"
import { BillOcrParser } from "@/components/inventory/bill-ocr-parser"
import { useToast } from "@/hooks/use-toast"

export default function BulkImportPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleBack = () => {
    router.push("/dashboard/inventory")
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Bulk Import Products</h1>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Import Products from Purchase Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Upload purchase bills or invoices from your suppliers to automatically add products to your inventory. Our
              OCR technology will extract product details, pricing, and quantities.
            </p>

            <BillOcrParser />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

