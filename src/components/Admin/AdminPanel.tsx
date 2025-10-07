import { useState, useEffect } from 'react';
import { adminApi } from '@/services/api';
import type { FileInfo, StatusResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Trash2, Database, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminPanel() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [filesData, statusData] = await Promise.all([
        adminApi.getFiles(),
        adminApi.getStatus(),
      ]);
      setFiles(filesData.files);
      setStatus(statusData);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setMessage({ type: 'error', text: 'Please upload an Excel file (.xlsx or .xls)' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const response = await adminApi.uploadFile(file);
      setMessage({
        type: 'success',
        text: `Success! Processed ${response.entries_processed} Q&A pairs`,
      });
      await loadData();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to upload file',
      });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete ${filename}? This will remove the file and its vectors from the knowledge base.`)) {
      return;
    }

    try {
      await adminApi.deleteFile(filename);
      setMessage({ type: 'success', text: 'File deleted successfully' });
      await loadData();
    } catch (error: any) {
      console.error('Error deleting file:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to delete file',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage knowledge base files</p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Knowledge Base Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : status ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Vectors</p>
                <p className="text-2xl font-bold">{status.vector_count}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Files</p>
                <p className="text-2xl font-bold">{status.total_files}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Index</p>
                <p className="text-sm font-mono">{status.index_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dimension</p>
                <p className="text-2xl font-bold">{status.dimension}</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New File
          </CardTitle>
          <CardDescription>
            Upload an Excel file with Q&A data. First column should contain questions, remaining
            columns contain answers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label htmlFor="file-upload">
              <Button disabled={isUploading} asChild>
                <span className="cursor-pointer">
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading && <span className="text-sm text-muted-foreground">Processing...</span>}
          </div>

          {/* Message */}
          {message && (
            <Alert className="mt-4" variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Uploaded Files ({files.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : files.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No files uploaded yet</p>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.filename}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{file.filename}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {file.size_mb} MB
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(file.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(file.filename)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}