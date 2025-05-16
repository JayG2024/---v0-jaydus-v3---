"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import GitHubConnector from "@/components/integrations/github-connector"

export default function GitHubImportButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Github className="h-4 w-4 mr-2" />
          Import from GitHub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Import from GitHub</DialogTitle>
          <DialogDescription>Connect to GitHub and import repositories into your workspace</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <GitHubConnector />
        </div>
      </DialogContent>
    </Dialog>
  )
}
