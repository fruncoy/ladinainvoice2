import { Trash2, Edit, Receipt, FileText } from 'lucide-react';
import { formatDate } from '../../utils/date';
import type { Document } from '../../types';

interface DocumentCardProps {
  document: Document;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onGenerateReceipt?: (id: string) => void;
  onGenerateInvoice?: (id: string) => void;
}

export function DocumentCard({ 
  document, 
  onEdit, 
  onDelete,
  onGenerateReceipt,
  onGenerateInvoice
}: DocumentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold capitalize">{document.type}</h3>
          <p className="text-sm text-gray-600">{document.client_name}</p>
          <p className="text-sm text-gray-500">
            {formatDate(document.created_at, true)} {/* Added time display */}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(document.id)}
            className="p-2 text-gray-600 hover:text-[#FF771F]"
            title="Edit"
          >
            <Edit size={20} />
          </button>
          
          {document.type === 'invoice' && onGenerateReceipt && (
            <button 
              onClick={() => onGenerateReceipt(document.id)}
              className="p-2 text-gray-600 hover:text-[#FF771F]"
              title="Generate Receipt"
            >
              <Receipt size={20} />
            </button>
          )}
          
          {document.type === 'quotation' && onGenerateInvoice && (
            <button 
              onClick={() => onGenerateInvoice(document.id)}
              className="p-2 text-gray-600 hover:text-[#FF771F]"
              title="Generate Invoice"
            >
              <FileText size={20} />
            </button>
          )}
          
          <button 
            onClick={() => onDelete(document.id)}
            className="p-2 text-gray-600 hover:text-red-500"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}