import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { PreviewModal } from '../components/previews/PreviewModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAutoSave } from '../hooks/useAutoSave';
import { usePreview } from '../hooks/usePreview';
import type { Document } from '../types';

export function Receipts() {
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');
  const { documents, items: allItems } = useLocalStorage();
  const { isPreviewOpen, openPreview, closePreview } = usePreview();

  // If invoiceId exists, pre-fill data from invoice
  const invoice = invoiceId 
    ? documents.find(doc => doc.id === invoiceId && doc.type === 'invoice')
    : null;
  const invoiceItems = invoiceId ? allItems[invoiceId] || [] : [];

  const [clientName, setClientName] = useState(invoice?.client_name || '');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString());
  const [receivedFrom, setReceivedFrom] = useState(invoice?.client_name || '');
  const [amount, setAmount] = useState(invoice?.total_amount?.toString() || '');
  const [receivedBy, setReceivedBy] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'cheque' | 'mpesa' | 'bank'>('cash');
  const [paymentReference, setPaymentReference] = useState('');
  const [balance, setBalance] = useState('0');

  const documentData: Document = {
    id: crypto.randomUUID(),
    type: 'receipt',
    client_name: clientName,
    created_at: receiptDate,
    received_from: receivedFrom,
    total_amount: parseFloat(amount) || 0,
    received_by: receivedBy,
    payment_mode: paymentMode,
    payment_reference: paymentReference,
    balance: parseFloat(balance) || 0,
    currency: invoice?.currency || 'KSH',
  };

  // Auto-save functionality
  useAutoSave('receipt', null, documentData, invoiceItems);

  const handlePreview = () => {
    openPreview(documentData, invoiceItems);
  };

  return (
    <div className="min-h-screen bg-[#2B372A] pb-20">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Create Receipt</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <Input
              type="date"
              label="Receipt Date"
              value={receiptDate.split('T')[0]}
              onChange={(e) => setReceiptDate(e.target.value)}
              required
            />
            <Input
              label="Received From"
              value={receivedFrom}
              onChange={(e) => setReceivedFrom(e.target.value)}
              required
            />
            <Input
              type="number"
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              label="Received By"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              required
            />
            <Select
              label="Payment Mode"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as typeof paymentMode)}
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'cheque', label: 'Cheque' },
                { value: 'mpesa', label: 'M-PESA' },
                { value: 'bank', label: 'Bank Transfer' },
              ]}
            />
            <Input
              label="Payment Reference"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder={`Enter ${paymentMode.toUpperCase()} reference`}
            />
            <Input
              type="number"
              label="Balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <Button variant="primary" onClick={handlePreview}>
              Preview Receipt
            </Button>
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={closePreview}
          document={documentData}
          items={invoiceItems}
        />
      )}
    </div>
  );
}