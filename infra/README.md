OCR & Analysis Service — AWS Starter Pack (Infra + Contracts)
This repo gives AWS Code Assist enough context to scaffold:

S3 buckets (raw uploads, artifacts, results) with lifecycle
RDS PostgreSQL (Operational Data v1.2)
Cognito (auth), API Gateway, and Lambda stubs
Queues/topics for batch processing (SQS/SNS)
Minimal OpenAPI for /precheck, /analyze, /batches
What this app does (one paragraph)
Provides OCR + summary + risk checks for credit applications (individual or commercial). Supports one-by-one, batch, and API. Uses S3 for documents/artifacts, RDS for operational data, and Cognito for user auth.

Deploy (dev, example)
Install Terraform 1.6+ and AWS CLI; set AWS_PROFILE/region.
cd infra/terraform
Copy dev.tfvars.example to dev.tfvars and edit values.
terraform init
terraform apply -var-file=dev.tfvars
After RDS is up, run psql and execute ../db/ods_schema_v1_2_full.sql to create schema.
Import API (/api/openapi.yaml) into API Gateway (HTTP API) if not using Terraform for routes yet.
Buckets & prefixes
s3://-raw-/obo=/case=/...
s3://-artifacts-/obo=/case=/...
s3://-results-/obo=/case=/...
Next steps
Wire Lambdas/containers to Step Functions for OCR pipeline.
Implement Pre-OCR checks against RDS (entitlements/credits).
Enable webhooks and audit logging.
