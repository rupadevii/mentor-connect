import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import Loader from '../components/ui/Loader';
import { formatDate, formatTime } from '../utils/helpers';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';

export default function SessionDetailsPage() {
    const {id} = useParams()
    const [session, setSession] = useState({})
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [action, setAction] = useState(null)
    const [userId, setUserId] = useState(null)
    const [booking, setBooking] = useState(false)
    const [cancelling, setCancelling] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()
    const [now, setNow] = useState(Date.now())

    function canJoin(){
        if(!session.startTime || !session.endTime){
            return false
        }

        const start = new Date(session.startTime).getTime()
        const end = new Date(session.endTime).getTime()

        return now >= start && now <= end
    }

    function openModalBook(){
        setIsOpen(true)
        setAction("book")
    }

    function openModalCancel(){
        setAction("cancel")
        setIsOpen(true)
    }

    async function bookSession(){
        try{
            setBooking(true)
            const response = await api.patch(`/sessions/book/${session._id}`)
            const data = response.data
            setSuccess("Session booked sucessfully.")
            getSessionDetails()
        }
        catch(error){
            setError(error.response?.data?.msg || "Failed to book session.")
        }
        finally{
            setBooking(false)
            setIsOpen(false)
        }
    }

    async function cancelSession(){
        try{
            setCancelling(true)
            const response = await api.patch(`/sessions/cancel/${session._id}`)
            const data = response.data
            setSuccess("Session cancelled successfully.")
            getSessionDetails()
        }
        catch(error){
            setError(error.response?.data?.msg || "Failed to cancel session.")
        }
        finally{
            setIsOpen(false)
            setCancelling(false)
        }
    }

    async function getSessionDetails(){
        try {
            setLoading(true)
            const res = await api.get(`/sessions/${id}`)
            setSession(res.data.data)
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getSessionDetails()
    }, [])

    useEffect(() => {
        async function getUser(){
            try{
                const res = await api.get('/auth/me')
                setUserId(res.data.user.id)
            }catch(error){
                console.log(error)
            }
        }
        getUser()
    }, [])

    return (
        <Layout>
            {success && (<Alert type="success" message={success}/>)}
            {error && (<Alert type="error" message={error}/>)}
            <Button variant="secondary" onClick={() => navigate(-1)} className="mb-4 text-xs px-3 py-2">
                ← Back
            </Button>
            <div className="max-w-3xl mx-auto bg-white space-y-4 border px-10 py-7 rounded-xl">
                {loading ? (
                    <div><Loader/></div>
                ) : (
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold">{session.eventName}</h1>
                                <span className="inline-block mt-2 text-xs border border-green-900 rounded-2xl px-2 py-1 text-green-800">
                                    {session.topic?.name ?? 'No topic'}
                                </span>
                            </div>
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                                {session.status}
                            </span>
                        </div>
                        <hr/>
                        <p className="text-sm text-gray-600 mb-6 mt-3">{session.desc}</p>
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Date</p>
                            <p className="font-medium">{formatDate(session.eventDate)}, {formatTime(session.startTime)}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-7 mt-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Mentor</p>
                                <p className="font-medium">{session.createdBy?.name ?? 'Unknown'}</p>
                                <p className="text-gray-500 text-xs">{session.createdBy?.email ?? ''}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Mentee</p>
                                <p className="font-medium">{session.joinee?.name ?? 'Not booked yet'}</p>
                                {session.joinee?.email && <p className="text-gray-500 text-xs">{session.joinee.email}</p>}
                            </div>
                        </div>

                        <div className="flex gap-3 my-6">
                            {session.status === 'AVAILABLE' && userId && session.createdBy?._id!==userId && (
                                <Button onClick={openModalBook} className="text-xs px-3 py-2">Book</Button>
                            )} 

                            {userId && (userId===session.joinee?._id || userId===session.createdBy?._id) && session.status !== 'CANCELLED' && session.status !== 'COMPLETED' && (
                                <a
                                    href={session.url}
                                    target="_blank"
                                >
                                    <Button className="text-xs px-3 py-2" disabled={!canJoin()}>Join</Button>
                                </a> 
                            )}

                            {userId && session.joinee?._id === userId && session.status === 'BOOKED' && (
                                <Button variant="secondary" onClick={openModalCancel} className="text-xs px-3 py-2">
                                    Cancel
                                </Button>
                            )}

                            {userId && session.joinee?._id===userId && session.status === 'COMPLETED' && !session.menteeFeedback?.submittedAt && (
                                <Button variant="secondary" onClick={() => navigate(`/feedback/mentee/${session._id}`)} className="text-xs px-3 py-2">
                                    Give Feedback
                                </Button>
                            )}

                            {userId && session.createdBy?._id === userId && session.status === 'COMPLETED' && !session.mentorFeedback?.submittedAt && session.joinee && (
                                <Button variant="secondary" onClick={() => navigate(`/feedback/mentor/${session._id}`)} className="text-xs px-3 py-2">
                                    Give Feedback
                                </Button>
                            )}
                        </div>

                        {session.status==="COMPLETED" && session.joinee && (
                            (userId===session.createdBy?._id) || (userId===session.joinee?._id)
                        ) && (
                             <div className="border-t pt-6 space-y-4">
                                <h2 className="text-lg font-semibold">Feedback</h2>
                                {userId===session.joinee?._id && (
                                    session.menteeFeedback?.submittedAt ? (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            {session.mentorFeedback?.submittedAt ? (
                                                <p className="text-sm">{session.mentorFeedback?.comment}</p>
                                            ) : (
                                                <p className='text-sm'>Awaiting Feedback.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className='text-sm'>Submit Feedback to view mentor's feedback</p>
                                    )
                                )}

                                {userId===session.createdBy?._id && (
                                    session.mentorFeedback?.submittedAt ? (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            {session.menteeFeedback?.submittedAt ? (
                                                <div className="text-sm">
                                                    <p>{session.menteeFeedback?.comment}</p>
                                                    <p className='text-lg my-3 font-bold'>Rating: {session.menteeFeedback?.rating}</p>
                                                    </div>
                                                
                                            ) : (
                                                <p className='text-sm'>Mentee has not submitted feedback yet.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className='text-sm'>Submit Feedback to view mentee's feedback</p>
                                    )
                                )}

                            </div>
                        )}
                    </div>
                )}
            </div>

            {action==="book" && (
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Book Session">
                    <p>Are you sure you want to book the session?</p>
                    <Button onClick={bookSession}>
                        {booking ? "Booking..." : "Book"}
                    </Button>
                </Modal>
            )}
            {action==="cancel" && (
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Cancel Session">
                    <p>Are you sure you want to cancel the session?</p>
                    <Button variant="danger" onClick={cancelSession}>
                        {cancelling ? "Cancelling..." : "Cancel"}
                    </Button>
                </Modal>
            )}  
        </Layout>
    )
}
