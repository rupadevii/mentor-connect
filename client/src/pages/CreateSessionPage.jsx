import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button';
import api from '../services/api';
import Alert from '../components/ui/Alert';
import { useEffect } from 'react';

export default function CreateSessionPage() {
    const [formData, setFormData] = useState({
        eventDate: '',
        startTime: '',
        endTime: '',
        topic: ''
    });
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null)
    const topics = [
        {
            level: 1,
            topic: "Beginner"
        },
        {
            level: 2,
            topic: "Basic Programming"
        },
        {
            level: 3,
            topic: "DSA"
        },
        {
            level: 4,
            topic: "React"
        },
        {
            level: 5,
            topic: "Backend"
        },
        {
            level: 6,
            topic: "Full stack"
        }
    ]

    useEffect(() => {
        const loadProfile = async () => {
        setError('');

        try {
            const response = await api.get('/auth/me');
            const currentUser = response?.data?.user;
            setUser(currentUser);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile');
        } finally {
        }
        };

        loadProfile();
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/sessions/create', formData);
            setSuccess('Session created successfully');
            setFormData({
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
    console.log(formData)
    return (
        <Layout>
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex items-center gap-4 pb-2 flex-col">
                    <div className='w-full'>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Event Date:</label>
                        <input
                            type="date"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                            required
                        />
                    </div>

                    <div className='w-full flex gap-5'>
                        <div className='w-[50%]'>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
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
                        <div className='w-[50%]'>
                            <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                min={formData.startTime}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                                required
                            />
                        </div>
                    </div>
                    <div className='w-full'>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
                        <select
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                        >
                            {topics.slice(0, user?.level).map((item) => (
                            <option key={item.level} value={item.topic}>
                                {item.topic}
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
        </Layout>
    )
}
