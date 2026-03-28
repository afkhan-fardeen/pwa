CREATE TYPE "public"."aiyanat_status" AS ENUM('PAID', 'NOT_PAID');--> statement-breakpoint
CREATE TYPE "public"."avatar_kind" AS ENUM('INITIALS', 'IMAGE', 'EMOJI');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('MUSLIM', 'NON_MUSLIM');--> statement-breakpoint
CREATE TYPE "public"."gender_unit" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."halqa" AS ENUM('MANAMA', 'RIFFA', 'MUHARRAQ', 'UMM_AL_HASSAM');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('EN', 'UR');--> statement-breakpoint
CREATE TYPE "public"."prayer_status" AS ENUM('BA_JAMAAT', 'MUNFARID', 'QAZA', 'ON_TIME');--> statement-breakpoint
CREATE TYPE "public"."quran_type" AS ENUM('TILAWAT', 'TAFSEER', 'BOTH');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('MEMBER', 'SECRETARY', 'INCHARGE', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('PENDING', 'ACTIVE', 'REJECTED', 'DEACTIVATED');--> statement-breakpoint
CREATE TABLE "aiyanat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"month" varchar(7) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "aiyanat_status" NOT NULL,
	"payment_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "aiyanat_user_id_month_unique" UNIQUE("user_id","month")
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"log_date" date NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"location" varchar(255) NOT NULL,
	"status" "contact_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"fajr" "prayer_status" NOT NULL,
	"dhuhr" "prayer_status" NOT NULL,
	"asr" "prayer_status" NOT NULL,
	"maghrib" "prayer_status" NOT NULL,
	"isha" "prayer_status" NOT NULL,
	"quran_type" "quran_type" NOT NULL,
	"quran_surah" varchar(255) NOT NULL,
	"quran_pages" integer NOT NULL,
	"hadith" boolean NOT NULL,
	"literature_skipped" boolean DEFAULT false NOT NULL,
	"book_title" varchar(255),
	"book_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_logs_user_id_date_unique" UNIQUE("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "daily_unit_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"halqa" "halqa" NOT NULL,
	"gender_unit" "gender_unit" NOT NULL,
	"total_members" integer NOT NULL,
	"submitted_count" integer NOT NULL,
	"quran_pages_total" integer NOT NULL,
	"qaza_count" integer NOT NULL,
	"contacts_count" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_unit_stats_date_halqa_unit_unique" UNIQUE("date","halqa","gender_unit")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"phone" varchar(20) NOT NULL,
	"role" "user_role" NOT NULL,
	"halqa" "halqa" NOT NULL,
	"gender_unit" "gender_unit" NOT NULL,
	"status" "user_status" NOT NULL,
	"language" "language" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"rejection_reason" text,
	"avatar_kind" "avatar_kind" DEFAULT 'INITIALS' NOT NULL,
	"avatar_image_url" text,
	"avatar_emoji" varchar(32),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "aiyanat" ADD CONSTRAINT "aiyanat_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "aiyanat_user_id_month_idx" ON "aiyanat" USING btree ("user_id","month");--> statement-breakpoint
CREATE INDEX "contacts_user_id_log_date_idx" ON "contacts" USING btree ("user_id","log_date");--> statement-breakpoint
CREATE INDEX "daily_logs_date_idx" ON "daily_logs" USING btree ("date");--> statement-breakpoint
CREATE INDEX "notifications_user_id_read_idx" ON "notifications" USING btree ("user_id","read");--> statement-breakpoint
CREATE INDEX "password_reset_tokens_token_hash_idx" ON "password_reset_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_halqa_gender_status_idx" ON "users" USING btree ("halqa","gender_unit","status");