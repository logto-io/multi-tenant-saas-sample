import { type Document } from '../types';
import { DocumentCard } from './DocumentCard';

interface DocumentListProps {
  documents: Document[];
}

export const DocumentList = ({ documents }: DocumentListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} doc={doc} />
      ))}
    </div>
  );
}; 