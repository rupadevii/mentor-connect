import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useEffect, useState } from 'react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

export default function MentorFeedbackPage() {
    const {id} = useParams()
    const [userLevel, setUserLevel] = useState(1)
    const [comment, setComment] = useState('')
    const [success, setSuccess] = useState('')
    const [submitting, setSubmittting] = useState(false)
    const [selected, setSelected] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        try {
            if(!comment) return
            setSubmittting(true)
            const res = await api.post(`/sessions/feedback/mentor/${id}`, {comment, level: selected ? userLevel+1: userLevel})
            setSuccess('Feedback submitted successfully')
            setComment('')
            setTimeout(() => {
                navigate("/sessions")
            }, 1000)
        } catch (error) {
            console.log(error)
            setError(error.response?.data?.msg)
        } finally {
            setSubmittting(false)
        }
        
    }
    
    useEffect(() => {
        async function getSessionDetails(){
            try {
                const res = await api.get(`/sessions/${id}`)
                setUserLevel(res.data.data.joinee.level)
            } catch (error) {
                console.log(error)
                setError(error.response?.data?.msg)
            }
        }
        getSessionDetails()
    }, [])

    return (
        <Layout>
            {success && (<Alert type="success" message={success}/>)}
            {error && (<Alert type="error" message={error ||"Something went wrong"}/>)}
            <div className='max-w-3xl mx-auto bg-white'>
                <form className="space-y-4 border px-10 py-7 rounded-xl" onSubmit={handleSubmit}>
                    <h1 className='text-2xl mb-5 font-bold'>Feedback</h1>

                    <div>
                        <label htmlFor='feedback'>Comment:</label>
                        <br/>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows='8' cols='80' className='border p-3' required></textarea>
                    </div>

                    <div>
                        <p>Current level of the user: {userLevel}</p>
                        <p className='mb-4'>Was the performance of the mentee good enough for the user to be levelled up?</p>
                        <span onClick={() => userLevel<6 && setSelected(true)} className={`border p-2 rounded m-1 cursor-pointer hover:bg-slate-200 ${selected && "bg-slate-200"}`}>Yes</span>
                        <span onClick={() => setSelected(false)} className={`border rounded p-2 m-1 cursor-pointer hover:bg-slate-200 ${!selected && "bg-slate-200"}`}>No</span>
                    </div>

                    <Button variant="primary" type="button" disabled={submitting} onClick={handleSubmit}>
                        {submitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
            </div>
        </Layout>
    )
}
