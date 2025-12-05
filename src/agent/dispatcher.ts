import { getContract } from "./registry";

export function buildAgentPayload({
  docType,
  service,
  ocrText,
  rawJson,
  metadata
}) {
  const contract = getContract(docType);

  return {
    contractVersion: contract.version,
    documentType: docType,
    serviceRequested: service,
    contract,
    ocrText,
    rawJson,
    metadata
  };
}
