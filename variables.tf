variable "region" { type = string }
variable "app_name" { type = string }
variable "env" { type = string }

# DB
variable "db_subnet_ids" { type = list(string) }
variable "db_sg_id"      { type = string }
variable "db_engine_version" { type = string  default = "15.5" }
variable "db_instance_class" { type = string  default = "db.t3.micro" }
variable "db_username"   { type = string }
variable "db_password"   { type = string }
variable "db_name"       { type = string  default = "ocr_ops" }
