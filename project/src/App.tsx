import React, { useState, useEffect } from 'react';
import { Shield, Search, Download, AlertTriangle, Eye, FileText, Github, Upload, Zap, Terminal, Lock } from 'lucide-react';
import { ScanService } from './services/scanService';
import { ScanResult, ScanStats } from './types/api';
import { FileUpload } from './components/FileUpload';

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [scanStats, setScanStats] = useState<ScanStats | null>(null);
  const [activeTab, setActiveTab] = useState('scanner');
  const [repoUrl, setRepoUrl] = useState('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);

  const scanService = ScanService.getInstance();

  const startScan = async (type: 'github' | 'upload') => {
    if (type === 'github' && !repoUrl.trim()) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }
    
    if (type === 'upload' && uploadFiles.length === 0) {
      setError('Please select files to scan');
      return;
    }

    setError(null);
    setIsScanning(true);
    setScanProgress(0);
    setScanStatus('Initializing scan...');
    setScanResults([]);
    setScanStats(null);
    
    try {
      // Start the scan
      const scanId = await scanService.startScan({
        type,
        repoUrl: type === 'github' ? repoUrl : undefined,
        files: type === 'upload' ? uploadFiles : undefined
      });
      
      setCurrentScanId(scanId);
      
      // Poll for progress
      const progressInterval = setInterval(async () => {
        try {
          const progress = await scanService.getScanProgress(scanId);
          setScanProgress(progress.progress);
          setScanStatus(progress.status);
          
          if (progress.currentFile) {
            setScanStatus(`Scanning: ${progress.currentFile}`);
          }
          
          if (progress.progress >= 100) {
            clearInterval(progressInterval);
            
            // Get final results
            const results = await scanService.getScanResults(scanId);
            setScanResults(results.results);
            setScanStats(results.stats);
            setIsScanning(false);
            setActiveTab('results');
          }
        } catch (error) {
          clearInterval(progressInterval);
          setError('Failed to get scan progress');
          setIsScanning(false);
        }
      }, 1000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during scanning');
      setIsScanning(false);
    }
  };

  const handleExportResults = async () => {
    if (!currentScanId) return;
    
    try {
      const blob = await scanService.exportResults(currentScanId, 'json');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keysentry-scan-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to export results');
    }
  };

  const filteredResults = scanResults.filter(result => {
    const matchesSearch = result.file.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         result.type.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || result.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 border-red-400';
      case 'high': return 'text-orange-400 border-orange-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-cyan-400 border-cyan-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-cyan-100 overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-500/30 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Shield className="h-10 w-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                <div className="absolute inset-0 animate-pulse">
                  <Shield className="h-10 w-10 text-cyan-400/30" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                  KeySentry
                </h1>
                <p className="text-sm text-cyan-300/70 font-mono">Advanced API Key Scanner v2.0</p>
              </div>
            </div>
            
            <nav className="flex space-x-1">
              {[
                { id: 'scanner', label: 'Scanner', icon: Search },
                { id: 'results', label: 'Results', icon: Eye },
                { id: 'analytics', label: 'Analytics', icon: Zap }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 flex items-center space-x-2 border ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                        : 'border-transparent text-cyan-400/70 hover:bg-cyan-500/10 hover:text-cyan-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'scanner' && (
          <div className="space-y-8">
            {/* Scanner Interface */}
            <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-green-500/5"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <Terminal className="h-6 w-6 text-green-400" />
                  <h2 className="text-2xl font-bold text-cyan-300">Repository Scanner</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* GitHub Repo Scan */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Github className="h-5 w-5 text-cyan-400" />
                      <h3 className="font-semibold text-cyan-300">GitHub Repository</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="https://github.com/username/repository"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-black/60 border border-cyan-500/40 rounded-lg text-cyan-100 placeholder-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none font-mono transition-all"
                      />
                      
                      <button
                        onClick={() => startScan('github')}
                        disabled={isScanning || !repoUrl}
                        className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isScanning ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Scanning...</span>
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4" />
                            <span>Start Scan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Local File Upload */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Upload className="h-5 w-5 text-green-400" />
                      <h3 className="font-semibold text-green-300">Local Files</h3>
                    </div>
                    
                    <FileUpload 
                      onFilesChange={setUploadFiles}
                      disabled={isScanning}
                    />
                    
                    {uploadFiles.length > 0 && (
                      <button
                        onClick={() => startScan('upload')}
                        disabled={isScanning || uploadFiles.length === 0}
                        className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isScanning ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Scanning...</span>
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4" />
                            <span>Scan Files</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <span className="text-red-300 font-semibold">Error</span>
                    </div>
                    <p className="text-red-200 mt-2">{error}</p>
                  </div>
                )}

                {/* Progress Bar */}
                {isScanning && (
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-cyan-300 font-mono">{scanStatus}</span>
                      <span className="text-cyan-400 font-mono">{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-300 relative"
                        style={{ width: `${scanProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Supported Patterns */}
            <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Supported Detection Patterns</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  'AWS', 'Google', 'Slack', 'Stripe', 'SendGrid', 'Twilio',
                  'GitHub', 'OpenAI', 'Heroku', 'Mailgun', 'Firebase', 'DigitalOcean',
                  'Cloudflare', 'JWT', 'RSA Private Key', 'Facebook', 'Azure Storage',
                  'Dropbox', 'Notion', 'Netlify', 'Terraform', 'CircleCI', 'BasicAuth', 'Generic Base64'
                ].map(pattern => (
                  <div key={pattern} className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-2 text-center">
                    <span className="text-xs font-mono text-cyan-300 break-words">{pattern}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-cyan-300 flex items-center space-x-3">
                <Eye className="h-6 w-6" />
                <span>Scan Results</span>
                {scanStats && (
                  <span className="text-red-400 bg-red-500/20 px-3 py-1 rounded-full text-sm font-mono">
                    {scanStats.totalLeaks} leaks found
                  </span>
                )}
              </h2>
              
              <div className="flex space-x-4">
                <button 
                  onClick={handleExportResults}
                  disabled={!currentScanId || scanResults.length === 0}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <input
                    type="text"
                    placeholder="Search files, types, or matches..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-black/60 border border-cyan-500/40 rounded-lg text-cyan-100 placeholder-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none font-mono"
                  />
                </div>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-4 py-2 bg-black/60 border border-cyan-500/40 rounded-lg text-cyan-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none font-mono"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div key={result.id} className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 hover:bg-black/50 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`h-5 w-5 ${getSeverityColor(result.severity).split(' ')[0]}`} />
                      <div>
                        <h4 className="font-semibold text-cyan-300">{result.type}</h4>
                        <p className="text-sm text-cyan-400/70 font-mono">{result.file}{result.line && `:${result.line}`}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(result.severity)} bg-opacity-20`}>
                      {result.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="bg-black/60 rounded-lg p-4 font-mono text-sm border-l-4 border-red-400">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-300">Detected Secret:</span>
                      <FileText className="h-4 w-4 text-cyan-400" />
                    </div>
                    <code className="text-red-200 break-all">{result.match}</code>
                  </div>
                </div>
              ))}
              
              {filteredResults.length === 0 && scanResults.length > 0 && (
                <div className="text-center py-12 text-cyan-400/70">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No results match your current filters.</p>
                </div>
              )}
              
              {scanResults.length === 0 && (
                <div className="text-center py-12 text-cyan-400/70">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No scan results yet. Start a scan to see potential security issues.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && scanStats && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-cyan-300 flex items-center space-x-3">
              <Zap className="h-6 w-6" />
              <span>Security Analytics</span>
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Files', value: scanStats.totalFiles, color: 'cyan', icon: FileText },
                { label: 'Total Leaks', value: scanStats.totalLeaks, color: 'red', icon: AlertTriangle },
                { label: 'Critical', value: scanStats.criticalLeaks, color: 'red', icon: AlertTriangle },
                { label: 'High Risk', value: scanStats.highLeaks, color: 'orange', icon: AlertTriangle }
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                    <Icon className={`h-8 w-8 mx-auto mb-3 text-${stat.color}-400`} />
                    <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
                    <div className="text-sm text-cyan-300/70">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Security Score */}
            <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-cyan-300 mb-6">Security Score</h3>
              <div className="flex items-center space-x-6">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r="56" stroke="rgba(0,255,255,0.2)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="56" 
                      stroke="rgb(239, 68, 68)" 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${(scanStats.totalLeaks > 0 ? 25 : 100) * 3.51} 351`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-400">{scanStats.totalLeaks > 0 ? '25' : '100'}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-red-400 mb-2">
                    {scanStats.totalLeaks > 0 ? 'Critical Security Issues' : 'No Issues Found'}
                  </h4>
                  <p className="text-cyan-300/70">
                    {scanStats.totalLeaks > 0 
                      ? 'Immediate action required to secure exposed credentials' 
                      : 'Repository appears secure with no exposed secrets detected'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/30 bg-black/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Creator Info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]" />
                <div className="absolute inset-0 animate-pulse">
                  <Shield className="h-6 w-6 text-cyan-400/20" />
                </div>
              </div>
              <div>
                <p className="text-cyan-300 font-semibold">
                  Made by <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent font-bold">Aditya Bhatt</span>
                </p>
                <p className="text-cyan-400/70 text-sm font-mono">Security Researcher & Developer</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-cyan-400/70 text-sm font-mono mr-2">Connect:</span>
              
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/adityabhatt3010/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 bg-black/60 border border-cyan-500/40 rounded-lg hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300"
                title="LinkedIn"
              >
                <svg className="h-5 w-5 text-cyan-400 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <div className="absolute inset-0 bg-blue-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/AdityaBhatt3010"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 bg-black/60 border border-cyan-500/40 rounded-lg hover:border-gray-400 hover:bg-gray-500/10 transition-all duration-300"
                title="GitHub"
              >
                <svg className="h-5 w-5 text-cyan-400 group-hover:text-gray-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <div className="absolute inset-0 bg-gray-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              {/* Medium */}
              <a
                href="https://medium.com/@adityabhatt3010"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 bg-black/60 border border-cyan-500/40 rounded-lg hover:border-green-400 hover:bg-green-500/10 transition-all duration-300"
                title="Medium"
              >
                <svg className="h-5 w-5 text-cyan-400 group-hover:text-green-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
                <div className="absolute inset-0 bg-green-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              {/* TryHackMe */}
              <a
                href="https://tryhackme.com/p/info.adityabhatt"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 bg-black/60 border border-cyan-500/40 rounded-lg hover:border-red-400 hover:bg-red-500/10 transition-all duration-300"
                title="TryHackMe"
              >
                <svg className="h-5 w-5 text-cyan-400 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10.705 0C7.54 0 4.902 2.285 4.349 5.291a4.525 4.525 0 0 0-4.107 4.5 4.525 4.525 0 0 0 4.52 4.52h6.761a.625.625 0 1 0 0-1.25H4.762a3.273 3.273 0 0 1-3.27-3.27 3.273 3.273 0 0 1 3.27-3.27c.059 0 .116.015.174.017a.625.625 0 0 0 .66-.567C6.312 3.46 8.335 1.25 10.705 1.25c2.915 0 5.285 2.37 5.285 5.285a.625.625 0 1 0 1.25 0C17.24 2.847 14.393 0 10.705 0zm8.624 6.103a4.525 4.525 0 0 0-4.52 4.52 4.525 4.525 0 0 0 4.52 4.52 4.525 4.525 0 0 0 4.52-4.52 4.525 4.525 0 0 0-4.52-4.52zm0 1.25a3.273 3.273 0 0 1 3.27 3.27 3.273 3.273 0 0 1-3.27 3.27 3.273 3.273 0 0 1-3.27-3.27 3.273 3.273 0 0 1 3.27-3.27z"/>
                </svg>
                <div className="absolute inset-0 bg-red-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              {/* Credly */}
              <a
                href="https://www.credly.com/users/aditya-bhatt3010/badges#credly"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 bg-black/60 border border-cyan-500/40 rounded-lg hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300"
                title="Credly Badges"
              >
                <svg className="h-5 w-5 text-cyan-400 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L3.09 8.26l1.42 1.42L12 4.16l7.49 5.52 1.42-1.42L12 2zM12 6L6.5 10.5v7.5h11v-7.5L12 6zm0 2.5l3.5 2.5v5h-7v-5l3.5-2.5z"/>
                  <circle cx="12" cy="14" r="1.5"/>
                </svg>
                <div className="absolute inset-0 bg-orange-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-4 border-t border-cyan-500/20 text-center">
            <p className="text-cyan-400/60 text-sm font-mono">
              © 2025 KeySentry. Built with ❤️ for the cybersecurity & developer community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;