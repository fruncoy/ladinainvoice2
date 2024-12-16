import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { sendDocumentEmail } from '../services/email';
import type { Document } from '../types';

export function useDocumentActions() {
  const { deleteDocument, items } = useLocalStorage();

  const handleEdit = useCallback((document: Document) => {
    window.location.href = `/${document.type}s/${document.id}`;
  }, []);

  const handleDelete = useCallback((document: Document) => {
    deleteDocument(document.id);
  }, [deleteDocument]);

  const handleEmail = useCallback(async (document: Document) => {
    const email = window.prompt('Enter recipient email address:');
    if (!email) return;

    const docItems = items[document.id] || [];
    const result = await sendDocumentEmail(document, docItems, email);
    
    alert(result.message);
  }, [items]);

  const handleGenerateReceipt = useCallback((invoiceId: string) => {
    window.location.href = `/receipts/new?invoiceId=${invoiceId}`;
  }, []);

  const handleGenerateInvoice = useCallback((quotationId: string) => {
    window.location.href = `/invoices/new?quotationId=${quotationId}`;
  }, []);

  return {
    handleEdit,
    handleDelete,
    handleEmail,
    handleGenerateReceipt,
    handleGenerateInvoice
  };
}