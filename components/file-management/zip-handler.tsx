"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Archive, FileText, Folder, ChevronRight, Download } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ZipEntry {
  name: string
  path: string
  type: "file" | "directory"
  size?: number
  children?: ZipEntry[]
}

interface ZipHandlerProps {
  file: File
  onExtract?: (entries: ZipEntry[], extractedFiles: File[]) => void
  onClose?: () => void
}

export default function ZipHandler({ file, onExtract, onClose }: ZipHandlerProps) {
  const [zipContents, setZipContents] = useState<ZipEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set())

  const analyzeZip = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, we would use a library like jszip
      // to analyze the zip file contents

      // Mock implementation for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a mock file structure
      const mockContents: ZipEntry[] = [
        {
          name: "src",
          path: "src",
          type: "directory",
          children: [
            {
              name: "components",
              path: "src/components",
              type: "directory",
              children: [
                { name: "Button.tsx", path: "src/components/Button.tsx", type: "file", size: 2048 },
                { name: "Card.tsx", path: "src/components/Card.tsx", type: "file", size: 3072 },
              ],
            },
            {
              name: "utils",
              path: "src/utils",
              type: "directory",
              children: [{ name: "helpers.ts", path: "src/utils/helpers.ts", type: "file", size: 1024 }],
            },
            { name: "index.ts", path: "src/index.ts", type: "file", size: 512 },
          ],
        },
        {
          name: "public",
          path: "public",
          type: "directory",
          children: [{ name: "logo.svg", path: "public/logo.svg", type: "file", size: 4096 }],
        },
        { name: "package.json", path: "package.json", type: "file", size: 1536 },
        { name: "README.md", path: "README.md", type: "file", size: 2560 },
      ]

      setZipContents(mockContents)
    } catch (error) {
      console.error("Error analyzing zip:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const extractFiles = async () => {
    setIsExtracting(true)
    try {
      // In a real implementation, we would use jszip to extract
      // the selected files from the zip

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create mock extracted files
      const extractedFiles: File[] = Array.from(selectedEntries)
        .filter((path) => !path.endsWith("/"))
        .map((path) => {
          const name = path.split("/").pop() || ""
          // Create a mock file with the correct name
          return new File(["mock content"], name, {
            type: name.endsWith(".json") ? "application/json" : name.endsWith(".md") ? "text/markdown" : "text/plain",
          })
        })

      // Find the corresponding ZipEntry objects
      const selectedZipEntries = findSelectedEntries(zipContents, selectedEntries)

      if (onExtract) {
        onExtract(selectedZipEntries, extractedFiles)
      }
    } catch (error) {
      console.error("Error extracting files:", error)
    } finally {
      setIsExtracting(false)
    }
  }

  const findSelectedEntries = (entries: ZipEntry[], selectedPaths: Set<string>): ZipEntry[] => {
    const result: ZipEntry[] = []

    const traverse = (entry: ZipEntry) => {
      if (selectedPaths.has(entry.path)) {
        result.push(entry)
      }

      if (entry.children) {
        entry.children.forEach(traverse)
      }
    }

    entries.forEach(traverse)
    return result
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  const toggleSelectEntry = (path: string, type: "file" | "directory") => {
    const newSelected = new Set(selectedEntries)

    if (newSelected.has(path)) {
      newSelected.delete(path)

      // If it's a directory, also deselect all children
      if (type === "directory") {
        Array.from(newSelected).forEach((p) => {
          if (p.startsWith(path + "/")) {
            newSelected.delete(p)
          }
        })
      }
    } else {
      newSelected.add(path)
    }

    setSelectedEntries(newSelected)
  }

  const formatFileSize = (bytes?: number) => {
    if (bytes === undefined) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const renderEntry = (entry: ZipEntry, depth = 0) => {
    const isExpanded = expandedFolders[entry.path] || false
    const isSelected = selectedEntries.has(entry.path)

    if (entry.type === "directory") {
      return (
        <div key={entry.path} className="space-y-1">
          <Collapsible open={isExpanded} onOpenChange={() => toggleFolder(entry.path)}>
            <div className="flex items-center group">
              <div className="flex items-center mr-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectEntry(entry.path, "directory")}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 data-[state=open]:rotate-90 transition-transform"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Toggle folder</span>
                </Button>
              </CollapsibleTrigger>

              <div
                className={cn(
                  "flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 cursor-pointer",
                  depth > 0 ? "text-sm" : "font-medium",
                )}
                onClick={() => toggleSelectEntry(entry.path, "directory")}
              >
                <Folder className={cn("h-4 w-4", depth > 0 ? "text-muted-foreground" : "text-primary")} />
                <span className="flex-1 truncate">{entry.name}</span>
              </div>
            </div>

            <CollapsibleContent className="pl-8 mt-1">
              {entry.children && entry.children.length > 0 && (
                <div className="space-y-1">{entry.children.map((child) => renderEntry(child, depth + 1))}</div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      )
    } else {
      return (
        <div
          key={entry.path}
          className="flex items-center pl-8 rounded-md hover:bg-muted/50 cursor-pointer"
          onClick={() => toggleSelectEntry(entry.path, "file")}
        >
          <div className="flex items-center mr-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelectEntry(entry.path, "file")}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>

          <div className="flex flex-1 items-center gap-2 py-1.5 px-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className={cn("flex-1 truncate", depth > 0 ? "text-sm" : "")}>{entry.name}</span>
            <span className="text-xs text-muted-foreground">{formatFileSize(entry.size)}</span>
          </div>
        </div>
      )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          {file.name}
        </CardTitle>
        <CardDescription>{formatFileSize(file.size)} • Zip Archive</CardDescription>
      </CardHeader>
      <CardContent>
        {zipContents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Archive className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-medium">Analyze zip contents</h3>
              <p className="text-sm text-muted-foreground">View the contents of this zip file before extracting</p>
            </div>
            <Button onClick={analyzeZip} disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Analyze Contents"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Archive Contents ({selectedEntries.size} selected)</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEntries(new Set())}
                disabled={selectedEntries.size === 0}
              >
                Clear Selection
              </Button>
            </div>

            <ScrollArea className="h-[300px] border rounded-md p-2">
              <div className="space-y-1">{zipContents.map((entry) => renderEntry(entry))}</div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={zipContents.length === 0}
            onClick={() => window.open(URL.createObjectURL(file), "_blank")}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button disabled={selectedEntries.size === 0 || isExtracting} onClick={extractFiles}>
            {isExtracting ? "Extracting..." : "Extract Selected"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
