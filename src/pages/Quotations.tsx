import { useState } from 'react';
import { CurrencySelector } from '../components/forms/CurrencySelector';
import { InlineVehicleTable } from '../components/forms/vehicle/InlineVehicleTable';
import { Input } from '../components/ui/Input';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAutoSave } from '../hooks/useAutoSave';
import type { Document, VehicleItem } from '../types';

export function Quotations() {
  const [currency, setCurrency] = useState<'KSH' | 'USD'>('KSH');
  const [clientName, setClientName] = useState('');
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('');
  const [items, setItems] = useState<VehicleItem[]>([]);

  // Auto-save functionality
  useAutoSave('quotation', null, {
    client_name: clientName,
    currency,
    created_at: quotationDate,
    due_date: validUntil,
  }, items);

  const handleAddItem = (item: Omit<VehicleItem, 'id'>) => {
    setItems([...items, { ...item, id: crypto.randomUUID() }]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#2B372A] pb-20">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Create Quotation</h1>
        
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
                  label="Quotation Date"
                  value={quotationDate}
                  onChange={e => setQuotationDate(e.target.value)}
                  className="input-groove"
                />
                <Input 
                  type="date" 
                  label="Valid Until"
                  value={validUntil}
                  onChange={e => setValidUntil(e.target.value)}
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
          />
        </div>
      </div>
    </div>
  );
}