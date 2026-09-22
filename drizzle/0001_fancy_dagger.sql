CREATE TABLE "timer_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"focus_duration_minutes" integer DEFAULT 25 NOT NULL,
	"short_break_minutes" integer DEFAULT 5 NOT NULL,
	"long_break_minutes" integer DEFAULT 15 NOT NULL,
	"sound_enabled" boolean DEFAULT true NOT NULL,
	"auto_start_break" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "timer_settings_singleton" CHECK ("timer_settings"."id" = 1),
	CONSTRAINT "timer_settings_focus_duration_range" CHECK ("timer_settings"."focus_duration_minutes" between 5 and 120),
	CONSTRAINT "timer_settings_short_break_range" CHECK ("timer_settings"."short_break_minutes" between 1 and 60),
	CONSTRAINT "timer_settings_long_break_range" CHECK ("timer_settings"."long_break_minutes" between 5 and 120)
);
