import React, { useRef } from 'react';
import { Upload, X, File } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    files,
    isDragOver,
    addFiles,
    removeFile,
    clearFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useFileUpload();

  React.useEffect(() => {
    onFilesChange(files);
  }, [files, onFilesChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? 'border-green-400 bg-green-500/10'
            : 'border-green-500/40 bg-green-500/5 hover:border-green-400/60'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-green-400' : 'text-green-400'}`} />
        <p className="text-green-300 font-semibold mb-2">
          {isDragOver ? 'Drop files here' : 'Drop files here or click to browse'}
        </p>
        <p className="text-green-400/70 text-sm">
          Supports: .js, .py, .java, .env, .json, .yml and more (max 10MB each)
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.php,.rb,.go,.rs,.swift,.kt,.scala,.sh,.yml,.yaml,.json,.xml,.html,.css,.scss,.env,.config,.conf,.ini,.properties,.txt,.md"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-green-300 font-semibold">Selected Files ({files.length})</h4>
            <button
              onClick={clearFiles}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
              disabled={disabled}
            >
              Clear All
            </button>
          </div>
          
          <div className="max-h-40 overflow-y-auto space-y-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-black/40 rounded-lg p-3 border border-green-500/30"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-4 w-4 text-green-400" />
                  <div>
                    <p className="text-green-300 text-sm font-mono">{file.name}</p>
                    <p className="text-green-400/70 text-xs">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};