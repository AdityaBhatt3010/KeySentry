export interface ScanRequest {
  type: 'github' | 'upload';
  repoUrl?: string;
  files?: File[];
}

export interface ScanResult {
  id: string;
  file: string;
  type: string;
  match: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  line?: number;
}

export interface ScanStats {
  totalFiles: number;
  totalLeaks: number;
  criticalLeaks: number;
  highLeaks: number;
  mediumLeaks: number;
  lowLeaks: number;
}

export interface ScanResponse {
  success: boolean;
  results: ScanResult[];
  stats: ScanStats;
  message?: string;
}

export interface ScanProgress {
  progress: number;
  status: string;
  currentFile?: string;
}