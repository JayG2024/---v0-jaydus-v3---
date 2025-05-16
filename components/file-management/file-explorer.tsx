"use client"

import { useState } from "react"
import { Folder, FileCode, ChevronRight, MoreHorizontal, Download, Trash2, Edit, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

// Mock data for demonstration
const mockFolders = [
  {
    id: "1",
    name: "Project A",
    files: [
      { id: "f1", name: "index.js", type: "javascript", size: 2048, lastModified: "2023-05-10" },
      { id: "f2", name: "styles.css", type: "css", size: 1024, lastModified: "2023-05-09" },
    ],
    folders: [
      {
        id: "1-1",
        name: "Components",
        files: [
          { id: "f3", name: "Button.jsx", type: "jsx", size: 3072, lastModified: "2023-05-08" },
          { id: "f4", name: "Card.jsx", type: "jsx", size: 4096, lastModified: "2023-05-07" },
        ],
        folders: [],
      },
    ],
  },
  {
    id: "2",
    name: "Project B",
    files: [
      { id: "f5", name: "main.py", type: "python", size: 5120, lastModified: "2023-05-06" },
      { id: "f6", name: "utils.py", type: "python", size: 3584, lastModified: "2023-05-05" },
    ],
    folders: [],
  },
]

interface File {
  id: string
  name: string
  type: string
  size: number
  lastModified: string
}

interface FolderType {
  id: string
  name: string
  files: File[]
  folders: FolderType[]
}

export default function FileExplorer() {
  const [folders, setFolders] = useState<FolderType[]>(mockFolders)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<{ type: "file" | "folder"; item: any } | null>(null)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "1": true, // Project A is expanded by default
  })

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const handleRename = () => {
    if (!selectedItem || !newName.trim()) return

    // Implementation would update the state tree
    // This is a simplified version
    if (selectedItem.type === "file") {
      // Update file name logic
      console.log(`Renamed file ${selectedItem.item.name} to ${newName}`)
    } else {
      // Update folder name logic
      console.log(`Renamed folder ${selectedItem.item.name} to ${newName}`)
    }

    setIsRenameDialogOpen(false)
    setNewName("")
    setSelectedItem(null)
  }

  const handleDelete = () => {
    if (!selectedItem) return

    // Implementation would update the state tree
    // This is a simplified version
    if (selectedItem.type === "file") {
      // Delete file logic
      console.log(`Deleted file ${selectedItem.item.name}`)
    } else {
      // Delete folder logic
      console.log(`Deleted folder ${selectedItem.item.name}`)
    }

    setIsDeleteDialogOpen(false)
    setSelectedItem(null)
  }

  const openRenameDialog = (type: "file" | "folder", item: any) => {
    setSelectedItem({ type, item })
    setNewName(item.name)
    setIsRenameDialogOpen(true)
  }

  const openDeleteDialog = (type: "file" | "folder", item: any) => {
    setSelectedItem({ type, item })
    setIsDeleteDialogOpen(true)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const renderFolder = (folder: FolderType, depth = 0) => {
    const isExpanded = expandedFolders[folder.id] || false

    return (
      <div key={folder.id} className="space-y-1">
        <Collapsible open={isExpanded} onOpenChange={() => toggleFolder(folder.id)}>
          <div className="flex items-center group">
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
            >
              <Folder className={cn("h-4 w-4", depth > 0 ? "text-muted-foreground" : "text-primary")} />
              <span className="flex-1 truncate">{folder.name}</span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => openRenameDialog("folder", folder)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openDeleteDialog("folder", folder)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CollapsibleContent className="pl-6 mt-1">
            {folder.folders.length > 0 && (
              <div className="space-y-1">{folder.folders.map((subFolder) => renderFolder(subFolder, depth + 1))}</div>
            )}

            {folder.files.length > 0 && (
              <div className="space-y-1 mt-1">{folder.files.map((file) => renderFile(file, depth + 1))}</div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  }

  const renderFile = (file: File, depth = 0) => {
    return (
      <div key={file.id} className="flex items-center group pl-8 rounded-md hover:bg-muted/50 cursor-pointer">
        <div className="flex flex-1 items-center gap-2 py-1.5 px-2">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          <span className={cn("flex-1 truncate", depth > 0 ? "text-sm" : "")}>{file.name}</span>
          <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openRenameDialog("file", file)}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openDeleteDialog("file", file)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Folder
        </Button>
      </div>

      <div className="border rounded-md">
        <div className="p-4 space-y-2">{folders.map((folder) => renderFolder(folder))}</div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename {selectedItem?.type}</DialogTitle>
            <DialogDescription>Enter a new name for this {selectedItem?.type}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete {selectedItem?.type}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItem?.item?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
