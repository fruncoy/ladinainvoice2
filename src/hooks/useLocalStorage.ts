import { useState, useEffect } from 'react';
import type { Document, VehicleItem } from '../types';
import * as storage from '../services/localStorage';

export function useLocalStorage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [items, setItems] = useState<Record<string, VehicleItem[]>>({});

  useEffect(() => {
    setDocuments(storage.getDocuments());
    setItems(storage.getItems());
  }, []);

  const saveDocument = (document: Document) => {
    // Check if document already exists
    const existingIndex = documents.findIndex(doc => doc.id === document.id);
    
    if (existingIndex >= 0) {
      // Update existing document
      const updatedDocuments = [...documents];
      updatedDocuments[existingIndex] = {
        ...document,
        created_at: documents[existingIndex].created_at // Preserve original creation time
      };
      storage.saveDocuments(updatedDocuments);
      setDocuments(updatedDocuments);
    } else {
      // Add new document with timestamp
      const newDocument = {
        ...document,
        created_at: new Date().toISOString() // Store as ISO string for consistent formatting
      };
      const updatedDocuments = [...documents, newDocument];
      storage.saveDocuments(updatedDocuments);
      setDocuments(updatedDocuments);
    }
  };

  const deleteDocument = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      const updatedDocuments = documents.filter(doc => doc.id !== id);
      storage.saveDocuments(updatedDocuments);
      storage.deleteItems(id);
      setDocuments(updatedDocuments);
      setItems(prevItems => {
        const newItems = { ...prevItems };
        delete newItems[id];
        return newItems;
      });
    }
  };

  const saveItems = (documentId: string, items: VehicleItem[]) => {
    storage.saveItems(documentId, items);
    setItems(prevItems => ({
      ...prevItems,
      [documentId]: items
    }));
  };

  return {
    documents,
    items,
    saveDocument,
    deleteDocument,
    saveItems
  };
}