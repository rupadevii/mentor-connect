import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import api from '../services/api';

const DashboardPage = () => {
    const [dashboard, setDashboard] = useState([])

    useEffect(() => {
        async function loadDashboard(){
            try{
                const response = await api.get(`/sessions/dashboard`)
                const data = response.data.data
                setDashboard(data)
            }
            catch(error){
                console.log(error)
            }
        }

        loadDashboard()
    }, [])

    console.log(dashboard)

    return (
        <Layout>
        <div className="max-w-6xl mx-auto">
            <div className="rounded-lg bg-white shadow p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Dashboard</h1>
            <p className="text-slate-600 mb-6">Welcome to Accio Mentor Connect</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-200">
                <div className="text-4xl mb-2">📊</div>
                    
                    <h2>Popular Topics</h2>
                    {dashboard[7]?.map(item => (
                        <div className='rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-3 border border-blue-200'>{item.topicName}-{item.count}</div>
                    ))}

                </div>
                
                <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-6 border border-green-200">
                
                </div>
                
                <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-6 border border-purple-200">
                    <div className="text-4xl mb-2">📝</div>
                    <h2 className="font-semibold text-slate-900">Sessions</h2>
                </div>
            </div>
            </div>
        </div>
        </Layout>
    );
};

export default DashboardPage;
