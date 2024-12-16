import { DocumentCard } from './DocumentCard';
import { DocumentActions } from './DocumentActions';
import type { Document } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { sendDocumentEmail } from '../../services/email';

interface DocumentListProps {
  title: string;
  documents: Document[];
  emptyMessage: string;
}

export function DocumentList({ title, documents, emptyMessage }: DocumentListProps) {
  const { deleteDocument, items } = useLocalStorage();

  const handleEdit = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      window.location.href = `/${doc.type}s/${id}`;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
    }
  };

  const handleEmail = async (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    const email = window.prompt('Enter recipient email address:');
    if (!email) return;

    const docItems = items[id] || [];
    const result = await sendDocumentEmail(doc, docItems, email);
    
    alert(result.message);
  };

  const handleGenerateReceipt = (id: string) => {
    window.location.href = `/receipts/new?invoiceId=${id}`;
  };

  const handleGenerateInvoice = (id: string) => {
    window.location.href = `/invoices/new?quotationId=${id}`;
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.length === 0 ? (
          <div className="col-span-full text-center py-8 bg-white rounded-lg text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          documents.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              actions={
                <DocumentActions
                  document={doc}
                  onEdit={() => handleEdit(doc.id)}
                  onDelete={() => handleDelete(doc.id)}
                  onEmail={() => handleEmail(doc.id)}
                  onGenerateReceipt={
                    doc.type === 'invoice' 
                      ? () => handleGenerateReceipt(doc.id)
                      : undefined
                  }
                  onGenerateInvoice={
                    doc.type === 'quotation'
                      ? () => handleGenerateInvoice(doc.id)
                      : undefined
                  }
                />
              }
            />
          ))
        )}
      </div>
    </section>
  );
}