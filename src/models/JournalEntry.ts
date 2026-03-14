import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJournalEntry extends Document {
  userId: string;
  ambience: string;
  text: string;
  emotion?: string;
  keywords: string[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    ambience: { type: String, required: true },
    text: { type: String, required: true },
    emotion: { type: String },
    keywords: { type: [String], default: [] },
    summary: { type: String },
  },
  { timestamps: true }
);

const JournalEntry: Model<IJournalEntry> =
  mongoose.models.JournalEntry || mongoose.model<IJournalEntry>("JournalEntry", JournalEntrySchema);

export default JournalEntry;
