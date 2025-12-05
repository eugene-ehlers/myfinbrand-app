// src/contracts/agent.ts

//
// Core enums & shared types
//

export type DocumentType =
  | 'bank_statement'
  | 'payslip'
  | 'id_document'
  | 'proof_of_residence'
  | 'bank_confirmation_letter'
  | 'other';

export type CustomerType = 'personal' | 'business';

export type OcrService =
  | 'ocr'
  | 'summary'
  | 'structured'
  | 'classification'
  | 'ratios'
  | 'risk';

export type RoutingMode = 'none' | 'quick' | 'deep';

export interface QualityInfo {
  status: 'ok' | 'low_quality' | 'unreadable' | 'unknown';
  score: number | null;        // 0–100 if available
  confidence: number | null;   // 0–100 if available
  decision?: string | null;    // e.g. "deep_required", "quick_allowed"
  reason?: string | null;      // free-text explanation
}

export interface OcrPage {
  pageNumber: number;
  text: string;
  confidence: number | null;
}

export interface OcrPayload {
  engineVersion: string; // e.g. "tesseract-.../textract-..."
  pages: OcrPage[];
  fullText: string;
  quality?: QualityInfo;
}

export interface AgentContext {
  caseName?: string;
  applicationId?: string;
  accountId?: string;
  userId?: string;
  locale?: string; // e.g. "en-ZA"
  currency?: string; // e.g. "ZAR"
  // Any additional flags we might need later
  metadata?: Record<string, unknown>;
}

export interface AgentError {
  code: string;        // e.g. "NO_TRANSACTIONS", "LOW_QUALITY", "PARSE_ERROR"
  message: string;     // human-readable
  service?: OcrService;
  fatal?: boolean;
}

//
// Top-level Agent Request & Response
//

export interface DocumentAgentRequestMeta {
  documentRunId: string;
  docType: DocumentType;
  customerType: CustomerType;
  routingMode: RoutingMode;
  servicesRequested: OcrService[];

  // Where OCR JSON and results live (mostly for traceability/logging)
  sourceBucket: string;     // e.g. "ocrsvc-dev-results"
  ocrResultKey: string;     // e.g. "results/.../ocr_result.json"
}

export interface DocumentAgentRequest {
  meta: DocumentAgentRequestMeta;
  ocr: OcrPayload;
  context?: AgentContext;
}

export interface DocumentAgentResponseMeta {
  documentRunId: string;
  docType: DocumentType;
  customerType: CustomerType;
  routingMode: RoutingMode;
  servicesRequested: OcrService[];
  servicesCompleted: OcrService[];
  quality: QualityInfo;
}

/**
 * The agent returns a single, normalised payload which DetailedWorker
 * will wrap into detailed_result.json together with OCR, etc.
 */
export interface DocumentAgentResponse {
  meta: DocumentAgentResponseMeta;

  summary?: SummaryResult;
  structured?: StructuredResult;
  classification?: ClassificationResult;
  ratios?: RatiosResult;
  risk?: RiskResult;

  // Non-fatal issues per service
  warnings?: AgentError[];
  // Fatal error if we couldn’t do anything useful
  fatalError?: AgentError | null;
}

//
// SUMMARY SERVICE
//

export interface SummaryResult {
  /**
   * Short, user-facing summary of the document.
   * A few sentences at most.
   */
  shortSummary: string;

  /**
   * Longer explanation including key observations, anomalies, etc.
   */
  detailedSummary?: string;

  /**
   * Key bullet points suitable for UI “highlights”.
   */
  bullets?: string[];

  /**
   * Any structured tags the UI can use for filtering/segmenting.
   * e.g. ["FNB", "Gold Business Account", "2022-08-31", "BankStatement"]
   */
  tags?: string[];
}

//
// STRUCTURED SERVICE
// Discriminated union by docType
//

export type StructuredResult =
  | BankStatementStructuredResult
  | PayslipStructuredResult
  | IdDocumentStructuredResult
  | ProofOfResidenceStructuredResult
  | BankConfirmationStructuredResult
  | GenericStructuredResult;

//
// Bank Statement (bank_statement)
//

export interface BankStatementTransaction {
  txId?: string | null;          // internal id (if we infer one)
  postingDate: string | null;    // ISO date "YYYY-MM-DD"
  valueDate?: string | null;     // ISO date
  description: string;
  amount: number | null;         // positive for credit, negative for debit (normalised)
  currency?: string | null;      // "ZAR", etc.
  balanceAfter?: number | null;  // running balance if available
  category?: string | null;      // e.g. "INCOME_SALARY", "FEE", "TRANSFER"
  channel?: string | null;       // e.g. "POS", "EFT", "APP"
  raw?: Record<string, unknown>; // anything we want to keep for debugging
}

export interface BankStatementPeriod {
  from: string | null;    // ISO date
  to: string | null;      // ISO date
  statementDate?: string | null; // ISO date
}

export interface BankStatementAccountInfo {
  bankName?: string | null;            // "FNB"
  branchCode?: string | null;          // "250655" / "620"
  branchName?: string | null;          // "Forum 1, Braampark"
  accountNumber?: string | null;       // "63008625212"
  accountName?: string | null;         // "ALGORITHMIC APPROACHES HOLDINGS (PTY)"
  accountType?: string | null;         // "Gold Business Account"
  customerVatNumber?: string | null;
  bankVatNumber?: string | null;
}

export interface BankStatementBalances {
  openingBalance: number | null;
  closingBalance: number | null;
  currency?: string | null;
}

export interface BankStatementTotals {
  totalCredits: number | null;
  totalDebits: number | null;
  numberOfCreditTransactions: number | null;
  numberOfDebitTransactions: number | null;
  totalFees?: number | null;
  totalInterest?: number | null;
}

export interface BankStatementStructuredResult {
  docType: 'bank_statement';
  customerType: CustomerType;

  period: BankStatementPeriod;
  account: BankStatementAccountInfo;
  balances: BankStatementBalances;
  totals: BankStatementTotals;

  transactions: BankStatementTransaction[];

  // For multi-statement packs we could have multiple periods in future
  // For now we assume single-period per document.
}

//
// Payslip (payslip)
//

export interface PayslipEarning {
  code?: string | null;
  description: string;
  amount: number | null;
  recurring?: boolean;
}

export interface PayslipDeduction {
  code?: string | null;
  description: string;
  amount: number | null;
  recurring?: boolean;
}

export interface PayslipEmployerInfo {
  name?: string | null;
  registrationNumber?: string | null;
  address?: string | null;
}

export interface PayslipEmployeeInfo {
  name?: string | null;
  idNumber?: string | null;
  employeeNumber?: string | null;
  department?: string | null;
  position?: string | null;
}

export interface PayslipPeriod {
  periodStart?: string | null; // ISO date
  periodEnd?: string | null;   // ISO date
  payDate?: string | null;     // ISO date
  periodLabel?: string | null; // e.g. "Aug 2022"
}

export interface PayslipStructuredResult {
  docType: 'payslip';
  customerType: CustomerType; // usually "personal"

  employer: PayslipEmployerInfo;
  employee: PayslipEmployeeInfo;
  period: PayslipPeriod;

  grossEarnings: number | null;
  totalDeductions: number | null;
  netPay: number | null;
  currency?: string | null;

  earnings: PayslipEarning[];
  deductions: PayslipDeduction[];

  // High-level payroll flags
  notes?: string[];
}

//
// ID Document (id_document)
//

export type IdDocumentType =
  | 'national_id'
  | 'passport'
  | 'drivers_license'
  | 'unknown';

export interface IdDocumentStructuredResult {
  docType: 'id_document';
  customerType: CustomerType;

  idDocType: IdDocumentType;
  issuingCountry?: string | null;   // e.g. "ZA"
  idNumber?: string | null;
  fullName?: string | null;
  firstNames?: string | null;
  surname?: string | null;
  dateOfBirth?: string | null;      // ISO date
  gender?: string | null;
  nationality?: string | null;
  issueDate?: string | null;        // ISO date
  expiryDate?: string | null;       // ISO date
  addressOnDoc?: string | null;
}

//
// Proof of Residence (proof_of_residence)
//

export interface ProofOfResidenceStructuredResult {
  docType: 'proof_of_residence';
  customerType: CustomerType;

  holderName?: string | null;
  holderIdNumber?: string | null;
  addressLines: string[];
  suburb?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;          // e.g. "South Africa"
  documentIssuer?: string | null;   // e.g. "City of Tshwane", "Eskom"
  issueDate?: string | null;        // ISO date
  // Whether address appears residential, business, etc.
  addressType?: 'residential' | 'business' | 'unknown';
}

//
// Bank Confirmation Letter (bank_confirmation_letter)
//

export interface BankConfirmationStructuredResult {
  docType: 'bank_confirmation_letter';
  customerType: CustomerType;

  bankName?: string | null;
  branchCode?: string | null;
  branchName?: string | null;
  accountHolderName?: string | null;
  accountNumber?: string | null;
  accountType?: string | null;
  currency?: string | null;
  issueDate?: string | null;      // ISO date

  // Whether the letter appears valid/current.
  validityStatus?: 'valid' | 'expired' | 'suspicious' | 'unknown';
  notes?: string[];
}

//
// Generic / Other (other)
//

export interface GenericStructuredResult {
  docType: 'other';
  customerType: CustomerType;

  /**
   * Very loose structure, so we always have *something* to show in UI
   * even for unsupported doc types.
   */
  title?: string | null;
  detectedIssuer?: string | null;
  detectedLanguage?: string | null;
  mainDates?: string[];           // ISO dates found
  referenceNumbers?: string[];    // any references, policy numbers, etc.
  extractedFields?: Record<string, unknown>;
}

//
// CLASSIFICATION SERVICE
//

export interface ClassificationResult {
  /**
   * Final docType the agent believes this is, which might differ from the
   * initial stub classification.
   */
  detectedDocType: DocumentType;

  /**
   * More granular labels, e.g.
   *   "fnb_bank_statement", "standard_bank_current_account",
   *   "south_african_id_card", etc.
   */
  docSubType?: string | null;

  /**
   * Confidence 0–100 for classification.
   */
  confidence: number | null;

  /**
   * Any second-best guesses for debug / analytics.
   */
  alternatives?: {
    label: string;
    confidence: number | null;
  }[];
}

//
// RATIOS SERVICE
//

export interface RatioMetric {
  code: string;            // e.g. "AVG_MONTHLY_INCOME", "DEBT_SERVICE_RATIO"
  label: string;           // human-friendly
  value: number | null;    // usually 0–1 or a currency or a raw ratio
  unit?: string | null;    // "%", "ZAR", "months", etc.
  period?: string | null;  // e.g. "3m", "6m", "statement_period"
  source?: 'bank_statement' | 'payslip' | 'combined' | 'other';
}

export interface RatiosResult {
  /**
   * High-level grouping for UI sections; e.g.
   *   income, expenses, cashflow, indebtedness, risk, etc.
   */
  groups: {
    code: string;              // e.g. "INCOME", "EXPENSE", "LIQUIDITY"
    label: string;
    metrics: RatioMetric[];
  }[];

  /**
   * Commentary for human consumption.
   */
  commentary?: string;
}

//
// RISK SERVICE
//

export type RiskBand =
  | 'very_low'
  | 'low'
  | 'medium'
  | 'high'
  | 'very_high'
  | 'unknown';

export interface RiskReason {
  code: string;        // e.g. "INSUFFICIENT_INCOME", "EXCESSIVE_DEBITS"
  message: string;     // human-readable
  weight?: number;     // optional, 0–1 indicating contribution
}

export interface RiskResult {
  score: number | null;   // e.g. 0–100 risk score
  band: RiskBand;
  reasons: RiskReason[];

  /**
   * Free-form text that the UI can show or compliance can store.
   */
  narrative?: string;
}
