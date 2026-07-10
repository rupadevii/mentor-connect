import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import api from '../services/api'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Loader from '../components/ui/Loader';
import SessionCard from '../components/sessions/SessionCard';
import { Link } from 'react-router-dom';

const status = ["Upcoming", "Cancelled", "Past", "My Bookings", "My Sessions"]

export default function SessionsPage() {
    const [sessions, setSessions] = useState([])
    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState("Upcoming")
    const [filter, setFilter] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [sessionId, setSessionId] = useState(null)
    const [action, setAction] = useState(null)
    const [page, setPage] = useState(1)
    const [nextPage, setNextPage] = useState(true)
    const [prevPage, setPrevPage] = useState(true)

    async function getSessions(){
        let query = ""
        if(filter) query = `type=${selectedStatus}&topic=${filter}&pageNumber=${page}`
        else query = `type=${selectedStatus}&pageNumber=${page}`
        try{
            setLoading(true)
            const response = await api.get(`/sessions?${query}`)
            const data = response.data.data.sessions
            setSessions(data)
            const status = response.data.data.pagination
            console.log(status)
            setNextPage(status.hasNextPage)
            setPrevPage(status.hasPreviousPage)
        }
        catch(error){
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getSessions()
    }, [selectedStatus, filter, page])

    useEffect(() => {
        const loadTopics = async () => {
            try{
                const response = await api.get('/topics')
                setTopics(response.data.data)
            }catch(err){
                console.error(err)
            }
        }
    
        loadTopics()

    }, [])
    
    function handleChange(e){
        setPage(1)
        if(e.target.value==="All"){
            setFilter(null)
        }
        else{
            setFilter(e.target.value)
        }
    }

    function selectStatus(item){
        setSelectedStatus(item)
        setPage(1)
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
            setIsLoading(true)
            const response = await api.patch(`/sessions/book/${sessionId}`)
            const data = response.data
            console.log(data)
        }
        catch(error){
            console.log(error)
        }
        finally{
            setIsLoading(false)
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
                            <div 
                                key={index}  
                                onClick={() => selectStatus(item)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${selectedStatus===item ? "bg-black text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                >{item}</div>
                        ))}
                    </div>
                    
                    <div>
                        <label className="mx-2 text-sm">Filter by Topic:</label>
                        <select onChange={handleChange} className='border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black'>
                            <option>All</option>
                            {topics.map((topic, index) => (
                                <option value={topic._id} key={index}>{topic.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {loading? (
                    <div className="p-20"><Loader/></div>
                ) : (
                    <div>
                        {sessions.length===0 ? (
                            <div className='text-center py-10'>No sessions found.</div>
                        ) : (
                            <div className='flex justify-center flex-col'>
                                <div className='flex flex-wrap justify-center'>
                                    {sessions.map(session => (
                                        // <Link to={`/sessions/${session._id}`}  key={session._id}>
                                            <SessionCard 
                                                session={session} 
                                                selectedStatus={selectedStatus} 
                                                openModalBook={openModalBook} 
                                                openModalCancel={openModalCancel}/>
                                        // </Link>
                                    ))}
                                </div>
                                <div className='flex gap-3 justify-center my-5'>
                                    <button onClick={() => setPage(prev => prev-1)} disabled={!prevPage} className='border rounded-md border-black px-1 py-1 disabled:border-stone-200 disabled:cursor-not-allowed'><ChevronLeft /></button>
                                    <button onClick={() => setPage(prev => prev+1)} disabled={!nextPage} className='border rounded-md border-black px-1 py-1 disabled:border-stone-200 disabled:cursor-not-allowed'><ChevronRight /></button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {action==="book" && (
                    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Book Session">
                        <p>Are you sure you want to book session?</p>
                        <Button onClick={bookSession}>
                            {isLoading ? "Booking..." : "Book"}
                        </Button>
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
