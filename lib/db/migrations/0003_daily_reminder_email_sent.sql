CREATE TABLE "daily_reminder_email_sent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"log_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_reminder_email_sent_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "daily_reminder_email_sent_user_id_log_date_unique" UNIQUE("user_id","log_date")
);
--> statement-breakpoint
CREATE INDEX "daily_reminder_email_sent_log_date_idx" ON "daily_reminder_email_sent" USING btree ("log_date");
