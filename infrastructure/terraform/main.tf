terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "aiftw-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "eu-west-3"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
module "vpc" {
  source = "./modules/vpc"
  
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  environment        = var.environment
}

# ECS Cluster
module "ecs" {
  source = "./modules/ecs"
  
  cluster_name     = "aiftw-${var.environment}"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  environment     = var.environment
  container_image = var.container_image
}

# Redis ElastiCache
module "redis" {
  source = "./modules/redis"
  
  cluster_id       = "aiftw-cache-${var.environment}"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  node_type       = "cache.t3.medium"
  num_cache_nodes = 2
  environment     = var.environment
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"
  
  name           = "aiftw-alb-${var.environment}"
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.public_subnet_ids
  environment    = var.environment
  certificate_arn = var.certificate_arn
}

# Route53 DNS
module "dns" {
  source = "./modules/dns"
  
  domain_name     = var.domain_name
  environment     = var.environment
  alb_dns_name    = module.alb.dns_name
  alb_zone_id     = module.alb.zone_id
}
