import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import api from '../services/api'
import Button from '../components/ui/Button'
import { formatDate, formatTime } from '../utils/helpers'
const status = ["Upcoming", "Cancelled", "Past", "My Bookings", "My Sessions"]

export default function SessionsPage() {
    const [sessions, setSessions] = useState([])
    const [topics, setTopics] = useState([])
    const [selectedStatus, setSelectedStatus] = useState("Upcoming")
    const [filter, setFilter] = useState(null)

    useEffect(() => {
        async function getSessions(){
            let query = ""
            if(filter) query = `type=${selectedStatus}&topicId=${filter}`
            else query = `type=${selectedStatus}`
            try{
                const response = await api.get(`/sessions?${query}`)
                const data = response.data.data.sessions
                setSessions(data)
                console.log(data)
            }
            catch(error){
                console.log(error)
            }
        }

        getSessions()
    }, [selectedStatus, filter])

    useEffect(() => {
        const loadTopics = async () => {
            try{
                const response = await api.get('/topics')
                const {data} = await response.data;
                console.log(data)
                setTopics(data)
            }catch(err){
                console.error(err)
            }
        }
    
        loadTopics()

    }, [])
    
    function handleChange(e){
        if(e.target.value==="All"){
            setFilter(null)
        }
        else{
            setFilter(e.target.value)
        }
    }

    return (
        <Layout>
            <div className=''>
                <div className='flex justify-between'>
                    <div className='flex gap-3'>
                        {status.map((item, index) => (
                            <div key={index} className={`${selectedStatus===item ? "active": ""} cursor-pointer p-2 rounded-md`} onClick={() => setSelectedStatus(item)}>{item}</div>
                        ))}
                    </div>

                    <select onChange={handleChange}>
                        <option>All</option>
                        {topics.map(topic => (
                            <option value={topic._id}>{topic.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    {sessions.length===0 ? (
                        <div>No sessions found.</div>
                    ) : (
                        <div className='flex flex-wrap justify-center'>
                            {sessions.map(session => (
                                <div className="w-[500px] m-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-6 border border-purple-200" key={session.id}>
                                    <div className='flex justify-between'>
                                        <div className='border border-purlpe-200 p-3'>
                                            <p>{session.createdBy.email}</p>
                                            <h3>
                                            {session.createdBy.name}
                                            </h3>
                                        </div> 
                                        <div>
                                            <p>{formatDate(session.eventDate)}</p>
                                            <span>{formatTime(session.startTime)}</span>
                                            <span>{formatTime(session.endTime)}</span>
                                        </div>
                                    </div>
                                    <div className='text-center'>
                                        <h2>{session.eventName}</h2>
                                        <p>{session.desc}</p>
                                    </div>
                                    
                                    <div className='flex justify-between items-center'>
                                        <div>
                                            {session.topic.name}
                                        </div>
                                        {(session.status==="AVAILABLE" && selectedStatus==="Upcoming") && (
                                            <Button>Book</Button>
                                        )}
        
                                        {session.status==="BOOKED" && (
                                            <div>
                                                <Button>Join</Button>
                                                <button>Cancel</button>
                                            </div>
                                        )}
        
                                        {selectedStatus==="My Sessions" && (
                                            <div>
                                                <Button>Join</Button>
                                                <button>Give Feedback</button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* {formatDate(session.eventDate)} */}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}
