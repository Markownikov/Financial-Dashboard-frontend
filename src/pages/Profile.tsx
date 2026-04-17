import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../api/auth.service';
import { User, Lock, Mail, UserCircle, Save, AlertCircle, CheckCircle } from 'lucide-react';
import './Profile.css';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="User Profile">
      <div className="profile-container">
        <div className="profile-sidebar card">
          <div className="profile-header">
            <div className="profile-avatar">{user?.name[0].toUpperCase()}</div>
            <h3>{user?.name}</h3>
            <p className="profile-role-badge">{user?.role}</p>
          </div>
          
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => { setActiveTab('info'); setMessage({ type: '', text: '' }); }}
            >
              <User size={18} />
              <span>Account Info</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => { setActiveTab('password'); setMessage({ type: '', text: '' }); }}
            >
              <Lock size={18} />
              <span>Security</span>
            </button>
          </div>
        </div>

        <div className="profile-main card">
          {message.text && (
            <div className={`message-banner ${message.type}`}>
              {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          {activeTab === 'info' ? (
            <div className="profile-section">
              <h2>Account Information</h2>
              <p className="section-desc">Manage your account details and settings.</p>
              
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <div className="info-value">
                    <UserCircle size={18} />
                    <span>{user?.name}</span>
                  </div>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <div className="info-value">
                    <Mail size={18} />
                    <span>{user?.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <label>Account Status</label>
                  <div className="info-value">
                    <span className="status-dot active"></span>
                    <span>{user?.status}</span>
                  </div>
                </div>
                <div className="info-item">
                  <label>User Role</label>
                  <div className="info-value">
                    <span>{user?.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="profile-section">
              <h2>Security Settings</h2>
              <p className="section-desc">Update your password to keep your account secure.</p>
              
              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>New Password</label>
                    <div className="input-wrapper">
                      <Lock size={18} className="input-icon" />
                      <input 
                        type="password" 
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="field-hint">Min. 8 chars, 1 upper, 1 lower, 1 number</p>
                  </div>
                  
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="input-wrapper">
                      <Lock size={18} className="input-icon" />
                      <input 
                        type="password" 
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary profile-save-btn" disabled={isLoading}>
                  {isLoading ? 'Updating...' : (
                    <>
                      <Save size={18} />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
