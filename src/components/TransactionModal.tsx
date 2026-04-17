import React, { useState, useEffect } from 'react';
import { transactionService } from '../api/transaction.service';
import { X, Loader2 } from 'lucide-react';
import './TransactionModal.css';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: any; // If provided, we are editing
}

const CATEGORIES = [
  "SALARY", "FREELANCE", "INVESTMENTS", "RENT", "UTILITIES",
  "GROCERIES", "TRANSPORTATION", "ENTERTAINMENT",
  "HEALTHCARE", "EDUCATION", "OTHER",
];

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSuccess, transaction }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    category: 'GROCERIES',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category,
        date: new Date(transaction.date).toISOString().split('T')[0],
        description: transaction.description
      });
    } else {
      setFormData({
        amount: '',
        type: 'EXPENSE',
        category: 'GROCERIES',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const idempotencyKey = crypto.randomUUID();
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        // Format date to ISO string for backend
        date: new Date(formData.date).toISOString()
      };

      if (transaction) {
        await transactionService.update(transaction.id, payload, idempotencyKey);
      } else {
        await transactionService.create(payload, idempotencyKey);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <div className="modal-header">
          <h3>{transaction ? 'Edit Transaction' : 'New Transaction'}</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                required
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="What was this for?"
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (transaction ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
