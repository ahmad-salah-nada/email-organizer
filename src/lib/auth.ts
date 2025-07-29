import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"
import Database from "better-sqlite3"
import path from "path"

// Initialize database with proper setup
const dbPath = path.join(process.cwd(), "database.db")
const database = new Database(dbPath)

// Enable foreign keys
database.pragma('foreign_keys = ON')

export const auth = betterAuth({
  database,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable email verification for demo
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every day the session expiry is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache for 5 minutes
    }
  },
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-key-for-development-only-do-not-use-in-production",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: ["http://localhost:3000", "http://localhost:3001"],
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      creatorRole: "owner",
      membershipLimit: 50,
    })
  ],
})

export type Session = typeof auth.$Infer.Session.session & {
  user: typeof auth.$Infer.Session.user
}
