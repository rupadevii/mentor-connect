import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import { formatDate, formatTime } from '../utils/helpers';
import Button from '../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, Cell, Label, Tooltip} from 'recharts';
import { Pie, PieChart, Sector } from 'recharts';
import { Link } from 'react-router-dom';
import Loader from '../components/ui/Loader'

const RADIAN = Math.PI / 180;
const COLORS = {
  COMPLETED: "#22c55e",   // green
  CANCELLED: "#ef4444",   // red
  BOOKED: "#3b82f6",      // blue
  DEFAULT: "#a1a1aa"
};

const DashboardPage = () => {
    const [dashboard, setDashboard] = useState([])
    const [loading, setLoading] = useState(false)
    const data = dashboard.statusBreakDown?.map(item => (
        {
            name: item.status,
            value: item.count
        }
    ))

    useEffect(() => {
        async function loadDashboard(){
            try{
                setLoading(true)
                const response = await api.get(`/sessions/dashboard`)
                const data = response.data.data
                setDashboard(data)
            }
            catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }

        loadDashboard()
    }, [])

    const isEmpty = dashboard.upcomingSessions?.length || dashboard.createdSessions?.length || dashboard.statusOverview?.length;

    return (
        <Layout>
        <div className="max-w-8xl mx-auto min-h-screen">
                <div className="w-full rounded-lg bg-white shadow p-8">
                {loading ? (
                    <div className='min-h-[500px] flex justify-center'><Loader/></div>
                ) : (
                    <div>
                        {!isEmpty ? (
                            <div className="">
                                <div>
                                    <p className="mb-3 text-3xl font-bold text-slate-900">Welcome!</p>
                                    <p className="mb-6 text-slate-500">Connect. Learn. Grow.</p>
                                </div>
                                <div className='border p-16 rounded-lg flex items-center flex-col mt-3'>
                                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Nothing here yet</h2>
                                    <p className="text-slate-500 mb-6">
                                        Book a mentor session or create one to get started.
                                    </p>
                                    <div className="flex justify-center gap-3">
                                        <Link to="/sessions"><Button className="text-xs px-4 py-2">Browse Sessions</Button></Link>
                                        <Link to="/create"><Button variant="secondary" className="text-xs px-4 py-2">Create Session</Button></Link>
                                    </div>
                                </div>
                            </div>
                            ) : (
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                                <div className='lg:col-span-2 space-y-6 overflow-x-auto'>
                                    <div>
                                        <p className="mb-3 text-3xl font-bold text-slate-900">Welcome!</p>
                                        <p className="mb-6 text-slate-500">Connect. Learn. Grow.</p>
                                    </div>
                                    {dashboard.upcomingSessions?.length > 0 ? (
                                        <div className="rounded-xl p-6 border border-slate-200">
                                            <div className='flex justify-between'>
                                                <h2 className='text-sm mb-4 font-semibold text-slate-800'>Your upcoming sessions</h2>
                                                <Link to="/sessions"><span className='hover:underline text-sm underline-offset-2'>View all →</span></Link>
                                            </div>
                                            <div className='w-full flex gap-4 items-start'>
                                                {dashboard.upcomingSessions?.map(session => (
                                                    <div className="w-[220px] rounded-lg shadow-lg bg-white p-4 border border-purple-400 cursor-pointer transition-transform duration-200 hover:scale-[1.02] flex flex-col gap-4 flex-shrink-0" key={session._id}>
                                                        <div>
                                                            <p className='font-semibold text-sm text-slate-800'>{formatDate(session.eventDate)}</p>
                                                            <span className='text-xs text-slate-600'>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                                                        </div>
                                                        <div>
                                                            <h2 className='text-sm font-semibold text-slate-900'>{session.eventName}</h2>
                                                        </div>
                                                        <div className='flex items-center'>
                                                            <div className='border border-green-900 rounded-2xl px-2 py-1 text-xs text-green-800'>
                                                                {session.topic?.name}
                                                            </div>
                                                        </div>       
                                                    </div>  
                                                ))}
                                            </div>  
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-slate-300 p-10 text-center h-[200px] flex flex-col justify-center">
                                            <p className="text-sm text-slate-500 mb-3">You don't have any upcoming sessions yet.</p>
                                            <Link to="/sessions">
                                                <Button variant="primary" className="text-xs px-4 py-2">
                                                    Browse available sessions
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                    
                                    {dashboard.latestCreatedSessions?.length > 0 && (
                                        <div className='border border-slate-300 rounded-xl p-6'>
                                            <h2 className='text-sm font-semibold text-slate-800 mb-4'>
                                                Created By You
                                            </h2>
                                            <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                                                {dashboard.latestCreatedSessions?.map(session => (
                                                    <Link to={`/sessions/${session._id}`} key={session._id}>
                                                        <div
                                                        className='border border-slate-300 rounded-lg p-4 cursor-pointer transition-transform duration-200 hover:scale-[1.02]'>
                                                            <p className="text-sm font-medium text-slate-800">
                                                                {formatDate(session.eventDate)}
                                                            </p>
                                                                <p className="text-xs text-slate-500 mb-2">
                                                                {formatTime(session.startTime)} – {formatTime(session.endTime)}
                                                            </p>

                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {session.eventName}
                                                            </p>

                                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                            {session.desc}
                                                            </p>

                                                            <span className="inline-block mt-3 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                                                                {session.topic?.name}
                                                            </span>

                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            
                                        </div>
                                    )}
                                </div>

                                <div className='space-y-6'>
                                    {dashboard.statusBreakDown?.length > 0 && (
                                        <div className="rounded-lg p-5 border border-purple-200 justify-between">
                                            <h2 className='text-sm text-slate-800 font-semibold'>Overview of Sessions created by you</h2>
                                            <div className='flex justify-center'>
                                                <PieChart width={260} height={180}>
                                                    <Pie
                                                    dataKey="value"
                                                    startAngle={180}
                                                    endAngle={0}
                                                    data={data}
                                                    cx="50%"
                                                    cy="100%"
                                                    outerRadius="120%"
                                                    fill="#8884d8"
                                                    label
                                                    >
                                                        {data?.map((entry, index) => (
                                                            <Cell
                                                            key={index}
                                                            fill={COLORS[entry.name] || COLORS.DEFAULT}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value, name) => [`${value}`, name]}
                                                        contentStyle={{
                                                            borderRadius: "12px",
                                                            border: "1px solid #e5e7eb"
                                                        }}
                                                        />
                                                </PieChart>
                                            </div>
                                            
                                            {dashboard.sessionsGroupedByTopic?.length > 0 && (
                                                <div className='mt-4'>
                                                    <p className='text-xs text-slate-400 flex-wrap gap-2'>Created</p>
                                                    {dashboard.sessionsGroupedByTopic?.map(item => (
                                                        <span key={item.topic?._id} className='text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded mr-2 shadow'>{item.topicName}</span>
                                                    ))}
                                                </div>
                                            )}

                                            {dashboard.bookedSessionsGroupedByTopic?.length > 0 && (
                                                <div className='mt-4'>
                                                    <p className='text-xs text-slate-400 mb-2'>Booked</p>
                                                    <div className='flex flex-wrap gap-2'>
                                                        {dashboard.bookedSessionsGroupedByTopic?.map(item => (
                                                            <span key={item.topic._id} className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded'>{item.topicName}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className='bg-white border border-slate-300 rounded-xl p-6'>
                                        <h2 className='text-sm font-semibold text-slate-800 mb-4'>Popular Topics</h2>
                                        <div className='space-y-2'>
                                            {dashboard.popularTopics?.map(item => (
                                                <div key={item.topicName} className='flex justify-between items-center px-3 py-2 border border-slate-200 rounded-md'>
                                                    <span className='text-sm text-slate-700'>
                                                        {item.topicName}
                                                    </span>
                                                    <span className='text-xs text-blue-00 font-medium'>
                                                        {item.count}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}
                </div>
        </div>
        </Layout>
    );
};

export default DashboardPage;
