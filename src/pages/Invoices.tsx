import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CurrencySelector } from '../components/forms/CurrencySelector';
import { InlineVehicleTable } from '../components/forms/vehicle/InlineVehicleTable';
import { PreviewModal } from '../components/previews/PreviewModal';
import { Input } from '../components/ui/Input';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAutoSave } from '../hooks/useAutoSave';
import { usePreview } from '../hooks/usePreview';
import type { Document, VehicleItem } from '../types';

export function Invoices() {
  const [searchParams] = useSearchParams();
  const quotationId = searchParams.get('quotationId');
  const { documents, items: allItems } = useLocalStorage();
  const { isPreviewOpen, openPreview, closePreview } = usePreview();

  // If quotationId exists, pre-fill data from quotation
  const quotation = quotationId 
    ? documents.find(doc => doc.id === quotationId && doc.type === 'quotation')
    : null;
  const quotationItems = quotationId ? allItems[quotationId] || [] : [];

  const [currency, setCurrency] = useState<'KSH' | 'USD'>(quotation?.currency || 'KSH');
  const [clientName, setClientName] = useState(quotation?.client_name || '');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<VehicleItem[]>(quotationItems);

  // Auto-save functionality
  const documentData = {
    client_name: clientName,
    currency,
    created_at: invoiceDate,
    due_date: dueDate,
    type: 'invoice' as const,
    id: crypto.randomUUID(),
    total_amount: items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  };

  useAutoSave('invoice', null, documentData, items);

  const handleAddItem = (item: Omit<VehicleItem, 'id'>) => {
    setItems([...items, { ...item, id: crypto.randomUUID() }]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handlePreview = () => {
    openPreview(documentData, items);
  };

  return (
    <div className="min-h-screen bg-[#2B372A] pb-20">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Create Invoice</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Client Details</h2>
            <div className="space-y-4">
              <Input 
                label="Client Name" 
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="input-groove" 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  type="date" 
                  label="Invoice Date"
                  value={invoiceDate}
                  onChange={e => setInvoiceDate(e.target.value)}
                  className="input-groove"
                />
                <Input 
                  type="date" 
                  label="Due Date (Optional)"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="input-groove"
                />
              </div>
            </div>
          </div>

          <InlineVehicleTable
            items={items}
            currency={currency}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onPreview={handlePreview}
          />
        </div>
      </div>

      {isPreviewOpen && (
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={closePreview}
          document={documentData}
          items={items}
        />
      )}
    </div>
  );
}