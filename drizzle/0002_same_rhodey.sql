CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "users" ("name", "email", "password_hash")
VALUES (
	'Usuário local',
	'local@poplist.dev',
	'scrypt:5ad1fd1a17c7cde592a32efe64c9c709:a7793171d31d4c11e0705cb0ab3a8fe84fb975ab04f9f26a1619827d3f70d18cf13cdf5e1075db88388c4220eed7284475f2fba28e37dd225645b9be1414e021'
)
ON CONFLICT DO NOTHING;
--> statement-breakpoint
ALTER TABLE "daily_plan_items" ADD COLUMN "user_id" uuid;
--> statement-breakpoint
ALTER TABLE "focus_sessions" ADD COLUMN "user_id" uuid;
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "user_id" uuid;
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "user_id" uuid;
--> statement-breakpoint
ALTER TABLE "timer_settings" ADD COLUMN "user_id" uuid;
--> statement-breakpoint
UPDATE "projects"
SET "user_id" = (SELECT "id" FROM "users" WHERE "email" = 'local@poplist.dev')
WHERE "user_id" IS NULL;
--> statement-breakpoint
UPDATE "tasks"
SET "user_id" = (SELECT "id" FROM "users" WHERE "email" = 'local@poplist.dev')
WHERE "user_id" IS NULL;
--> statement-breakpoint
UPDATE "daily_plan_items"
SET "user_id" = (SELECT "id" FROM "users" WHERE "email" = 'local@poplist.dev')
WHERE "user_id" IS NULL;
--> statement-breakpoint
UPDATE "focus_sessions"
SET "user_id" = (SELECT "id" FROM "users" WHERE "email" = 'local@poplist.dev')
WHERE "user_id" IS NULL;
--> statement-breakpoint
UPDATE "timer_settings"
SET "user_id" = (SELECT "id" FROM "users" WHERE "email" = 'local@poplist.dev')
WHERE "user_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "timer_settings" DROP CONSTRAINT "timer_settings_singleton";
--> statement-breakpoint
ALTER TABLE "timer_settings" ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
CREATE SEQUENCE IF NOT EXISTS "timer_settings_id_seq";
--> statement-breakpoint
SELECT setval(
	'"timer_settings_id_seq"',
	GREATEST((SELECT COALESCE(MAX("id"), 0) FROM "timer_settings"), 1)
);
--> statement-breakpoint
ALTER TABLE "timer_settings" ALTER COLUMN "id" SET DEFAULT nextval('"timer_settings_id_seq"');
--> statement-breakpoint
ALTER SEQUENCE "timer_settings_id_seq" OWNED BY "timer_settings"."id";
--> statement-breakpoint
ALTER TABLE "daily_plan_items" ALTER COLUMN "user_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "focus_sessions" ALTER COLUMN "user_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "user_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "user_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "timer_settings" ALTER COLUMN "user_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "daily_plan_items" ADD CONSTRAINT "daily_plan_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "timer_settings" ADD CONSTRAINT "timer_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "auth_sessions_token_hash_unique" ON "auth_sessions" USING btree ("token_hash");
--> statement-breakpoint
CREATE INDEX "auth_sessions_user_id_idx" ON "auth_sessions" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "auth_sessions_expires_at_idx" ON "auth_sessions" USING btree ("expires_at");
--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "daily_plan_items_user_id_idx" ON "daily_plan_items" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "focus_sessions_user_id_idx" ON "focus_sessions" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "projects_user_id_idx" ON "projects" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "tasks_user_id_idx" ON "tasks" USING btree ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "timer_settings_user_id_unique" ON "timer_settings" USING btree ("user_id");
