import React from 'react';
import Layout from '../components/layout/Layout';

const DashboardPage = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="rounded-lg bg-white shadow p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Dashboard</h1>
          <p className="text-slate-600 mb-6">Welcome to Accio Mentor Connect</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-200">
              <div className="text-4xl mb-2">📊</div>
              <h2 className="font-semibold text-slate-900">Analytics</h2>
              <p className="text-slate-600 text-sm mt-1">View your performance</p>
            </div>
            
            <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-6 border border-green-200">
              <div className="text-4xl mb-2">👥</div>
              <h2 className="font-semibold text-slate-900">Mentees</h2>
              <p className="text-slate-600 text-sm mt-1">Manage your mentees</p>
            </div>
            
            <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-6 border border-purple-200">
              <div className="text-4xl mb-2">📝</div>
              <h2 className="font-semibold text-slate-900">Sessions</h2>
              <p className="text-slate-600 text-sm mt-1">Schedule sessions</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
