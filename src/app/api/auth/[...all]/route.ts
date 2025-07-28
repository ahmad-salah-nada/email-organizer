import { auth } from "@/lib/auth"
import "@/lib/init-db" // Initialize database tables

export const GET = auth.handler
export const POST = auth.handler
