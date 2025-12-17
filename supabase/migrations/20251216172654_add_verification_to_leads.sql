-- Migration: Add email verification columns to leads table

ALTER TABLE "public"."leads" 
ADD COLUMN IF NOT EXISTS "verification_status" text CHECK (verification_status IN ('valid', 'risky', 'invalid', 'unknown')) DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS "verification_score" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "last_verified_at" timestamp with time zone;

COMMENT ON COLUMN "public"."leads"."verification_status" IS 'Status from email verification service (valid, risky, invalid, unknown)';
