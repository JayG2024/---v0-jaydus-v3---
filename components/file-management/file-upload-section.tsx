"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileCode, X, Check, AlertCircle, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import ZipHandler from "./zip-handler"
import { Dialog, DialogContent } from "@/components/ui/dialog"

type FileStatus = "idle" | "uploading" | "success" | "error"

interface FileWithStatus {
  file: File
  status: FileStatus
  progress: number
  id: string
  error?: string
}

export default function FileUploadSection() {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [zipFile, setZipFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files))
    }
  }

  const handleZipFile = (file: File) => {
    if (file.type === "application/zip" || file.name.endsWith(".zip")) {
      setZipFile(file)
      return true
    }
    return false
  }

  const addFiles = (newFiles: File[]) => {
    const filesToProcess = newFiles.filter((file) => !handleZipFile(file))

    const filesToAdd = filesToProcess.map((file) => ({
      file,
      status: "idle" as FileStatus,
      progress: 0,
      id: crypto.randomUUID(),
    }))

    setFiles((prev) => [...prev, ...filesToAdd])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const uploadFiles = async () => {
    // Filter only idle files
    const filesToUpload = files.filter((f) => f.status === "idle")

    if (filesToUpload.length === 0) {
      toast({
        title: "No files to upload",
        description: "Please add files first",
        variant: "destructive",
      })
      return
    }

    // Update status to uploading
    setFiles((prev) => prev.map((f) => (filesToUpload.some((u) => u.id === f.id) ? { ...f, status: "uploading" } : f)))

    // Process each file
    for (const fileData of filesToUpload) {
      try {
        // Simulate upload with progress
        await simulateFileUpload(fileData.id)

        // Mark as success
        setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, status: "success", progress: 100 } : f)))
      } catch (error) {
        // Mark as error
        setFiles((prev) =>
          prev.map((f) => (f.id === fileData.id ? { ...f, status: "error", error: "Upload failed" } : f)),
        )
      }
    }

    toast({
      title: "Files uploaded successfully",
      description: `${filesToUpload.length} file(s) have been uploaded`,
    })
  }

  // Simulate file upload with progress
  const simulateFileUpload = (fileId: string): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5

        if (progress >= 100) {
          clearInterval(interval)
          progress = 100
          resolve()
        }

        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }, 300)
    })
  }

  const getFileIcon = (file: File) => {
    // Check if it's a code file
    const codeExtensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".py",
      ".java",
      ".c",
      ".cpp",
      ".cs",
      ".go",
      ".rb",
      ".php",
      ".html",
      ".css",
      ".json",
    ]
    const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

    if (codeExtensions.includes(extension)) {
      return <FileCode className="h-8 w-8 text-primary" />
    }

    const archiveExtensions = [".zip", ".rar", ".tar", ".gz", ".7z"]
    if (archiveExtensions.includes(extension)) {
      return <Archive className="h-8 w-8 text-amber-500" />
    }

    return <FileCode className="h-8 w-8 text-muted-foreground" />
  }

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "uploading":
        return null
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors",
              isDragging ? "border-primary bg-muted/50" : "border-muted-foreground/25",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
            <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground">
              <Upload className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Drag & drop files or click to browse</h3>
                <p>Upload source code files for AI analysis and training</p>
                <p className="text-sm">Supports JavaScript, TypeScript, Python, Java, C++, and other code files</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Files to upload ({files.length})</h3>
            <Button onClick={uploadFiles} disabled={files.every((f) => f.status !== "idle")}>
              Upload All Files
            </Button>
          </div>

          <div className="space-y-3">
            {files.map((fileData) => (
              <div key={fileData.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
                <div className="flex items-center space-x-3">
                  {getFileIcon(fileData.file)}
                  <div>
                    <p className="font-medium truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                      {fileData.file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{(fileData.file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {fileData.status === "uploading" && (
                    <div className="w-24">
                      <Progress value={fileData.progress} className="h-2" />
                    </div>
                  )}

                  {getStatusIcon(fileData.status)}

                  {fileData.status === "idle" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(fileData.id)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {zipFile && (
        <Dialog open={!!zipFile} onOpenChange={(open) => !open && setZipFile(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <ZipHandler
              file={zipFile}
              onExtract={(entries, extractedFiles) => {
                // Add the extracted files to the upload queue
                const filesToAdd = extractedFiles.map((file) => ({
                  file,
                  status: "idle" as FileStatus,
                  progress: 0,
                  id: crypto.randomUUID(),
                }))

                setFiles((prev) => [...prev, ...filesToAdd])
                setZipFile(null)
              }}
              onClose={() => setZipFile(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
