// Chat Types
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
    timestamp?: string;
  }
  
  export interface Source {
    question: string;
    answer: string;
    relevance_score: number;
    answer_position?: number;
    total_answers?: number;
  }
  
  export interface ChatRequest {
    message: string;
    conversation_id?: string;
    top_k?: number;
  }
  
  export interface ChatResponse {
    response: string;
    sources: Source[];
    conversation_id: string;
    timestamp: string;
  }
  
  // Admin Types
  export interface UploadResponse {
    status: string;
    message: string;
    filename: string;
    backup_filename: string;
    entries_processed: number;
    questions_count: number;
    timestamp: string;
  }
  
  export interface FileInfo {
    filename: string;
    size_bytes: number;
    size_mb: number;
    created_at: string;
    modified_at: string;
  }
  
  export interface FilesResponse {
    status: string;
    total: number;
    files: FileInfo[];
  }
  
  export interface StatusResponse {
    status: string;
    vector_count: number;
    dimension: string | number;
    index_name: string;
    total_files: number;
    recent_uploads: FileInfo[];
    timestamp: string;
  }
  
  export interface DeleteResponse {
    status: string;
    message: string;
    filename: string;
    batch_id: string;
    deleted_from_pinecone: boolean;
    timestamp: string;
  }