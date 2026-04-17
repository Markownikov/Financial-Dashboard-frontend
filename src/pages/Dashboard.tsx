import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import { dashboardService } from '../api/dashboard.service';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  Activity,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, trendsRes, categoriesRes, recentRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getTrends(6),
          dashboardService.getCategoryBreakdown(),
          dashboardService.getRecentActivity(5)
        ]);

        setSummary(summaryRes.data);
        setTrends(trendsRes.data);
        setCategories(categoriesRes.data);
        setRecent(recentRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return <Layout title="Dashboard"><div>Loading dashboard...</div></Layout>;

  const COLORS = ['#58a6ff', '#3fb950', '#f85149', '#d29922', '#a371f7'];

  return (
    <Layout title="Financial Dashboard">
      <div className="dashboard-grid">
        <StatsCard 
          title="Total Income" 
          value={`$${summary?.totalIncome.toLocaleString()}`} 
          icon={<TrendingUp size={24} />} 
          color="var(--income)"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard 
          title="Total Expense" 
          value={`$${summary?.totalExpense.toLocaleString()}`} 
          icon={<TrendingDown size={24} />} 
          color="var(--expense)"
          trend={{ value: 8, isPositive: false }}
        />
        <StatsCard 
          title="Net Balance" 
          value={`$${summary?.netBalance.toLocaleString()}`} 
          icon={<Wallet size={24} />} 
          color="var(--accent-primary)"
        />
        <StatsCard 
          title="Transactions" 
          value={summary?.totalTransactions} 
          icon={<Activity size={24} />} 
          color="var(--text-secondary)"
        />
      </div>

      <div className="charts-row">
        <div className="chart-card card">
          <div className="chart-header">
            <h3>Income vs Expense Trend</h3>
            <div className="chart-actions">
              <Calendar size={16} />
              <span>Last 6 Months</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--income)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--income)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--expense)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--expense)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--text-secondary)" 
                  tickFormatter={(m) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]}
                />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="income" stroke="var(--income)" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="var(--expense)" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card card mini">
          <h3>Category Breakdown</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categories.flatMap(c => c.categories)}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60}
                  paddingAngle={5}
                >
                  {categories.flatMap(c => c.categories).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="recent-row">
        <div className="card table-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="btn btn-secondary btn-sm">View All</button>
          </div>
          <table className="recent-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((txn) => (
                <tr key={txn.id}>
                  <td>
                    <div className="txn-desc">
                      <div className={`txn-icon ${txn.type.toLowerCase()}`}>
                        {txn.type === 'INCOME' ? <ArrowUpRight size={16} /> : <TrendingDown size={16} />}
                      </div>
                      <span>{txn.description}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-secondary">{txn.category}</span></td>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                  <td className={txn.type === 'INCOME' ? 'text-income' : 'text-expense'}>
                    {txn.type === 'INCOME' ? '+' : '-'}${txn.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
