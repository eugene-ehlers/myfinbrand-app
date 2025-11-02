
-- Operational Data Layer (ODS) — Full Create
-- Version: v1.2 (includes v1.0 base, v1.1 Cognito linkage, v1.2 application+lookups)
-- Target: Amazon RDS for PostgreSQL

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()

-- =====================
-- Core: Tenancy & Users
-- =====================
CREATE TABLE IF NOT EXISTS obo (
  obo_id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name       text NOT NULL,
  trading_name     text,
  country_code     char(2) NOT NULL,
  data_residency   text NOT NULL, -- e.g., 'eu-west-1','af-south-1'
  status           text NOT NULL CHECK (status IN ('Registered','Active','Suspended','Deregistered')),
  environment_flags jsonb NOT NULL DEFAULT '{"sandbox": true, "prod": false}'::jsonb,
  owner_user_id    uuid,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_user (
  user_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obo_id       uuid NOT NULL REFERENCES obo(obo_id) ON DELETE RESTRICT,
  email        citext UNIQUE NOT NULL,
  first_name   text NOT NULL,
  last_name    text NOT NULL,
  status       text NOT NULL CHECK (status IN ('Invited','Active','Disabled','Deleted')),
  auth_method  text NOT NULL CHECK (auth_method IN ('password','sso','service')),
  mfa_enabled  boolean NOT NULL DEFAULT false,
  -- v1.1 additions
  external_provider  text,     -- 'cognito','saml','oidc','password','api'
  external_subject   text,     -- IdP subject (e.g., Cognito 'sub')
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Owner pointer backfill
ALTER TABLE obo
  ADD CONSTRAINT IF NOT EXISTS obo_owner_fk FOREIGN KEY (owner_user_id) REFERENCES app_user(user_id);

CREATE TABLE IF NOT EXISTS user_role (
  user_id   uuid NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
  role      text NOT NULL CHECK (role IN ('Owner','OrgAdmin','User')),
  PRIMARY KEY (user_id, role)
);

CREATE TABLE IF NOT EXISTS api_key (
  api_key_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obo_id       uuid NOT NULL REFERENCES obo(obo_id) ON DELETE CASCADE,
  user_id      uuid REFERENCES app_user(user_id) ON DELETE SET NULL,
  key_hash     bytea NOT NULL,            -- store hash only
  label        text,
  env_scope    text NOT NULL CHECK (env_scope IN ('sandbox','prod','both')),
  scopes       text[] NOT NULL DEFAULT ARRAY[]::text[],
  status       text NOT NULL CHECK (status IN ('active','revoked','expired')),
  last_used_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Helpful constraints/indexes for v1.1
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'app_user_external_provider_chk'
  ) THEN
    ALTER TABLE app_user
    ADD CONSTRAINT app_user_external_provider_chk
    CHECK (external_provider IS NULL OR external_provider IN ('cognito','saml','oidc','password','api'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = current_schema() AND indexname = 'app_user_provider_subject_uk'
  ) THEN
    CREATE UNIQUE INDEX app_user_provider_subject_uk
      ON app_user (external_provider, external_subject)
      WHERE external_subject IS NOT NULL;
  END IF;
END $$;

-- ==============
-- Accounts & $/¥
-- ==============
CREATE TABLE IF NOT EXISTS account (
  account_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obo_id       uuid NOT NULL UNIQUE REFERENCES obo(obo_id) ON DELETE CASCADE,
  name         text NOT NULL,
  currency     text NOT NULL, -- ISO 4217
  status       text NOT NULL CHECK (status IN ('Open','Suspended','Closed')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS account_transaction (
  txn_id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id     uuid NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
  type           text NOT NULL CHECK (type IN ('OPEN','CLOSE','DEPOSIT','WITHDRAW','EDIT_NAME')),
  amount_minor   bigint NOT NULL DEFAULT 0,  -- cents (can be 0)
  balance_after  bigint,
  reference      text,
  correlation_id uuid,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ==============
-- Entitlements
-- ==============
CREATE TABLE IF NOT EXISTS plan (
  plan_id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  pricing_model  text NOT NULL, -- 'subscription','prepaid','hybrid'
  included_units jsonb NOT NULL DEFAULT '{}'::jsonb,
  overage_rate   jsonb NOT NULL DEFAULT '{}'::jsonb, -- {module: rate_per_unit}
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS entitlement (
  entitlement_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obo_id         uuid NOT NULL REFERENCES obo(obo_id) ON DELETE CASCADE,
  module         text NOT NULL,       -- 'ocr_raw','ocr_summary', etc.
  doc_type       text NOT NULL,       -- 'bank_statement','payslip', etc.
  plan_id        uuid NOT NULL REFERENCES plan(plan_id) ON DELETE RESTRICT,
  plan_tier      text NOT NULL,       -- 'Starter','Pro','Enterprise'
  limits_json    jsonb NOT NULL DEFAULT '{}'::jsonb,     -- rps, concurrency, batch caps
  feature_flags  jsonb NOT NULL DEFAULT '{}'::jsonb,     -- webhooks_enabled, redaction_enabled, etc.
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to   timestamptz,
  active         boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS entitlement_lookup_idx ON entitlement(obo_id, module, doc_type) WHERE active;

CREATE TABLE IF NOT EXISTS entitlement_history (
  hist_id        bigserial PRIMARY KEY,
  entitlement_id uuid NOT NULL REFERENCES entitlement(entitlement_id) ON DELETE CASCADE,
  before_state   jsonb NOT NULL,
  after_state    jsonb NOT NULL,
  changed_at     timestamptz NOT NULL DEFAULT now(),
  actor_user_id  uuid
);

-- =====================
-- Credits & Reservations
-- =====================
CREATE TABLE IF NOT EXISTS credit_balance (
  account_id  uuid NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
  module      text NOT NULL,
  env         text NOT NULL CHECK (env IN ('sandbox','prod')),
  available   bigint NOT NULL DEFAULT 0,   -- units
  reserved    bigint NOT NULL DEFAULT 0,   -- units
  included    bigint NOT NULL DEFAULT 0,   -- subscription-included
  PRIMARY KEY (account_id, module, env)
);

CREATE TABLE IF NOT EXISTS reservation (
  reservation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id     uuid NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
  module         text NOT NULL,
  env            text NOT NULL CHECK (env IN ('sandbox','prod')),
  units          bigint NOT NULL,
  status         text NOT NULL CHECK (status IN ('HELD','CHARGED','REFUNDED','EXPIRED')),
  idempotency_key uuid NOT NULL,
  correlation_id uuid,
  expires_at     timestamptz NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reservation_query_idx ON reservation(account_id, module, status);

CREATE TABLE IF NOT EXISTS ledger_charge (
  charge_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservation(reservation_id) ON DELETE SET NULL,
  account_id     uuid NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
  module         text NOT NULL,
  units          bigint NOT NULL,
  unit_price_minor bigint NOT NULL DEFAULT 0,
  currency       text NOT NULL,
  status         text NOT NULL CHECK (status IN ('CHARGED','REFUNDED')),
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ============
-- Payments etc
-- ============
CREATE TABLE IF NOT EXISTS payment (
  payment_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obo_id          uuid NOT NULL REFERENCES obo(obo_id) ON DELETE CASCADE,
  account_id      uuid NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
  intent          text NOT NULL CHECK (intent IN ('TOP_UP','SUBSCRIPTION','SETTLE_INVOICE')),
  amount_minor    bigint NOT NULL,
  currency        text NOT NULL,
  psp_ref         text,
  status          text NOT NULL CHECK (status IN ('pending','authorized','captured','failed','refunded')),
  idempotency_key uuid NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscription (
  sub_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obo_id       uuid NOT NULL REFERENCES obo(obo_id) ON DELETE CASCADE,
  plan_id      uuid NOT NULL REFERENCES plan(plan_id) ON DELETE RESTRICT,
  status       text NOT NULL CHECK (status IN ('active','paused','canceled')),
  start_at     timestamptz NOT NULL,
  renew_at     timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoice (
  invoice_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obo_id       uuid NOT NULL REFERENCES obo(obo_id) ON DELETE CASCADE,
  period_start timestamptz NOT NULL,
  period_end   timestamptz NOT NULL,
  amount_minor bigint NOT NULL,
  currency     text NOT NULL,
  status       text NOT NULL CHECK (status IN ('Draft','Open','Paid','Void')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- Jobs, Cases & Batch Items
-- =========================
CREATE TABLE IF NOT EXISTS batch (
  batch_id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obo_id       uuid NOT NULL REFERENCES obo(obo_id) ON DELETE CASCADE,
  status       text NOT NULL CHECK (status IN ('CREATED','READY','RUNNING','PARTIAL','COMPLETED','FAILED')),
  created_by   uuid REFERENCES app_user(user_id),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS batch_item (
  batch_id     uuid NOT NULL REFERENCES batch(batch_id) ON DELETE CASCADE,
  item_id      uuid NOT NULL DEFAULT gen_random_uuid(),
  filename     text NOT NULL,
  source_url   text,
  doc_type     text,
  status       text NOT NULL CHECK (status IN ('PENDING','RUNNING','SUCCEEDED','FAILED','RETRYING')),
  correlation_id uuid,
  PRIMARY KEY (batch_id, item_id)
);

-- v1.2 application grouping
CREATE TABLE IF NOT EXISTS application (
  application_id uuid PRIMARY KEY,
  obo_id         uuid NOT NULL REFERENCES obo(obo_id) ON DELETE CASCADE,
  applicant_type text NOT NULL CHECK (applicant_type IN ('individual','commercial')),
  correlation_id uuid,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS case_job (
  case_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id       uuid NOT NULL DEFAULT gen_random_uuid(),
  obo_id       uuid NOT NULL REFERENCES obo(obo_id) ON DELETE CASCADE,
  account_id   uuid REFERENCES account(account_id),
  application_id uuid REFERENCES application(application_id) ON DELETE SET NULL,
  applicant_type text CHECK (applicant_type IS NULL OR applicant_type IN ('individual','commercial')),
  source       text NOT NULL CHECK (source IN ('manual','batch','api')),
  status       text NOT NULL CHECK (status IN ('CREATED','PROCESSING','DELIVERED','FAILED')),
  doc_type     text,
  correlation_id uuid,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS case_job_status_idx ON case_job(obo_id, status);
CREATE INDEX IF NOT EXISTS case_job_app_idx ON case_job(application_id, created_at DESC);

CREATE TABLE IF NOT EXISTS artifact (
  artifact_id  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id      uuid NOT NULL REFERENCES case_job(case_id) ON DELETE CASCADE,
  job_id       uuid NOT NULL,
  type         text NOT NULL CHECK (type IN ('RAW_FILE','PAGE_IMAGE','OCR_JSON','OCR_TEXT','SEO_JSON','RESULT_JSON','HUMAN_VIEW','LOG')),
  uri          text NOT NULL,
  checksum     text,
  bytes        bigint,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS artifact_case_idx ON artifact(case_id, type);

CREATE TABLE IF NOT EXISTS extraction_result (
  extraction_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id       uuid NOT NULL REFERENCES case_job(case_id) ON DELETE CASCADE,
  job_id        uuid NOT NULL,
  schema_version text NOT NULL,
  template_version text,
  model_version text,
  seo_json_uri  text NOT NULL,
  summary_metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS case_result (
  case_id        uuid PRIMARY KEY REFERENCES case_job(case_id) ON DELETE CASCADE,
  job_id         uuid NOT NULL,
  result_json_uri text NOT NULL,
  human_view_uri  text,
  overall_confidence numeric(5,2),
  coverage       numeric(5,2),
  versions       jsonb NOT NULL,
  delivered_at   timestamptz
);

-- =====================
-- Webhooks & Outbox/DLQ
-- =====================
CREATE TABLE IF NOT EXISTS webhook_endpoint (
  endpoint_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obo_id        uuid NOT NULL REFERENCES obo(obo_id) ON DELETE CASCADE,
  url           text NOT NULL,
  secret        text NOT NULL,
  events        text[] NOT NULL,
  status        text NOT NULL CHECK (status IN ('active','disabled')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhook_outbox (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id   uuid NOT NULL REFERENCES webhook_endpoint(endpoint_id) ON DELETE CASCADE,
  case_id       uuid,
  event_type    text NOT NULL,
  payload_uri   text NOT NULL,
  attempts      int NOT NULL DEFAULT 0,
  last_status   int,
  next_retry_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- =============
-- Governance
-- =============
CREATE TABLE IF NOT EXISTS compliance_hold (
  hold_id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obo_id      uuid NOT NULL REFERENCES obo(obo_id) ON DELETE CASCADE,
  reason      text NOT NULL,
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz
);

CREATE TABLE IF NOT EXISTS audit_log (
  audit_id     bigserial PRIMARY KEY,
  obo_id       uuid,
  user_id      uuid,
  external_subject text,   -- v1.1: cognito sub or other IdP subject
  actor_type   text NOT NULL CHECK (actor_type IN ('system','user','api')),
  action       text NOT NULL,
  entity_type  text,
  entity_id    uuid,
  details      jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip           inet,
  user_agent   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_obo_time_idx ON audit_log(obo_id, created_at);

-- =============
-- Rate Limiting
-- =============
CREATE TABLE IF NOT EXISTS rate_limit_counter (
  key          text PRIMARY KEY,  -- e.g., 'obo:{id}:rps', 'apikey:{id}:rps'
  period_start timestamptz NOT NULL,
  count        bigint NOT NULL DEFAULT 0,
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- Decision-Time (Captured)
-- =========================
CREATE TABLE IF NOT EXISTS captured_input (
  input_id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id      uuid NOT NULL REFERENCES case_job(case_id) ON DELETE CASCADE,
  source       text NOT NULL CHECK (source IN ('payslip','bank','application','financials')),
  field_code   text NOT NULL,              -- e.g., EMPLOYER_NAME_CAPTURED
  value_text   text,
  value_minor  bigint,
  created_at   timestamptz NOT NULL DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'captured_input_case_field_uk'
  ) THEN
    ALTER TABLE captured_input
      ADD CONSTRAINT captured_input_case_field_uk UNIQUE (case_id, field_code);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = current_schema() AND indexname = 'captured_case_field_idx'
  ) THEN
    CREATE INDEX captured_case_field_idx ON captured_input(case_id, field_code);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS extraction_field (
  case_id        uuid NOT NULL REFERENCES case_job(case_id) ON DELETE CASCADE,
  field_code     text NOT NULL,            -- e.g., PS_GROSS, PS_NET, BANK_NAME, etc.
  value_text     text,
  value_minor    bigint,
  confidence     numeric(5,2),
  page_ref       int,
  bbox           jsonb,
  template_version text,
  model_version  text,
  PRIMARY KEY (case_id, field_code)
);

CREATE TABLE IF NOT EXISTS bank_month_summary (
  case_id          uuid NOT NULL REFERENCES case_job(case_id) ON DELETE CASCADE,
  year_month       date NOT NULL,          -- first day of month as key
  net_income_minor bigint NOT NULL,
  income_minor     bigint NOT NULL,
  expense_minor    bigint NOT NULL,
  salary_minor     bigint,
  food_minor       bigint,
  transport_minor  bigint,
  other_minor      bigint,
  PRIMARY KEY (case_id, year_month)
);

CREATE TABLE IF NOT EXISTS application_aggregate (
  aggregate_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  correlation_id    uuid,
  obo_id            uuid NOT NULL REFERENCES obo(obo_id) ON DELETE CASCADE,
  avg_net_income_3m_minor bigint,
  bank_name         text,
  employer_name     text,
  ps_gross_minor    bigint,
  ps_net_minor      bigint,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reconciliation_result (
  recon_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  correlation_id uuid,
  rule_code     text NOT NULL,             -- e.g., MATCH_EMPLOYER, MATCH_NET_SALARY
  left_ref      text,
  right_ref     text,
  pass          boolean NOT NULL,
  delta_minor   bigint,
  details       jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS risk_assessment (
  risk_id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  correlation_id  uuid,
  model_id        text NOT NULL,
  model_version   text NOT NULL,
  score           numeric(6,3) NOT NULL,
  pd_estimate     numeric(6,4),
  dti_ratio_bp    int,
  nsr_ratio_bp    int,
  features_small  jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============
-- Lookups v1.2
-- ============
CREATE TABLE IF NOT EXISTS ref_business_type (
  code  text PRIMARY KEY,
  label text NOT NULL
);

CREATE TABLE IF NOT EXISTS ref_bank_account_type (
  code  text PRIMARY KEY,
  label text NOT NULL
);

CREATE TABLE IF NOT EXISTS ref_financials_type (
  code  text PRIMARY KEY,
  label text NOT NULL
);

INSERT INTO ref_business_type(code, label) VALUES
  ('PTY_LTD','Proprietary Limited'),
  ('SOLE_PROP','Sole Proprietor'),
  ('PARTNERSHIP','Partnership'),
  ('CLOSE_CORP','Close Corporation')
ON CONFLICT (code) DO NOTHING;

INSERT INTO ref_bank_account_type(code, label) VALUES
  ('CHEQUE','Cheque/Current'),
  ('SAVINGS','Savings'),
  ('CREDIT_CARD','Credit Card'),
  ('OTHER','Other')
ON CONFLICT (code) DO NOTHING;

INSERT INTO ref_financials_type(code, label) VALUES
  ('AUDITED_FULL_YEAR','Audited Full Year'),
  ('AUDITED_INTERIM','Audited Interim'),
  ('UNAUDITED_INTERIM','Unaudited Interim'),
  ('MANAGEMENT_ACCOUNTS','Management Accounts')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- Convenience Views v1.2
-- ========================
CREATE OR REPLACE VIEW v_user_identity AS
SELECT
  u.user_id,
  u.obo_id,
  u.email,
  u.status,
  u.auth_method,
  u.mfa_enabled,
  u.external_provider,
  u.external_subject,
  r.role
FROM app_user u
LEFT JOIN user_role r ON r.user_id = u.user_id;

CREATE OR REPLACE VIEW v_captured_core AS
SELECT
  cj.case_id,
  cj.application_id,
  cj.obo_id,
  cj.doc_type,
  cj.source,
  cj.created_at,
  -- Individual fields
  MAX(ci.value_text) FILTER (WHERE ci.field_code = 'APPLICANT_FULL_NAME')          AS applicant_full_name,
  MAX(ci.value_text) FILTER (WHERE ci.field_code = 'APPLICANT_INITIALS')           AS applicant_initials,
  MAX(ci.value_text) FILTER (WHERE ci.field_code = 'APPLICANT_SURNAME')            AS applicant_surname,
  MAX(ci.value_minor) FILTER (WHERE ci.field_code = 'DECLARED_NET_INCOME_MINOR')   AS declared_net_income_minor,
  MAX(ci.value_text) FILTER (WHERE ci.field_code = 'EMPLOYER_NAME_CAPTURED')       AS employer_name_captured,
  MAX(ci.value_text) FILTER (WHERE ci.field_code = 'BANK_NAME_CAPTURED')           AS bank_name_captured,
  MAX(ci.value_text) FILTER (WHERE ci.field_code = 'BANK_ACCOUNT_TYPE')            AS bank_account_type,
  -- Commercial fields
  MAX(ci.value_text) FILTER (WHERE ci.field_code = 'BUSINESS_NAME')                AS business_name,
  MAX(ci.value_text) FILTER (WHERE ci.field_code = 'BUSINESS_REG_NO')              AS business_reg_no,
  MAX(ci.value_text) FILTER (WHERE ci.field_code = 'BUSINESS_TYPE')                AS business_type,
  MAX(ci.value_text) FILTER (WHERE ci.field_code = 'FINANCIALS_TYPE')              AS financials_type,
  MAX(ci.value_text) FILTER (WHERE ci.field_code = 'FINANCIAL_YEAR_END')           AS financial_year_end
FROM case_job cj
LEFT JOIN captured_input ci ON ci.case_id = cj.case_id
GROUP BY cj.case_id, cj.application_id, cj.obo_id, cj.doc_type, cj.source, cj.created_at;

CREATE OR REPLACE VIEW v_application_rollup AS
SELECT
  a.application_id,
  a.obo_id,
  a.applicant_type,
  a.created_at,
  COUNT(*) FILTER (WHERE cj.doc_type = 'payslip')                          AS payslip_count,
  COUNT(*) FILTER (WHERE cj.doc_type = 'bank_statement')                   AS bank_statement_count,
  COUNT(*) FILTER (WHERE cj.doc_type IN ('audited_full_year','audited_interim','unaudited_interim','management_accounts')) AS financials_count,
  BOOL_OR(cj.status = 'DELIVERED')                                         AS any_delivered,
  MAX(cr.overall_confidence)                                               AS max_confidence
FROM application a
LEFT JOIN case_job cj ON cj.application_id = a.application_id
LEFT JOIN case_result cr ON cr.case_id = cj.case_id
GROUP BY a.application_id, a.obo_id, a.applicant_type, a.created_at;
