import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useEffect, useState } from 'react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

export default function MenteeFeedbackPage() {
    const {id} = useParams()
    const [rating, setRating] = useState(null)
    const [comment, setComment] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmittting] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()

        if(!rating){
            setError("Please select a rating")
            return
        }
        try {
            setSubmittting(true)
            const res = await api.post(`/sessions/feedback/mentee/${id}`, {rating, comment})
            console.log(res.data)
            setSuccess('Feedback submitted successfully')
            setComment('')
            setTimeout(() => {
                navigate("/sessions")
            }, 1000)
        } catch (error) {
            console.log(error)
            setError(error.response?.data?.msg)
        } finally{
            setSubmittting(false)
        }
        
    }

    return (
        <Layout>
            {success && (<Alert type="success" message={success}/>)}
            {error && (<Alert type="error" message={error ||"Something went wrong"}/>)}
            <div className='max-w-3xl mx-auto bg-white'>
                <form className="space-y-4 border px-10 py-7 rounded-xl" onSubmit={handleSubmit}>
                    <h1 className='text-2xl mb-5 font-bold'>Feedback</h1>

                    <h3 className='mb-4'>How much would you like to rate the mentor?</h3>
                    <div>
                        {Array(10).fill().map((_, index) => (
                            // <button key={index} onClick={() => setRating(index+1)}>{index+1}</button>
                            <span 
                                key={index}
                                onClick={() => setRating(index+1)}
                                className={`border p-3 rounded m-1 cursor-pointer hover:bg-slate-200 ${rating===index+1 && "bg-slate-200"}`}>{index+1}</span>
                        ))}
                    </div>
                    
                    <div className='mt-4'>
                        <label htmlFor='feedback'>Comment:</label>
                        <br/>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows='8' cols='80' className='border p-3' required></textarea>
                    </div>

                    <Button variant="primary" type="button" disabled={submitting} onClick={handleSubmit}>
                        {submitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
            </div>
        </Layout>
    )
}
