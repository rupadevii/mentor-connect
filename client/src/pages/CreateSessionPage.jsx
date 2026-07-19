import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button';
import api from '../services/api';
import Alert from '../components/ui/Alert';
import { useEffect } from 'react';
import Input from '../components/ui/Input';

export default function CreateSessionPage() {
    const [formData, setFormData] = useState({
        eventName: '',
        desc: '',
        eventDate: '',
        startTime: '',
        topic: ''
    });
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null)
    const [topics, setTopics] = useState([])

    useEffect(() => {
        const loadProfile = async () => {
            setError('');

            try {
                const response = await api.get('/auth/me');
                const currentUser = response?.data?.user;
                setUser(currentUser);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load profile');
            }
        };

        loadProfile();

    }, []);

    useEffect(() => {
        const loadTopics = async () => {
            try{
                const response = await api.get('/topics')
                const {data} = response.data;
                setTopics(data.filter(item => item.level <= user.level))
            }catch(error){
                console.error(error)
            }
        }

        loadTopics()
    }, [user])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const startDateTime = new Date(formData.eventDate + "T" + formData.startTime + ":00")
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)

        try {
            const response = await api.post('/sessions/', {...formData, startTime: startDateTime, endTime: endDateTime});
            setSuccess('Session created successfully');
            setFormData({
                eventName: '',
                desc: '',
                eventDate: '',
                startTime: '',
                endTime: '',
                topic: ''
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Session creation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            }));
        setError('');
    };

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    return (
        <Layout>
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}
            <div className='max-w-4xl mx-auto bg-white'>
                <form className="space-y-4 border border-gray-300 px-10 py-7 rounded-xl" onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-indigo-950">Create Session</h1>
                        <p className="text-sm text-slate-500 mt-1">Mentees at or below this topic's level will be able to book it.</p>
                    </div>
                    <div className="flex items-center gap-3 pb-2 flex-col">
                        <div className='w-full'>
                            <label className="block text-xs font-medium text-slate-700 mb-2">NAME:</label>
                            <Input
                                type="text"
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                placeholder="Enter event name"
                                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                                required
                            />
                        </div>
                        <div className='w-full'>
                            <label className="block text-xs font-medium text-slate-700 mb-2">DESCRIPTION:</label>
                            <textarea
                                name="desc"
                                value={formData.desc}
                                onChange={handleChange}
                                placeholder="Enter event description"
                                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                                required
                            ></textarea>
                        </div>
                        <div className='w-full mb-3'>
                            <div className='w-full flex gap-3'>
                                <div className='w-[50%]'>
                                    <label className="block text-xs font-medium text-slate-700 mb-2">DATE:</label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        min={tomorrow}
                                        placeholder="Enter event date"
                                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                                        required
                                    />
                                </div>
                                <div className='w-[50%]'>
                                    <label className="block text-xs font-medium text-slate-700 mb-2">START TIME:</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mt-2">Sessions run for 1 hour from the start time you choose.</p>
                            </div>
                        </div>

                        <div className='w-full'>
                            <label className="block text-xs font-medium text-slate-700 mb-2">TOPIC:</label>
                            <select
                                name="topic"
                                required
                                value={formData.topic}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                            >
                                <option value=''>Select</option>
                                {topics?.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name} - Level {item.level}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Button variant="primary" type="button" onClick={handleSubmit}>
                            Create
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
        
    )
}
