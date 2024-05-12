import { Accordion } from 'react-bootstrap';
import UserConcept from '../components/UserConcept';

const userConcepts = [
    {tripName: 'Brazil Forest', durantion: '12 Days', info: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque autem eligendi itaque enim aliquam minima, sunt, nesciunt rem, sit rerum incidunt ipsum nostrum ex laboriosam quam ipsam recusandae sint. Accusamus.', like: 12},
    {tripName: 'South India', durantion: '14 Days', info: 'Laboriosam praesentium dolorem nihil, repudiandae numquam exercitationem veritatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laboriosam accusantium ipsum. Porro, magni quis excepturi nam atque ab architecto modi molestiae, est perspiciatis vel libero fuga eum reiciendis qui. Laboriosam praesentium dolorem nihil, repudiandae numquam exercitationem veritatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laboriosam accusantium ipsum. Porro, magni quis excepturi nam atque ab architecto modi molestiae, est perspiciatis vel libero fuga eum reiciendis qui.', like: 43},
    {tripName: 'Mexico', durantion: '6 Days', info: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque consequuntur sed doloribus explicabo distinctio assumenda sit fugiat quasi aut, tenetur aspernatur nemo eos illum enim nobis ducimus nam. Qui, magnam. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque quod minus quasi iure labore ipsum, dicta similique accusamus magni aliquam, recusandae impedit ut eum animi provident eius? Fugit, modi reiciendis.', like: 3}
]

const Concept = () => {
    return (
        <section className='concept-container'>
            <div className='create-concept-div'>
                <label>Can't find a trip that's suitable for you?</label>
                <label>Have an idea for the perfect trip?</label>
                <label>👇 Create a concept here, and your desired trip might be fulfilled 👇</label>

                <Accordion className='concept-accordion'>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Your Concept</Accordion.Header>
                        <Accordion.Body className='concept-accordion-body'>
                            <input type='text' placeholder='Trip name*'></input>
                            <textarea placeholder='Write your concept here...*'></textarea>
                            <input type='text' placeholder='Duration*'></input>
                            <button className='concept-post-btn'>Post</button>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>

            <div xs={1} md={2} lg={3} className="grid-card-adventureCanvase-div concept-card-div">
                {userConcepts.map((userConcept, idx) => (
                    <div key={idx}>
                        <UserConcept userConcept={userConcept} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Concept