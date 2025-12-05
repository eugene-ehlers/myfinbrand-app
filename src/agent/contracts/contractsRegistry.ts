// src/agent/contracts/contractsRegistry.ts

// Make sure tsconfig.json has: "resolveJsonModule": true and "esModuleInterop": true

import bankStatementV1 from './bank_statement.v1.json';
import financialStatementsV1 from './financial_statements.v1.json';
// 👉 As you add more contracts, just import them here:
// import idDocumentV1 from './id_document.v1.json';
// import payslipV1 from './payslip.v1.json';
// import proofOfAddressV1 from './proof_of_address.v1.json';
// ...etc

export interface OcrServiceConfig {
  enabled: boolean;
  engine?: string;
  pageLimit?: number;
  captureMode?: string;
  [key: string]: unknown;
}

export interface SummaryServiceConfig {
  enabled: boolean;
  maxTokens?: number;
  style?: string;
  focus?: string[];
  [key: string]: unknown;
}

export interface StructuredServiceConfig {
  enabled: boolean;
  schema: unknown;
  [key: string]: unknown;
}

export interface ClassificationServiceConfig {
  enabled: boolean;
  level?: string;
  labels?: string[];
  categories?: string[];
  output?: unknown;
  engine?: unknown;
  [key: string]: unknown;
}

export interface RatiosServiceConfig {
  enabled: boolean;
  metrics: unknown[];
  [key: string]: unknown;
}

export interface RiskServiceConfig {
  enabled: boolean;
  engine?: string;
  score?: unknown;
  explanationRequired?: boolean;
  [key: string]: unknown;
}

export interface ContractServices {
  ocr?: OcrServiceConfig;
  summary?: SummaryServiceConfig;
  structured?: StructuredServiceConfig;
  classification?: ClassificationServiceConfig;
  ratios?: RatiosServiceConfig;
  risk?: RiskServiceConfig;
  // future services can be added here
  [key: string]: unknown;
}

export interface Contract {
  docType: string;
  version: string;
  services: ContractServices;
}

type ContractKey = `${string}:${string}`;

// 🔐 Central registry of all contracts
const registry: Record<ContractKey, Contract> = {
  'bank_statement:v1': bankStatementV1 as Contract,
  'financial_statements:v1': financialStatementsV1 as Contract

  // When you add more contracts, register them here:
  // 'id_document:v1': idDocumentV1 as Contract,
  // 'payslip:v1': payslipV1 as Contract,
  // 'proof_of_address:v1': proofOfAddressV1 as Contract,
  // ...
};

/**
 * Safe lookup – returns undefined if not found.
 */
export function getContract(
  docType: string,
  version = 'v1'
): Contract | undefined {
  const key: ContractKey = `${docType}:${version}`;
  return registry[key];
}

/**
 * Throws if the contract does not exist – nice for core pipeline logic.
 */
export function getContractOrThrow(
  docType: string,
  version = 'v1'
): Contract {
  const contract = getContract(docType, version);
  if (!contract) {
    throw new Error(`No contract registered for docType=${docType}, version=${version}`);
  }
  return contract;
}

/**
 * Convenience helper: get just the services block.
 */
export function getServicesConfig(
  docType: string,
  version = 'v1'
): ContractServices {
  return getContractOrThrow(docType, version).services;
}
