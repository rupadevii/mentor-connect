import { useEffect, useState } from 'react';
import { formatDate, formatTime } from '../../utils/helpers';
import Button from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';

export default function SessionCard({selectedStatus, session, openModalBook, openModalCancel}) {
    const navigate = useNavigate()
    const [now, setNow] = useState(Date.now())

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60 * 1000);
        return () => clearInterval(interval);
    }, []);


    function canJoin(){
        if(!session.startTime || !session.endTime){
            return false
        }

        const start = new Date(session.startTime).getTime()
        const end = new Date(session.endTime).getTime()

        return now >= (start-10*60*1000) && now <= end
    }

    function navigateToSessionDetailsPage(){
        navigate(`/sessions/${session._id}`)
    }

    function handleBookClick(e){
        e.stopPropagation()
        openModalBook(session._id)
    }

    function handleCancelClick(e){
        e.stopPropagation()
        openModalCancel(session._id)
    }

    function handleMentorFeedbackClick(e){
        e.stopPropagation()
        navigate(`/feedback/mentor/${session._id}`)
    }

    function handleMenteeFeedbackClick(e){
        e.stopPropagation()
        navigate(`/feedback/mentee/${session._id}`)
    }

    return (
        <div className="w-[500px] m-4 rounded-xl shadow-lg bg-white p-5 border border-gray-400 cursor-pointer transition-transform duration-200 hover:scale-[1.02]" onClick={navigateToSessionDetailsPage}>
            <div className='flex justify-between items-start'>
                <div className='border-slate-800 border-b-1'>
                    <h3 className='mt-1 text-sm font-semibold text-gray-900'>
                        {session.createdBy.name}
                    </h3>
                    <p className='text-sm mt-0.5 text-gray-600'>{session.createdBy.email}</p>
                </div> 
                <div className='text-right'>
                    <p className='text-sm font-medium text-gray-800'>{formatDate(session.eventDate)}</p>
                    <p className='text-xs text-gray-500'>{formatTime(session.startTime)} - {formatTime(session.endTime)}</p>
                </div>
            </div>
            <div className='my-4'>
                <h2 className='text-base font-semibold'>{session.eventName}</h2>
                <p className='text-sm mt-1 font-extralight text-gray-600 line-clamp-2'>{session.desc}</p>
            </div>
                                            
            <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                    <div className='text-xs border border-green-900 rounded-2xl px-2 py-1 text-green-800'>
                        {session.topic.name}
                    </div>
                </div>
                <div>
                    {(selectedStatus==="Upcoming") && (
                        session.status==="BOOKED" ? (
                            <Button variant='secondary' className='text-xs px-3 py-2'>Booked</Button>
                        ) : (
                            <Button onClick={handleBookClick} className='text-xs px-3 py-2'>Book</Button>
                        )
                    )}

                    {(selectedStatus==="My Bookings" || selectedStatus==="My Sessions") && (
                        <div className='flex gap-3'>
                            <a href={session.url}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}>
                                <Button disabled={session.status === "COMPLETED"|| !canJoin()} className='text-xs px-3 py-2'>Join</Button>
                            </a>
                            {(selectedStatus === "My Bookings" && session.status !== "COMPLETED") && (
                                <Button variant='secondary' onClick={handleCancelClick} className='text-xs px-3 py-2'>Cancel</Button>
                            )}
                            {(selectedStatus === "My Sessions" && session.status === "COMPLETED" && session.joinee !== null && (
                                <Button variant='secondary' className='text-xs px-3 py-2' disabled={session.mentorFeedback} onClick={handleMentorFeedbackClick}>Give Feedback</Button>
                            ))}
                            {(selectedStatus === "My Bookings" && session.status === "COMPLETED" && (
                                <Button variant='secondary' className='text-xs px-3 py-2' disabled={session.menteeFeedback} onClick={handleMenteeFeedbackClick}>Give Feedback</Button>
                            ))}
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    )
}
