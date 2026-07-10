
export interface Document {
  id: string;
  title: string;
  // added fields for functional requirements
  fileType: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  folder?: string;
  uploadedBy?: string;
  permissions?: string[];
}
