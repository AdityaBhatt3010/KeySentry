import { ScanRequest, ScanResponse, ScanProgress, ScanResult } from '../types/api';
import { scanFileContent, ScanMatch } from '../utils/patternMatcher';
import { GitHubService } from './githubService';

export class ScanService {
  private static instance: ScanService;
  private currentScanId: string | null = null;
  private scanProgress: Map<string, ScanProgress> = new Map();
  private scanResults: Map<string, ScanResult[]> = new Map();

  static getInstance(): ScanService {
    if (!ScanService.instance) {
      ScanService.instance = new ScanService();
    }
    return ScanService.instance;
  }

  async startScan(request: ScanRequest): Promise<string> {
    const scanId = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.currentScanId = scanId;
    
    // Initialize progress
    this.scanProgress.set(scanId, {
      progress: 0,
      status: 'Initializing scan...',
    });

    // Start scanning in background
    this.performScan(scanId, request);
    
    return scanId;
  }

  private async performScan(scanId: string, request: ScanRequest): Promise<void> {
    try {
      let allMatches: ScanMatch[] = [];
      
      if (request.type === 'upload' && request.files) {
        allMatches = await this.scanUploadedFiles(scanId, request.files);
      } else if (request.type === 'github' && request.repoUrl) {
        allMatches = await this.scanGitHubRepository(scanId, request.repoUrl);
      }
      
      // Convert matches to results format
      const results: ScanResult[] = allMatches.map((match, index) => ({
        id: `${scanId}-${index}`,
        file: match.file,
        type: match.type,
        match: match.match,
        severity: match.severity,
        line: match.line
      }));
      
      this.scanResults.set(scanId, results);
      
      // Mark as complete
      this.scanProgress.set(scanId, {
        progress: 100,
        status: 'Scan complete',
      });
      
    } catch (error) {
      console.error('Scan failed:', error);
      this.scanProgress.set(scanId, {
        progress: 100,
        status: `Scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  private async scanUploadedFiles(scanId: string, files: File[]): Promise<ScanMatch[]> {
    const allMatches: ScanMatch[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update progress
      this.scanProgress.set(scanId, {
        progress: Math.floor((i / files.length) * 90), // Leave 10% for final processing
        status: `Scanning file: ${file.name}`,
        currentFile: file.name
      });
      
      try {
        const content = await file.text();
        const matches = scanFileContent(file.name, content);
        allMatches.push(...matches);
      } catch (error) {
        console.warn(`Failed to scan file ${file.name}:`, error);
      }
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return allMatches;
  }

  private async scanGitHubRepository(scanId: string, repoUrl: string): Promise<ScanMatch[]> {
    const repoInfo = GitHubService.parseRepoUrl(repoUrl);
    if (!repoInfo) {
      throw new Error('Invalid GitHub repository URL');
    }
    
    // Update progress
    this.scanProgress.set(scanId, {
      progress: 10,
      status: 'Fetching repository contents...',
    });
    
    try {
      const files = await GitHubService.getAllFiles(repoInfo.owner, repoInfo.repo, 50);
      
      if (files.length === 0) {
        throw new Error('No scannable files found in repository');
      }
      
      const allMatches: ScanMatch[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update progress
        this.scanProgress.set(scanId, {
          progress: 10 + Math.floor((i / files.length) * 80),
          status: `Scanning: ${file.path}`,
          currentFile: file.path
        });
        
        if (file.download_url) {
          try {
            const content = await GitHubService.fetchFileContent(file.download_url);
            if (content) {
              const matches = scanFileContent(file.path, content);
              allMatches.push(...matches);
            }
          } catch (error) {
            console.warn(`Failed to scan file ${file.path}:`, error);
          }
        }
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      return allMatches;
      
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to scan GitHub repository');
    }
  }

  async getScanProgress(scanId: string): Promise<ScanProgress> {
    const progress = this.scanProgress.get(scanId);
    if (!progress) {
      throw new Error('Scan not found');
    }
    return progress;
  }

  async getScanResults(scanId: string): Promise<ScanResponse> {
    const results = this.scanResults.get(scanId);
    if (!results) {
      throw new Error('Scan results not found');
    }
    
    const stats = this.calculateStats(results, 1);
    
    return {
      success: true,
      results,
      stats,
      message: 'Scan completed successfully'
    };
  }

  private calculateStats(results: ScanResult[], totalFiles: number) {
    const stats = {
      totalFiles,
      totalLeaks: results.length,
      criticalLeaks: 0,
      highLeaks: 0,
      mediumLeaks: 0,
      lowLeaks: 0
    };

    results.forEach(result => {
      switch (result.severity) {
        case 'critical':
          stats.criticalLeaks++;
          break;
        case 'high':
          stats.highLeaks++;
          break;
        case 'medium':
          stats.mediumLeaks++;
          break;
        case 'low':
          stats.lowLeaks++;
          break;
      }
    });

    return stats;
  }

  async exportResults(scanId: string, format: 'json' | 'csv' = 'json'): Promise<Blob> {
    const results = this.scanResults.get(scanId);
    if (!results) {
      throw new Error('Scan results not found');
    }

    if (format === 'json') {
      const jsonData = JSON.stringify(results, null, 2);
      return new Blob([jsonData], { type: 'application/json' });
    } else {
      // CSV format
      const headers = ['File', 'Type', 'Match', 'Severity', 'Line'];
      const csvRows = [
        headers.join(','),
        ...results.map(result => [
          `"${result.file}"`,
          `"${result.type}"`,
          `"${result.match}"`,
          result.severity,
          result.line?.toString() || ''
        ].join(','))
      ];
      
      const csvData = csvRows.join('\n');
      return new Blob([csvData], { type: 'text/csv' });
    }
  }

  getCurrentScanId(): string | null {
    return this.currentScanId;
  }
}