"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface CodePreviewProps {
  code: string
  language: string
  fileName: string
}

export default function CodePreview({ code, language, fileName }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)
  const [highlightedCode, setHighlightedCode] = useState(code)

  // In a real implementation, you would use a library like highlight.js or prism
  // to syntax highlight the code
  useEffect(() => {
    // Mock syntax highlighting
    setHighlightedCode(code)
  }, [code])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">{fileName}</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={copyToClipboard}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-2">
            <pre className="p-4 rounded-md bg-muted overflow-auto max-h-[500px]">
              <code className="text-sm font-mono">{highlightedCode}</code>
            </pre>
          </TabsContent>
          <TabsContent value="raw" className="mt-2">
            <pre className="p-4 rounded-md bg-muted overflow-auto max-h-[500px]">
              <code className="text-sm font-mono whitespace-pre-wrap">{code}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
