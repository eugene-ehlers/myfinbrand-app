import bankStatement from "./contracts/bank_statement.v1.json";
import financialStatements from "./contracts/financial_statements.v1.json";
import payslip from "./contracts/payslip.v1.json";
import idDocument from "./contracts/id_document.v1.json";
import companyRegistration from "./contracts/company_registration.v1.json";
import taxCertificate from "./contracts/tax_certificate.v1.json";
import affidavit from "./contracts/affidavit.v1.json";
import proofOfAddress from "./contracts/proof_of_address.v1.json";
import creditReport from "./contracts/credit_report.v1.json";
import applicationForm from "./contracts/application_form.v1.json";
import genericDocument from "./contracts/generic_document.v1.json";

export const contractRegistry: Record<string, any> = {
  bank_statement: bankStatement,
  financial_statements: financialStatements,
  payslip,
  id_document: idDocument,
  company_registration: companyRegistration,
  tax_certificate: taxCertificate,
  affidavit,
  proof_of_address: proofOfAddress,
  credit_report: creditReport,
  application_form: applicationForm,
  generic_document: genericDocument
};

export function getContract(docType: string) {
  return contractRegistry[docType] || contractRegistry["generic_document"];
}
