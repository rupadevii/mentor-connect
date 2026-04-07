import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button';
import api from '../services/api';
import Alert from '../components/ui/Alert';
import { useEffect } from 'react';

export default function CreateSessionPage() {
    const [formData, setFormData] = useState({
        eventName: '',
        desc: '',
        eventDate: '',
        startTime: '',
        endTime: '',
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
        } finally {
        }
        };

        loadProfile();

    }, []);

    console.log(topics)

    useEffect(() => {
        const loadTopics = async () => {
            try{
                const response = await api.get('/topics')
                const {data} = await response.data;
                console.log(data)
                setTopics(data.filter(item => item.level <= user.level))
            }catch(err){
                console.error(error)
            }
        }

        loadTopics()
    }, [user])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const startDateTime = new Date(`${formData.eventDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.eventDate}T${formData.endTime}`);

        try {
            const response = await api.post('/sessions/', {...formData, startTime: startDateTime.toISOString(), endTime: endDateTime.toISOString()});
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

    console.log(formData)
    return (
        <Layout>
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex items-center gap-4 pb-2 flex-col">
                    <div className='w-full'>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Event Name:</label>
                        <input
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Event Description:</label>
                        <textarea
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            placeholder="Enter event description"
                            className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                            required
                        ></textarea>
                    </div>
                    <div className='w-full'>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Event Date:</label>
                        <input
                            type="date"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                            placeholder="Enter event date"
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
                            // value={formData.topic}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                        >
                            <option>Select</option>
                            {topics?.map((item) => (
                            <option key={item.level} value={item._id}>
                                {item.name}
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
