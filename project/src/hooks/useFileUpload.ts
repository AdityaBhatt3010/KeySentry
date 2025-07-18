import { useState, useCallback } from 'react';

interface UseFileUploadReturn {
  files: File[];
  isDragOver: boolean;
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      // Filter out binary files and focus on text-based files
      const textExtensions = [
        '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h',
        '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.sh',
        '.yml', '.yaml', '.json', '.xml', '.html', '.css', '.scss',
        '.env', '.config', '.conf', '.ini', '.properties', '.txt', '.md'
      ];
      
      const hasValidExtension = textExtensions.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );
      
      const isSmallEnough = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      return hasValidExtension && isSmallEnough;
    });

    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, [addFiles]);

  return {
    files,
    isDragOver,
    addFiles,
    removeFile,
    clearFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};