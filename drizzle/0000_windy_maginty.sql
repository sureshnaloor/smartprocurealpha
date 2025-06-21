CREATE TABLE "bid_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"bid_id" integer NOT NULL,
	"material_code" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"quantity" integer NOT NULL,
	"uom" varchar(50) NOT NULL,
	"packaging" varchar(100),
	"remarks" text,
	CONSTRAINT "bid_items_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "bid_requirements" (
	"id" serial PRIMARY KEY NOT NULL,
	"bid_id" integer NOT NULL,
	"tier" varchar(50) NOT NULL,
	"material_class" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"min_bid_amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bids" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"buyer_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"due_date" timestamp NOT NULL,
	"last_reminder_sent" timestamp,
	CONSTRAINT "bids_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"role" varchar(50) NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendor_invitations" (
	"bid_id" integer NOT NULL,
	"vendor_id" integer NOT NULL,
	"has_responded" boolean DEFAULT false NOT NULL,
	"responded_at" timestamp,
	CONSTRAINT "vendor_invitations_bid_id_vendor_id_pk" PRIMARY KEY("bid_id","vendor_id")
);
--> statement-breakpoint
CREATE TABLE "vendor_item_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"submission_bid_id" integer NOT NULL,
	"submission_vendor_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"price" integer NOT NULL,
	"lead_time" integer NOT NULL,
	"incoterm" varchar(100) NOT NULL,
	"payment_terms" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor_material_classes" (
	"vendor_id" integer NOT NULL,
	"material_class" varchar(255) NOT NULL,
	CONSTRAINT "vendor_material_classes_vendor_id_material_class_pk" PRIMARY KEY("vendor_id","material_class")
);
--> statement-breakpoint
CREATE TABLE "vendor_submissions" (
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"bid_id" integer NOT NULL,
	"vendor_id" integer NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"incoterm" varchar(100),
	"payment_terms" varchar(100),
	"additional_notes" text,
	CONSTRAINT "vendor_submissions_bid_id_vendor_id_pk" PRIMARY KEY("bid_id","vendor_id"),
	CONSTRAINT "vendor_submissions_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"buyer_id" integer NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"contact_name" varchar(255),
	"phone" varchar(50),
	"tier" varchar(50) NOT NULL,
	"location" varchar(255),
	CONSTRAINT "vendors_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "bid_items" ADD CONSTRAINT "bid_items_bid_id_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."bids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bid_requirements" ADD CONSTRAINT "bid_requirements_bid_id_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."bids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_invitations" ADD CONSTRAINT "vendor_invitations_bid_id_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."bids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_invitations" ADD CONSTRAINT "vendor_invitations_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_item_responses" ADD CONSTRAINT "vendor_item_responses_item_id_bid_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."bid_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_item_responses" ADD CONSTRAINT "vendor_item_responses_submission_bid_id_submission_vendor_id_vendor_submissions_bid_id_vendor_id_fk" FOREIGN KEY ("submission_bid_id","submission_vendor_id") REFERENCES "public"."vendor_submissions"("bid_id","vendor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_material_classes" ADD CONSTRAINT "vendor_material_classes_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_submissions" ADD CONSTRAINT "vendor_submissions_bid_id_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."bids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_submissions" ADD CONSTRAINT "vendor_submissions_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;