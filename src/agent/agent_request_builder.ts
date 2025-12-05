import { buildAgentPayload } from "./dispatcher";

export function buildAgentRequest({ docType, services, ocr, json, meta }) {
  return services.map(service => ({
    role: "user",
    content: buildAgentPayload({
      docType,
      service,
      ocrText: ocr,
      rawJson: json,
      metadata: meta
    })
  }));
}
