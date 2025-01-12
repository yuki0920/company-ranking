

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "heroku_ext";


ALTER SCHEMA "heroku_ext" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "heroku_ext";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."ar_internal_metadata" (
    "key" character varying NOT NULL,
    "value" character varying,
    "created_at" timestamp(6) without time zone NOT NULL,
    "updated_at" timestamp(6) without time zone NOT NULL
);


ALTER TABLE "public"."ar_internal_metadata" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" bigint NOT NULL,
    "security_code" character varying NOT NULL,
    "document_id" character varying NOT NULL,
    "edinet_code" character varying NOT NULL,
    "filer_name" character varying NOT NULL,
    "period_started_at" "date" NOT NULL,
    "period_ended_at" "date" NOT NULL,
    "details_searched_at" timestamp without time zone,
    "company_name" character varying,
    "company_name_en" character varying,
    "head_office_location" character varying,
    "submitted_at" "date",
    "fiscal_year" character varying,
    "representative" character varying,
    "number_of_employees" integer,
    "average_age_years" double precision,
    "average_length_of_service_years" double precision,
    "average_annual_salary" bigint,
    "last_year_net_sales" bigint,
    "net_sales" bigint,
    "last_year_operating_income" bigint,
    "operating_income" bigint,
    "last_year_ordinary_income" bigint,
    "ordinary_income" bigint,
    "created_at" timestamp(6) without time zone NOT NULL,
    "updated_at" timestamp(6) without time zone NOT NULL,
    "capital_stock" bigint,
    "net_assets" bigint,
    "total_assets" bigint,
    "equity_to_asset_ratio" double precision,
    "rate_of_return_on_equity" double precision,
    "price_earnings_ratio" double precision,
    "net_cash_provided_by_used_in_operating_activities" bigint,
    "net_cash_provided_by_used_in_investing_activities" bigint,
    "net_cash_provided_by_used_in_financing_activities" bigint,
    "cash_and_cash_equivalents" bigint,
    "consolidated_number_of_employees" integer,
    "total_number_of_issued_shares" bigint,
    "payout_ratio" double precision
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."documents_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."documents_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."documents_id_seq" OWNED BY "public"."documents"."id";



CREATE TABLE IF NOT EXISTS "public"."industries" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL,
    "code" integer NOT NULL,
    "created_at" timestamp(6) without time zone NOT NULL,
    "updated_at" timestamp(6) without time zone NOT NULL,
    "industry_category_id" bigint
);


ALTER TABLE "public"."industries" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."industries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."industries_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."industries_id_seq" OWNED BY "public"."industries"."id";



CREATE TABLE IF NOT EXISTS "public"."industry_categories" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL,
    "created_at" timestamp(6) without time zone NOT NULL,
    "updated_at" timestamp(6) without time zone NOT NULL
);


ALTER TABLE "public"."industry_categories" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."industry_categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."industry_categories_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."industry_categories_id_seq" OWNED BY "public"."industry_categories"."id";



CREATE TABLE IF NOT EXISTS "public"."markets" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL,
    "created_at" timestamp(6) without time zone NOT NULL,
    "updated_at" timestamp(6) without time zone NOT NULL
);


ALTER TABLE "public"."markets" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."markets_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."markets_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."markets_id_seq" OWNED BY "public"."markets"."id";



CREATE TABLE IF NOT EXISTS "public"."schema_migrations" (
    "version" character varying NOT NULL
);


ALTER TABLE "public"."schema_migrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."securities" (
    "id" bigint NOT NULL,
    "code" character varying NOT NULL,
    "name" character varying NOT NULL,
    "market_id" bigint NOT NULL,
    "industry_code" integer NOT NULL,
    "created_at" timestamp(6) without time zone NOT NULL,
    "updated_at" timestamp(6) without time zone NOT NULL
);


ALTER TABLE "public"."securities" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."securities_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."securities_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."securities_id_seq" OWNED BY "public"."securities"."id";



CREATE TABLE IF NOT EXISTS "public"."security_lists" (
    "id" bigint NOT NULL,
    "file_title" character varying NOT NULL,
    "downloaded_at" "date" NOT NULL,
    "created_at" timestamp(6) without time zone NOT NULL,
    "updated_at" timestamp(6) without time zone NOT NULL
);


ALTER TABLE "public"."security_lists" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."security_lists_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."security_lists_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."security_lists_id_seq" OWNED BY "public"."security_lists"."id";



ALTER TABLE ONLY "public"."documents" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."documents_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."industries" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."industries_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."industry_categories" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."industry_categories_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."markets" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."markets_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."securities" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."securities_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."security_lists" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."security_lists_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ar_internal_metadata"
    ADD CONSTRAINT "ar_internal_metadata_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."industries"
    ADD CONSTRAINT "industries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."industry_categories"
    ADD CONSTRAINT "industry_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."markets"
    ADD CONSTRAINT "markets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");



ALTER TABLE ONLY "public"."securities"
    ADD CONSTRAINT "securities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."security_lists"
    ADD CONSTRAINT "security_lists_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "index_documents_on_document_id" ON "public"."documents" USING "btree" ("document_id");



CREATE INDEX "index_documents_on_security_code" ON "public"."documents" USING "btree" ("security_code");



CREATE UNIQUE INDEX "index_industries_on_code" ON "public"."industries" USING "btree" ("code");



CREATE INDEX "index_industries_on_industry_category_id" ON "public"."industries" USING "btree" ("industry_category_id");



CREATE UNIQUE INDEX "index_industries_on_name" ON "public"."industries" USING "btree" ("name");



CREATE UNIQUE INDEX "index_industry_categories_on_name" ON "public"."industry_categories" USING "btree" ("name");



CREATE UNIQUE INDEX "index_markets_on_name" ON "public"."markets" USING "btree" ("name");



CREATE UNIQUE INDEX "index_securities_on_code" ON "public"."securities" USING "btree" ("code");



CREATE INDEX "index_securities_on_industry_code" ON "public"."securities" USING "btree" ("industry_code");



CREATE INDEX "index_securities_on_market_id" ON "public"."securities" USING "btree" ("market_id");



CREATE UNIQUE INDEX "index_securities_on_name" ON "public"."securities" USING "btree" ("name");



CREATE UNIQUE INDEX "index_security_lists_on_file_title" ON "public"."security_lists" USING "btree" ("file_title");



ALTER TABLE ONLY "public"."securities"
    ADD CONSTRAINT "fk_rails_435486d3db" FOREIGN KEY ("industry_code") REFERENCES "public"."industries"("code");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "fk_rails_8760eb48c7" FOREIGN KEY ("security_code") REFERENCES "public"."securities"("code");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



































































































































































































GRANT ALL ON TABLE "public"."ar_internal_metadata" TO "anon";
GRANT ALL ON TABLE "public"."ar_internal_metadata" TO "authenticated";
GRANT ALL ON TABLE "public"."ar_internal_metadata" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON SEQUENCE "public"."documents_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."documents_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."documents_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."industries" TO "anon";
GRANT ALL ON TABLE "public"."industries" TO "authenticated";
GRANT ALL ON TABLE "public"."industries" TO "service_role";



GRANT ALL ON SEQUENCE "public"."industries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."industries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."industries_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."industry_categories" TO "anon";
GRANT ALL ON TABLE "public"."industry_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."industry_categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."industry_categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."industry_categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."industry_categories_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."markets" TO "anon";
GRANT ALL ON TABLE "public"."markets" TO "authenticated";
GRANT ALL ON TABLE "public"."markets" TO "service_role";



GRANT ALL ON SEQUENCE "public"."markets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."markets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."markets_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."schema_migrations" TO "anon";
GRANT ALL ON TABLE "public"."schema_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."schema_migrations" TO "service_role";



GRANT ALL ON TABLE "public"."securities" TO "anon";
GRANT ALL ON TABLE "public"."securities" TO "authenticated";
GRANT ALL ON TABLE "public"."securities" TO "service_role";



GRANT ALL ON SEQUENCE "public"."securities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."securities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."securities_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."security_lists" TO "anon";
GRANT ALL ON TABLE "public"."security_lists" TO "authenticated";
GRANT ALL ON TABLE "public"."security_lists" TO "service_role";



GRANT ALL ON SEQUENCE "public"."security_lists_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."security_lists_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."security_lists_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
