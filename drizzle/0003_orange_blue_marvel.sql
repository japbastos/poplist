CREATE TYPE "public"."tracker_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."tracker_type" AS ENUM('boolean', 'number', 'scale');--> statement-breakpoint
CREATE TABLE "tracker_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tracker_id" uuid NOT NULL,
	"entry_date" date NOT NULL,
	"value" integer NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tracker_entries_value_non_negative" CHECK ("tracker_entries"."value" >= 0)
);
--> statement-breakpoint
CREATE TABLE "trackers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "tracker_type" NOT NULL,
	"target_value" integer,
	"status" "tracker_status" DEFAULT 'active' NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trackers_target_value_positive" CHECK ("trackers"."target_value" is null or "trackers"."target_value" > 0)
);
--> statement-breakpoint
ALTER TABLE "tracker_entries" ADD CONSTRAINT "tracker_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracker_entries" ADD CONSTRAINT "tracker_entries_tracker_id_trackers_id_fk" FOREIGN KEY ("tracker_id") REFERENCES "public"."trackers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trackers" ADD CONSTRAINT "trackers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tracker_entries_tracker_date_unique" ON "tracker_entries" USING btree ("tracker_id","entry_date");--> statement-breakpoint
CREATE INDEX "tracker_entries_user_id_idx" ON "tracker_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tracker_entries_entry_date_idx" ON "tracker_entries" USING btree ("entry_date");--> statement-breakpoint
CREATE INDEX "trackers_user_id_idx" ON "trackers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "trackers_status_idx" ON "trackers" USING btree ("status");