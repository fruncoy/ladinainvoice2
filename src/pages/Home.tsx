import { DocumentSection } from '../components/documents/DocumentSection';
import { useDocumentActions } from '../hooks/useDocumentActions';

export function Home() {
  const {
    handleEdit,
    handleDelete,
    handleEmail,
    handleGenerateReceipt,
    handleGenerateInvoice
  } = useDocumentActions();

  return (
    <div className="min-h-screen bg-[#2B372A] pb-20">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-8">
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
        
        <DocumentSection 
          title="Recent Invoices" 
          type="invoice"
          emptyMessage="No recent invoices" 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onEmail={handleEmail}
          onGenerateReceipt={handleGenerateReceipt}
        />
        
        <DocumentSection 
          title="Recent Quotations" 
          type="quotation"
          emptyMessage="No recent quotations" 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onEmail={handleEmail}
          onGenerateInvoice={handleGenerateInvoice}
        />
        
        <DocumentSection 
          title="Recent Receipts" 
          type="receipt"
          emptyMessage="No recent receipts" 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onEmail={handleEmail}
        />
      </div>
    </div>
  );
}