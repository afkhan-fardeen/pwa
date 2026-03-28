ALTER TABLE "daily_logs" ADD COLUMN "salat_saved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_logs" ADD COLUMN "quran_saved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_logs" ADD COLUMN "hadith_saved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
UPDATE "daily_logs" SET "salat_saved" = true, "quran_saved" = true, "hadith_saved" = true;
