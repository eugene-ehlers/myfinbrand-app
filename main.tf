terraform {
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

# Variables
variable "region" { type = string }
variable "app_name" { type = string }
variable "env" { type = string }
variable "db_subnet_ids" { type = list(string) }
variable "db_sg_id" { type = string }
variable "db_username" { type = string }
variable "db_password" { type = string }
variable "db_name" { type = string }

# S3 Buckets
resource "aws_s3_bucket" "artifacts" {
  bucket = "${var.app_name}-${var.env}-artifacts"
}

resource "aws_s3_bucket" "uploads" {
  bucket = "${var.app_name}-${var.env}-uploads"
}

resource "aws_s3_bucket" "results" {
  bucket = "${var.app_name}-${var.env}-results"
}

# S3 Public Access Blocks
resource "aws_s3_bucket_public_access_block" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "results" {
  bucket = aws_s3_bucket.results.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# RDS Database
resource "aws_db_subnet_group" "main" {
  name       = "${var.app_name}-${var.env}-subnet-group"
  subnet_ids = var.db_subnet_ids
}

resource "aws_db_instance" "main" {
  identifier     = "${var.app_name}-${var.env}-db"
  engine         = "postgres"
  engine_version = "15.8"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [var.db_sg_id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  skip_final_snapshot = true
}

# Outputs
output "db_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "s3_buckets" {
  value = {
    artifacts = aws_s3_bucket.artifacts.bucket
    uploads   = aws_s3_bucket.uploads.bucket
    results   = aws_s3_bucket.results.bucket
  }
}
