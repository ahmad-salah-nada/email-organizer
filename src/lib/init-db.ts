import Database from "better-sqlite3"
import path from "path"

let isInitialized = false

export async function initializeDatabase() {
  if (isInitialized) return true
  
  try {
    // Get the database instance from auth
    const dbPath = path.join(process.cwd(), "database.db")
    const db = new Database(dbPath)
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON')
    
        // Create user table with organization support (BetterAuth compatible schema)
    db.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        emailVerified BOOLEAN NOT NULL DEFAULT false,
        image TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Add activeOrganizationId column
    try {
      db.exec(`ALTER TABLE user ADD COLUMN activeOrganizationId TEXT`)
      console.log('Added activeOrganizationId column to user table')
    } catch (error) {
      // Column might already exist, ignore error
      console.log('activeOrganizationId column already exists or error:', error)
    }
    
    // Create account table for credentials
    db.exec(`
      CREATE TABLE IF NOT EXISTS account (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        accountId TEXT NOT NULL,
        providerId TEXT NOT NULL,
        accessToken TEXT,
        refreshToken TEXT,
        idToken TEXT,
        expiresAt DATETIME,
        password TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
      )
    `)
    
    // Create session table
    db.exec(`
      CREATE TABLE IF NOT EXISTS session (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        expiresAt DATETIME NOT NULL,
        ipAddress TEXT,
        userAgent TEXT,
        token TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
      )
    `)
    
    // Create verification table
    db.exec(`
      CREATE TABLE IF NOT EXISTS verification (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create organization table (BetterAuth compatible)
    db.exec(`
      CREATE TABLE IF NOT EXISTS organization (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        logo TEXT,
        metadata TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create member table (BetterAuth expects this name)
    db.exec(`
      CREATE TABLE IF NOT EXISTS member (
        id TEXT PRIMARY KEY,
        organizationId TEXT NOT NULL,
        userId TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizationId) REFERENCES organization(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
        UNIQUE(organizationId, userId)
      )
    `)
    
    // Create invitation table (BetterAuth expects this name)
    db.exec(`
      CREATE TABLE IF NOT EXISTS invitation (
        id TEXT PRIMARY KEY,
        organizationId TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member',
        status TEXT NOT NULL DEFAULT 'pending',
        expiresAt DATETIME NOT NULL,
        inviterId TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizationId) REFERENCES organization(id) ON DELETE CASCADE,
        FOREIGN KEY (inviterId) REFERENCES user(id) ON DELETE CASCADE
      )
    `)
    
    console.log('Database tables created successfully')
    db.close()
    isInitialized = true
    return true
  } catch (error) {
    console.error('Failed to initialize database:', error)
    return false
  }
}

// Initialize database on import (only once)
initializeDatabase()
