// GitHub API service for fetching repository contents
export interface GitHubFile {
  name: string;
  path: string;
  download_url: string | null;
  type: 'file' | 'dir';
}

export class GitHubService {
  private static readonly API_BASE = 'https://api.github.com';
  
  static parseRepoUrl(url: string): { owner: string; repo: string } | null {
    // Handle various GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/.*)?$/,
      /^([^\/]+)\/([^\/]+)$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return { owner: match[1], repo: match[2] };
      }
    }
    
    return null;
  }
  
  static async fetchRepositoryContents(owner: string, repo: string, path: string = ''): Promise<GitHubFile[]> {
    try {
      const response = await fetch(`${this.API_BASE}/repos/${owner}/${repo}/contents/${path}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Repository not found or is private');
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch repository contents');
    }
  }
  
  static async fetchFileContent(downloadUrl: string): Promise<string> {
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.warn('Failed to fetch file content:', error);
      return '';
    }
  }
  
  static isTextFile(fileName: string): boolean {
    const textExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h',
      '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.sh',
      '.yml', '.yaml', '.json', '.xml', '.html', '.css', '.scss',
      '.env', '.config', '.conf', '.ini', '.properties', '.txt', '.md',
      '.sql', '.dockerfile', '.gitignore', '.gitattributes'
    ];
    
    const lowerName = fileName.toLowerCase();
    return textExtensions.some(ext => lowerName.endsWith(ext)) || 
           lowerName.includes('.env') ||
           lowerName === 'dockerfile' ||
           lowerName === 'makefile';
  }
  
  static async getAllFiles(owner: string, repo: string, maxFiles: number = 100): Promise<GitHubFile[]> {
    const allFiles: GitHubFile[] = [];
    const dirsToProcess: string[] = [''];
    
    while (dirsToProcess.length > 0 && allFiles.length < maxFiles) {
      const currentPath = dirsToProcess.shift()!;
      
      try {
        const contents = await this.fetchRepositoryContents(owner, repo, currentPath);
        
        for (const item of contents) {
          if (allFiles.length >= maxFiles) break;
          
          if (item.type === 'file' && this.isTextFile(item.name)) {
            allFiles.push(item);
          } else if (item.type === 'dir' && !this.shouldSkipDirectory(item.name)) {
            dirsToProcess.push(item.path);
          }
        }
      } catch (error) {
        console.warn(`Failed to process directory ${currentPath}:`, error);
        continue;
      }
    }
    
    return allFiles;
  }
  
  private static shouldSkipDirectory(dirName: string): boolean {
    const skipDirs = [
      'node_modules', '.git', 'dist', 'build', 'target', 'vendor',
      '__pycache__', '.pytest_cache', 'coverage', '.nyc_output',
      'logs', 'tmp', 'temp', '.cache', '.vscode', '.idea'
    ];
    
    return skipDirs.includes(dirName) || dirName.startsWith('.');
  }
}