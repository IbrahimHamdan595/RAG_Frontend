export type FileType = "pdf" | "pptx";

export type PipelineStep = 0 | 1 | 2 | 3 | 4;
// 0 = idle, 1 = uploaded, 2 = ingested, 3 = chunked, 4 = embedded (ready)

export interface Source {
  source:      string;
  unit_number: number | null;
  document_id: string;
  score:       number;
}

export interface Message {
  id:      string;
  role:    "user" | "assistant";
  content: string;
  sources?: Source[];
  ts:      number; // unix ms timestamp
}

export interface DocState {
  documentId:   string;
  docName:      string;
  fileType:     FileType;
  pipelineStep: PipelineStep;
}
