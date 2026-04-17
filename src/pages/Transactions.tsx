import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { transactionService } from '../api/transaction.service';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';
import './Transactions.css';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: ''
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await transactionService.getAll({ page, limit: 10, ...filters });
      setTransactions(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await transactionService.delete(id);
      fetchTransactions();
    }
  };

  return (
    <Layout title="Transactions">
      <div className="transactions-header">
        <div className="filter-group">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search description..." 
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <select 
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          <span>New Transaction</span>
        </button>
      </div>

      <div className="card table-card">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : transactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.description}</td>
                <td><span className="badge badge-secondary">{txn.category}</span></td>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${txn.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                    {txn.type}
                  </span>
                </td>
                <td className={txn.type === 'INCOME' ? 'text-income' : 'text-expense'}>
                  {txn.type === 'INCOME' ? '+' : '-'}${txn.amount.toLocaleString()}
                </td>
                <td>
                  <div className="action-btns">
                    <button onClick={() => handleDelete(txn.id)} className="action-btn delete" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {meta && (
          <div className="pagination">
            <button 
              disabled={!meta.pagination.hasPrevPage} 
              onClick={() => setPage(p => p - 1)}
              className="btn btn-secondary btn-sm"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="page-info">Page {meta.pagination.page} of {meta.pagination.totalPages}</span>
            <button 
              disabled={!meta.pagination.hasNextPage} 
              onClick={() => setPage(p => p + 1)}
              className="btn btn-secondary btn-sm"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;
