import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import api from '../services/api'
import Button from '../components/ui/Button'
import { formatDate, formatTime } from '../utils/helpers'
import Modal from '../components/ui/Modal'
const status = ["Upcoming", "Cancelled", "Past", "My Bookings", "My Sessions"]

export default function SessionsPage() {
    const [sessions, setSessions] = useState([])
    const [topics, setTopics] = useState([])
    const [selectedStatus, setSelectedStatus] = useState("Upcoming")
    const [filter, setFilter] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [sessionId, setSessionId] = useState(null)
    const [action, setAction] = useState(null)

    async function getSessions(){
        let query = ""
        if(filter) query = `type=${selectedStatus}&topic=${filter}`
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

    useEffect(() => {
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

    function openModalBook(id){
        setSessionId(id)
        setIsOpen(true)
        setAction("book")
    }

    function openModalCancel(id){
        setSessionId(id)
        setAction("cancel")
        setIsOpen(true)
    }

    async function bookSession(){
        try{
            const response = await api.patch(`/sessions/book/${sessionId}`)
            const data = response.data
            console.log(data)
        }
        catch(error){
            console.log(error)
        }
        finally{
            setIsOpen(false)
            getSessions()
        }
    }

    async function cancelSession(){
        try{
            const response = await api.patch(`/sessions/cancel/${sessionId}`)
            const data = response.data
            console.log(data)
        }
        catch(error){
            console.log(error)
        }
        finally{
            setIsOpen(false)
            getSessions()
        }
    }

    return (
        <Layout>
            <div className='mx-5'>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-3 mb-3'>
                        {status.map((item, index) => (
                            <div key={index} className={`${selectedStatus===item ? "active": ""} cursor-pointer p-2`} onClick={() => setSelectedStatus(item)}>{item}</div>
                        ))}
                    </div>

                    <select onChange={handleChange} className='border border-black p-2 rounded-xl'>
                        <option>All</option>
                        {topics.map((topic, index) => (
                            <option value={topic._id} key={index}>{topic.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    {sessions.length===0 ? (
                        <div className='text-center py-7'>No sessions found.</div>
                    ) : (
                        <div className='flex flex-wrap justify-center'>
                            {sessions.map(session => (
                                <div className="w-[500px] m-4 rounded-xl shadow-lg  bg-gradient-to-br from-purple-50 to-purple-100 p-6 border border-purple-400 cursor-pointer transition-transform duration-200 hover:scale-[1.02]" key={session._id}>
                                    <div className='flex justify-between'>
                                        <div className='border border-black rounded-xl p-3 text-center'>
                                            <p className='text-sm text-gray-600'>{session.createdBy.email}</p>
                                            <h3 className='mt-1'>
                                            {session.createdBy.name}
                                            </h3>
                                        </div> 
                                        <div className='text-right'>
                                            <p className='font-bold text-lg'>{formatDate(session.eventDate)}</p>
                                            <span>{formatTime(session.startTime)}</span> - <span>{formatTime(session.endTime)}</span>
                                        </div>
                                    </div>
                                    <div className='text-center my-4 h-[75px]'>
                                        <h2 className='text-lg font-bold'>{session.eventName}</h2>
                                        <p className='font-extralight text-gray-600 line-clamp-2'>{session.desc}</p>
                                    </div>
                                    
                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center'>
                                            <div className='border border-green-900 rounded-2xl px-2 py-1 text-sm text-green-800'>
                                                {session.topic.name}
                                            </div>
                                        </div>
                                        <div>
                                            {(selectedStatus==="Upcoming") && (
                                                session.status==="BOOKED" ? (
                                                    <Button variant='secondary'>Booked</Button>
                                                ) : (
                                                    <Button onClick={() => openModalBook(session._id)}>Book</Button>
                                                )
                                            )}
            
                                            {selectedStatus==="My Bookings" && (
                                                <div className='flex gap-3'>
                                                    <Button disabled={session.status === "COMPLETED"}>Join</Button>
                                                    {session.status !== "COMPLETED" && (
                                                        <Button variant='secondary' onClick={() => openModalCancel(session._id)}>Cancel</Button>
                                                    )}
                                                </div>
                                            )}
            
                                            {selectedStatus==="My Sessions" && (
                                                <div className='flex gap-3'>
                                                        <Button disabled={session.status === "COMPLETED"}>Join</Button>
                                                    {session.status === "COMPLETED" && (
                                                        <Button variant='secondary'>Give Feedback</Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                    </div>
                                    
                                    {/* {formatDate(session.eventDate)} */}
                                </div>
                                
                              
                            ))}
                        </div>
                    )}
                </div>
                {action==="book" && (
                    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Book Session">
                        <p>Are you sure you want to book session?</p>
                        <Button onClick={bookSession}>Book</Button>
                    </Modal>
                )}
                {action==="cancel" && (
                    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Cancel Session">
                        <p>Are you sure you want to cancel session?</p>
                        <Button variant="danger" onClick={cancelSession}>Cancel</Button>
                    </Modal>
                )}
            </div>
        </Layout>
    )
}
