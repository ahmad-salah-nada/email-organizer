declare module 'imap-simple' {
  interface ImapConfig {
    imap: {
      user: string
      password: string
      host: string
      port: number
      tls: boolean
      authTimeout?: number
    }
  }

  interface ImapConnection {
    openBox(boxName: string): Promise<unknown>
    search(criteria: string[], options: unknown): Promise<unknown[]>
    end(): void
  }

  interface ImapSimple {
    connect(config: ImapConfig): Promise<ImapConnection>
    parseHeader(header: unknown): Record<string, string[]>
  }
  
  const imapSimple: ImapSimple
  export = imapSimple
}
