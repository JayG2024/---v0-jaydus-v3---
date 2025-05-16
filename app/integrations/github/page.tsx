import type { Metadata } from "next"
import GitHubConnector from "@/components/integrations/github-connector"

export const metadata: Metadata = {
  title: "GitHub Integration | Jaydus AI",
  description: "Connect to GitHub and import repositories",
}

export default function GitHubIntegrationPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GitHub Integration</h1>
          <p className="text-muted-foreground mt-2">
            Connect to GitHub to import repositories for AI analysis and training
          </p>
        </div>

        <GitHubConnector />
      </div>
    </div>
  )
}
