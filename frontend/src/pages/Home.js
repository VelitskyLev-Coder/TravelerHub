import { useNavigate } from 'react-router-dom'

const Home = () => {

    const navigate = useNavigate()

    return (
        <section className='background-home'>
            <div className='home-container'>
                <img src='/favicon.png' alt=''/>
                <h3 className='headline-home'>Discover your next adventure with us!</h3>
                <h3 className='subheadline-home'>Explore the world with ease through our curated trips.</h3>

                <div className='home-signup-login-div'>
                    <p>
                        <b>Join us at Traveler's Hub</b> and embark on a journey of seamless and collaborative trip planning. <br/>
                        Simplify your travel experience and connect with a community of like-minded adventurers today! 🌟
                    </p>
                    
                    Enjoy all features by <button className='login-btn-home' onClick={() => navigate("/signup")}>Sign Up</button> to the website!
                    Already have account? <button className='login-btn-home' onClick={() => navigate("/login")}>Log In</button> here. <br/><br/>
                </div>

                <h4 className='feature-title'>Here's What You Can Do:</h4>
                <label><b>Search a Trip:</b> Explore organized trips and see all detailed information<br/> about trip plans, including activities, locations, times, and costs.</label>
                <label><b>Register for Trips:</b> View available trip plans, check total costs, <br/>and register to participate in trips once they are open for registration.</label>
                <label><b>Engage in Forums:</b> Discuss travel ideas, provide feedback, <br/>and share experiences with other users.</label>
                <label><b>Participate in Trip Planning:</b> Contribute ideas that can evolve into detailed <br/>travel experiences, potentially becoming part of new trips.</label>

                <a href='/aboutus'>For More Features</a>
            </div>
        </section>
    )
}

export default Home