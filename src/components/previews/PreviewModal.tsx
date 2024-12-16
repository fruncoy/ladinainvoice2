import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { InvoicePreview } from './InvoicePreview';
import { QuotationPreview } from './QuotationPreview';
import { ReceiptPreview } from './ReceiptPreview';
import { Button } from '../ui/Button';
import { downloadPDF } from '../../utils/pdf';
import type { Document, VehicleItem } from '../../types';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  items: VehicleItem[];
}

export function PreviewModal({ isOpen, onClose, document, items }: PreviewModalProps) {
  const PreviewComponent = {
    invoice: InvoicePreview,
    quotation: QuotationPreview,
    receipt: ReceiptPreview
  }[document.type];

  const handleDownload = () => {
    const success = downloadPDF(document, items);
    if (!success) {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-semibold capitalize">
              {document.type} Preview
            </Dialog.Title>
            <div className="flex items-center gap-4">
              <Button onClick={handleDownload}>
                Download PDF
              </Button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <PreviewComponent document={document} items={items} />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}