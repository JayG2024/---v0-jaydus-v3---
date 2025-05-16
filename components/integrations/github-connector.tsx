"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Github, Search, FolderGit, GitBranch, Check, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { importGitHubRepo } from "@/lib/github-service"

interface Repository {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  default_branch: string
  stargazers_count: number
  updated_at: string
  language: string
  owner: {
    login: string
    avatar_url: string
  }
}

interface Branch {
  name: string
  commit: {
    sha: string
  }
}

export default function GitHubConnector() {
  const [isConnected, setIsConnected] = useState(false)
  const [personalAccessToken, setPersonalAccessToken] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [isLoadingBranches, setIsLoadingBranches] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const { toast } = useToast()

  const connectToGitHub = async () => {
    if (!personalAccessToken) {
      toast({
        title: "Token required",
        description: "Please enter a personal access token",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      // In a real implementation, we would validate the token by making a request to the GitHub API
      // For this demo, we'll simulate a successful connection after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store the token securely (in a real implementation, this would be done server-side)
      localStorage.setItem("github_pat", personalAccessToken)
      setIsConnected(true)

      toast({
        title: "Connected to GitHub",
        description: "Your GitHub account has been successfully connected",
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to GitHub. Please check your token and try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectFromGitHub = () => {
    // Remove the token
    localStorage.removeItem("github_pat")
    setIsConnected(false)
    setRepositories([])
    setSelectedRepo(null)
    setBranches([])
    setSelectedBranch("")

    toast({
      title: "Disconnected from GitHub",
      description: "Your GitHub account has been disconnected",
    })
  }

  const searchRepositories = async () => {
    if (!searchQuery) {
      toast({
        title: "Search query required",
        description: "Please enter a search term",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)

    try {
      // In a real implementation, we would make a request to the GitHub API
      // For this demo, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock repositories data
      const mockRepos: Repository[] = [
        {
          id: 1,
          name: "react-project",
          full_name: "user/react-project",
          description: "A React project with TypeScript and Next.js",
          html_url: "https://github.com/user/react-project",
          default_branch: "main",
          stargazers_count: 120,
          updated_at: "2023-05-15T12:00:00Z",
          language: "TypeScript",
          owner: {
            login: "user",
            avatar_url: "https://github.com/user.png",
          },
        },
        {
          id: 2,
          name: "python-ml",
          full_name: "user/python-ml",
          description: "Machine learning algorithms implemented in Python",
          html_url: "https://github.com/user/python-ml",
          default_branch: "master",
          stargazers_count: 85,
          updated_at: "2023-04-20T10:30:00Z",
          language: "Python",
          owner: {
            login: "user",
            avatar_url: "https://github.com/user.png",
          },
        },
        {
          id: 3,
          name: "node-api",
          full_name: "organization/node-api",
          description: "RESTful API built with Node.js and Express",
          html_url: "https://github.com/organization/node-api",
          default_branch: "main",
          stargazers_count: 210,
          updated_at: "2023-06-01T09:15:00Z",
          language: "JavaScript",
          owner: {
            login: "organization",
            avatar_url: "https://github.com/organization.png",
          },
        },
      ]

      setRepositories(mockRepos)
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search repositories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const selectRepository = async (repo: Repository) => {
    setSelectedRepo(repo)
    setIsLoadingBranches(true)

    try {
      // In a real implementation, we would fetch branches from the GitHub API
      // For this demo, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock branches data
      const mockBranches: Branch[] = [
        {
          name: repo.default_branch,
          commit: { sha: "abc123" },
        },
        {
          name: "develop",
          commit: { sha: "def456" },
        },
        {
          name: "feature/new-ui",
          commit: { sha: "ghi789" },
        },
      ]

      setBranches(mockBranches)
      setSelectedBranch(repo.default_branch)
    } catch (error) {
      toast({
        title: "Failed to load branches",
        description: "Could not load repository branches. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingBranches(false)
    }
  }

  const importRepository = async () => {
    if (!selectedRepo || !selectedBranch) {
      toast({
        title: "Selection required",
        description: "Please select a repository and branch",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)

    try {
      // In a real implementation, we would call our API to clone the repository
      await importGitHubRepo(selectedRepo.full_name, selectedBranch)

      toast({
        title: "Repository imported",
        description: `Successfully imported ${selectedRepo.full_name} (${selectedBranch})`,
      })

      // Close the dialog
      setImportDialogOpen(false)
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import repository. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Integration
        </CardTitle>
        <CardDescription>Connect to GitHub to import repositories</CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pat">Personal Access Token</Label>
              <Input
                id="pat"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={personalAccessToken}
                onChange={(e) => setPersonalAccessToken(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Create a token with <code>repo</code> scope at{" "}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub Settings
                </a>
              </p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search Repositories</TabsTrigger>
              <TabsTrigger value="import">Import Repository</TabsTrigger>
            </TabsList>
            <TabsContent value="search" className="space-y-4 mt-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search repositories..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchRepositories()}
                  />
                </div>
                <Button onClick={searchRepositories} disabled={isSearching}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Search
                </Button>
              </div>

              {repositories.length > 0 && (
                <ScrollArea className="h-[300px] rounded-md border">
                  <div className="p-4 space-y-4">
                    {repositories.map((repo) => (
                      <div
                        key={repo.id}
                        className="p-4 border rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => selectRepository(repo)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-medium">{repo.name}</h3>
                            <p className="text-sm text-muted-foreground">{repo.full_name}</p>
                            {repo.description && <p className="text-sm">{repo.description}</p>}
                          </div>
                          {selectedRepo?.id === repo.id && <Check className="h-5 w-5 text-green-500" />}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          {repo.language && <span>{repo.language}</span>}
                          <span>⭐ {repo.stargazers_count}</span>
                          <span>Updated {formatDate(repo.updated_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
            <TabsContent value="import" className="space-y-4 mt-4">
              {selectedRepo ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{selectedRepo.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedRepo.full_name}</p>
                        {selectedRepo.description && <p className="text-sm">{selectedRepo.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {selectedRepo.language && <span>{selectedRepo.language}</span>}
                      <span>⭐ {selectedRepo.stargazers_count}</span>
                      <span>Updated {formatDate(selectedRepo.updated_at)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Branch</Label>
                    {isLoadingBranches ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <RadioGroup value={selectedBranch} onValueChange={setSelectedBranch}>
                        {branches.map((branch) => (
                          <div key={branch.name} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                            <RadioGroupItem value={branch.name} id={branch.name} />
                            <Label htmlFor={branch.name} className="flex items-center gap-2 cursor-pointer">
                              <GitBranch className="h-4 w-4 text-muted-foreground" />
                              {branch.name}
                              {branch.name === selectedRepo.default_branch && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  default
                                </span>
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>

                  <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" disabled={!selectedBranch || isLoadingBranches}>
                        <FolderGit className="h-4 w-4 mr-2" />
                        Import Repository
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Import GitHub Repository</DialogTitle>
                        <DialogDescription>
                          This will import the repository into your Jaydus AI workspace. The files will be available in
                          your file management system.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="p-4 border rounded-md bg-muted/50 space-y-2">
                          <div className="flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            <span className="font-medium">{selectedRepo.full_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GitBranch className="h-4 w-4" />
                            <span>{selectedBranch}</span>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={importRepository} disabled={isImporting}>
                          {isImporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Confirm Import
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                  <FolderGit className="h-16 w-16 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">No repository selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Search for a repository first, then select it to import
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => document.querySelector('[value="search"]')?.click()}>
                    Search Repositories
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isConnected ? (
          <Button onClick={connectToGitHub} disabled={isConnecting}>
            {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Github className="h-4 w-4 mr-2" />}
            Connect to GitHub
          </Button>
        ) : (
          <Button variant="outline" onClick={disconnectFromGitHub}>
            Disconnect from GitHub
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
