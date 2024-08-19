import { Accordion, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';

// components
import UserConcept from '../components/UserConcept';
import ErrorMsg from '../components/ErrorMsg'
import SuccessMsg from '../components/SuccessMsg'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'

const Concept = () => {
    const {user} = useAuthContext()

    const [error, setError] = useState(null)
    const [success, setSuccessMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [concepts, setConcepts] = useState([])

    const [ newConcept, setNewConcept] = useState({
        tripName: '',
        description: '',
        duration: ''
    })

    const handleConceptInput = (e) => {
        const { name, value } = e.target
        setNewConcept({ ...newConcept, [name]: value })
    }

    useEffect(() => { 
        setIsLoading(true)

        const fetchConcept = async () => {
            const response = await fetch('/api/concept/getConcepts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (response.ok) {
                setIsLoading(false)
                setConcepts(json)
            }

            if (!response.ok) {
                setError(json.error)
            }
        }

        user && fetchConcept()
    }, [user])

    const postConcept = async () => {
        setError(null)
        setSuccessMsg(null)

        if (newConcept.tripName.trim() === '' || newConcept.description.trim() === '' || 
        newConcept.duration.trim() === '') {
            setError('Please fill in all the required fields')
            return 
        }

        setIsLoading(true)

        const response = await fetch('/api/concept/postConcept/', {
            method: 'POST',
            body: JSON.stringify({ concept: newConcept }),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (response.ok) {
            setIsLoading(false)
            setError(null)
            setSuccessMsg(json.msg)
            setConcepts([json.newConcept, ...concepts])
            setNewConcept({
                tripName: '',
                description: '',
                duration: ''
            })
        }

        if (!response.ok) {
            setError(json.error)
        }
    }

    const removeDeletedConcept = (id) => {
        setConcepts((prevConcept) => {
            const updatedConcept = prevConcept.filter(concept => concept._id !== id)
            return updatedConcept;
        })
    }

    return (
        <section className='concept-container'>
            <div className='create-concept-div'>
                <label className='create-concept-div-label'>Can't find a trip that's suitable for you?</label>
                <label className='create-concept-div-label'>Have an idea for the perfect trip?</label>
                <label className='create-concept-div-label'>👇 Create a concept here, and your desired trip might be fulfilled 👇</label>

                <Accordion className='concept-accordion'>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Your Concept</Accordion.Header>
                        <Accordion.Body className='concept-accordion-body'>
                            <input name='tripName' value={newConcept.tripName} 
                                    onChange={handleConceptInput} type='text' placeholder='Trip name*'/>
                            <textarea name='description' value={newConcept.description} 
                                    onChange={handleConceptInput} placeholder='Write your concept here...*'/>
                            <input name='duration' value={newConcept.duration} 
                                    onChange={handleConceptInput} type='number' min='1' placeholder='Duration*'/>

                            { error &&  <ErrorMsg msg={error}/> }
                            { success &&  <SuccessMsg msg={success}/> }

                            <button onClick={postConcept} className='concept-post-btn'>Post</button>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>

            { isLoading && 
                <div className='no-result-label'>
                    <Spinner animation="border" role="status"></Spinner>
                    <span>Loading...</span>
                </div>
            }

            { !isLoading && concepts.length > 0 &&
                <div xs={1} md={2} lg={3} className="grid-card-adventureCanvase-div concept-card-div">
                    {concepts.map((userConcept, idx) => (
                        <div key={idx}>
                            <UserConcept userConcept={userConcept} removeDeletedConcept={removeDeletedConcept} />
                        </div>
                    ))}
                </div>
            }
        </section>
    )
}

export default Concept