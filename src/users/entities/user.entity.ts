export class User {
  id: string;
  signupTime: number;
  PIKBackup?: string | null;
  PSKBackup?: string | null;
  RCKBackup?: string | null;
  version: string;

  constructor(data: {
    id: string;
    signupTime: number;
    version: string;
    PIKBackup?: string | null;
    PSKBackup?: string | null;
    RCKBackup?: string | null;
  }) {
    this.id = data.id;
    this.signupTime = data.signupTime;
    this.version = data.version;
    this.PIKBackup = data.PIKBackup ?? null;
    this.PSKBackup = data.PSKBackup ?? null;
    this.RCKBackup = data.RCKBackup ?? null;
  }

  static createTableSQL(): string {
    return `CREATE TABLE IF NOT EXISTS users (id TEXT NOT NULL PRIMARY KEY, signupTime NUMBER NOT NULL, PIKBackup TEXT, PSKBackup TEXT, RCKBackup TEXT, version TEXT NOT NULL);`;
  }

  toRow(): Record<string, any> {
    return {
      id: this.id,
      signupTime: this.signupTime,
      PIKBackup: this.PIKBackup,
      PSKBackup: this.PSKBackup,
      RCKBackup: this.RCKBackup,
      version: this.version,
    };
  }

  static fromRow(row: Record<string, any>): User {
    return new User({
      id: String(row.id),
      signupTime: Number(row.signupTime),
      version: String(row.version),
      PIKBackup: row.PIKBackup ?? null,
      PSKBackup: row.PSKBackup ?? null,
      RCKBackup: row.RCKBackup ?? null,
    });
  }
}
