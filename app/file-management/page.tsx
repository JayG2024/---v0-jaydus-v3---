import type { Metadata } from "next"
import FileUploadSection from "@/components/file-management/file-upload-section"
import FileExplorer from "@/components/file-management/file-explorer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "File Management | Jaydus AI",
  description: "Upload, organize, and manage your source code and other files",
}

export default function FileManagementPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Management</h1>
          <p className="text-muted-foreground mt-2">
            Upload, organize, and manage your source code and other files for AI analysis and training
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="manage">Manage Files</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-6">
            <FileUploadSection />
          </TabsContent>
          <TabsContent value="manage" className="mt-6">
            <FileExplorer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
