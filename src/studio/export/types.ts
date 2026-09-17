import type { StudioProject } from '../project.js';

export type ExportPhase = 'validating' | 'preparing-assets' | 'rendering-pdf' | 'packaging' | 'ready' | 'failed';

export interface PreviewCapture {
  device: 'PC' | '모바일';
  section: string;
  width: number;
  height: number;
  png: Uint8Array;
}

export interface DraftArchiveResult {
  project: StudioProject;
  fileName: string;
  pdfName: string;
  jsonName: string;
  zipBytes: Uint8Array;
  pdfBytes: Uint8Array;
  jsonBytes: Uint8Array;
  blob: Blob;
}
