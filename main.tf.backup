terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

locals {
  name_prefix = "${var.app_name}-${var.env}"
}

# S3 Buckets
resource "aws_s3_bucket" "raw" {
  bucket = "${var.app_name}-raw-${var.env}"
  force_destroy = false
}

resource "aws_s3_bucket" "artifacts" {
  bucket = "${var.app_name}-artifacts-${var.env}"
  force_destroy = false
}

resource "aws_s3_bucket" "results" {
  bucket = "${var.app_name}-results-${var.env}"
  force_destroy = false
}

# Block public access
resource "aws_s3_bucket_public_access_block" "raw" {
  bucket = aws_s3_bucket.raw.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
resource "aws_s3_bucket_public_access_block" "artifacts" { bucket = aws_s3_bucket.artifacts.id
  block_public_acls = true; block_public_policy = true; ignore_public_acls = true; restrict_public_buckets = true }
resource "aws_s3_bucket_public_access_block" "results" { bucket = aws_s3_bucket.results.id
  block_public_acls = true; block_public_policy = true; ignore_public_acls = true; restrict_public_buckets = true }

# RDS PostgreSQL
resource "aws_db_subnet_group" "main" {
  name       = "${local.name_prefix}-db-subnets"
  subnet_ids = var.db_subnet_ids
}

resource "aws_db_instance" "rds" {
  identifier         = "${local.name_prefix}-pg"
  engine             = "postgres"
  engine_version     = var.db_engine_version
  instance_class     = var.db_instance_class
  allocated_storage  = 20
  db_subnet_group_name = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.db_sg_id]
  username           = var.db_username
  password           = var.db_password
  db_name            = var.db_name
  publicly_accessible = false
  skip_final_snapshot = true
  backup_retention_period = 7
  deletion_protection = false
  apply_immediately   = true
}

# Cognito (minimal)
resource "aws_cognito_user_pool" "pool" {
  name = "${local.name_prefix}-pool"
  mfa_configuration = "OFF"
  username_attributes = ["email"]
  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "client" {
  name         = "${local.name_prefix}-client"
  user_pool_id = aws_cognito_user_pool.pool.id
  generate_secret = false
  supported_identity_providers = ["COGNITO"]
  allowed_oauth_flows_user_pool_client = false
  callback_urls = ["https://example.com/callback"]
  logout_urls   = ["https://example.com/logout"]
}

# API Gateway HTTP API (skeleton)
resource "aws_apigatewayv2_api" "http" {
  name          = "${local.name_prefix}-api"
  protocol_type = "HTTP"
}

# SQS queues for pipeline (placeholders)
resource "aws_sqs_queue" "ingest" { name = "${local.name_prefix}-ingest" }
resource "aws_sqs_queue" "results" { name = "${local.name_prefix}-results" }

output "s3_buckets" {
  value = {
    raw      = aws_s3_bucket.raw.bucket
    artifacts= aws_s3_bucket.artifacts.bucket
    results  = aws_s3_bucket.results.bucket
  }
}

output "rds_endpoint" { value = aws_db_instance.rds.address }
output "cognito_user_pool_id" { value = aws_cognito_user_pool.pool.id }
output "cognito_client_id" { value = aws_cognito_user_pool_client.client.id }
output "http_api_id" { value = aws_apigatewayv2_api.http.id }
output "sqs_ingest" { value = aws_sqs_queue.ingest.id }
output "sqs_results" { value = aws_sqs_queue.results.id }
