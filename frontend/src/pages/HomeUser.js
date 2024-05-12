import AdventureCanvase from '../components/AdventureCanvas'

const adventureCanvases = [
    {images: ['./images/image-greece-1.jpg', './images/image-greece-2.jpg', './images/image-greece-3.jpg'], info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, ipsa! Autem ex minima quod maiores? Distinctio consequatur mollitia dolorem nam nemo veritatis repellendus velit voluptates reiciendis quaerat, adipisci dicta voluptatem!", tripName: "Greece", durantion: "4 Days", cost: '1450$'},
    {images: ['./images/image-cyprus-1.jpg', './images/image-cyprus-2.jpg'], info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id similique, numquam reprehenderit explicabo officia, omnis molestias, placeat ratione quam ab aspernatur atque nihil facere maiores magnam laboriosam iusto voluptas eius! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil sed voluptatum soluta iste voluptatem suscipit, dolores, vel omnis ea fuga repellendus voluptatibus accusantium unde hic quidem, aliquid quae facilis dolor.", tripName: "Cyprus", durantion: "5 Days",  cost: '560$'},
    {images: ['./images/image-usa-1.jpg', './images/image-usa-2.jpg', './images/image-usa-3.jpg'], info: `Welcome to our exciting trip to Charleston, South Carolina! Over the next five days, we will immerse ourselves in the rich history, 
    vibrant culture, and stunning natural beauty of this charming city. Our journey begins with a leisurely exploration of historic downtown 
    Charleston, where we will visit iconic sites such as The Battery, White Point Garden, and Rainbow Row. We will also indulge in delicious 
    Lowcountry cuisine at local eateries and explore the bustling Charleston City Market.`, tripName: "Charleston, USA", durantion: "5 Days",  cost: '3320$'},
    {images: ['./images/image-colombia-1.jpg', './images/image-colombia-2.jpg', './images/image-colombia-3.jpg'], info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium ducimus odio atque, veritatis ipsum nostrum, tempore quam fuga, aperiam eveniet amet quo exercitationem at sit recusandae sunt libero! Temporibus, voluptatibus. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia totam, eaque magnam, magni a aliquid.", tripName: "Colombia", durantion: "3 Days",  cost: '2030$'},
    {images: ['./images/image-greece-1.jpg', './images/image-greece-2.jpg', './images/image-greece-3.jpg'], info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, ipsa! Autem ex minima quod maiores? Distinctio consequatur mollitia dolorem nam nemo veritatis repellendus velit voluptates reiciendis quaerat, adipisci dicta voluptatem!", tripName: "Greece", durantion: "4 Days", cost: '1450$'},
    {images: ['./images/image-cyprus-1.jpg', './images/image-cyprus-2.jpg'], info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id similique, numquam reprehenderit explicabo officia, omnis molestias, placeat ratione quam ab aspernatur atque nihil facere maiores magnam laboriosam iusto voluptas eius! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil sed voluptatum soluta iste voluptatem suscipit, dolores, vel omnis ea fuga repellendus voluptatibus accusantium unde hic quidem, aliquid quae facilis dolor.", tripName: "Cyprus", durantion: "5 Days",  cost: '560$'},
    {images: ['./images/image-usa-1.jpg', './images/image-usa-2.jpg', './images/image-usa-3.jpg'], info: `Welcome to our exciting trip to Charleston, South Carolina! Over the next five days, we will immerse ourselves in the rich history, 
    vibrant culture, and stunning natural beauty of this charming city. Our journey begins with a leisurely exploration of historic downtown 
    Charleston, where we will visit iconic sites such as The Battery, White Point Garden, and Rainbow Row. We will also indulge in delicious 
    Lowcountry cuisine at local eateries and explore the bustling Charleston City Market.`, tripName: "Charleston, USA", durantion: "5 Days",  cost: '3320$'},
    {images: ['./images/image-colombia-1.jpg', './images/image-colombia-2.jpg', './images/image-colombia-3.jpg'], info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium ducimus odio atque, veritatis ipsum nostrum, tempore quam fuga, aperiam eveniet amet quo exercitationem at sit recusandae sunt libero! Temporibus, voluptatibus. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia totam, eaque magnam, magni a aliquid.", tripName: "Colombia", durantion: "3 Days",  cost: '2030$'},
    {images: ['./images/image-greece-1.jpg', './images/image-greece-2.jpg', './images/image-greece-3.jpg'], info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, ipsa! Autem ex minima quod maiores? Distinctio consequatur mollitia dolorem nam nemo veritatis repellendus velit voluptates reiciendis quaerat, adipisci dicta voluptatem!", tripName: "Greece", durantion: "4 Days", cost: '1450$'}
    ]

const HomeUser = () => {
    return(
        <section className='background'>
            <div className='search-div'>
                <label className='title-search'><b>Where Will Your Adventure Begin?</b></label>
                <input type='text' placeholder='Destination'></input>
                <label className='label-start-date'>Start Date:</label>
                <input type='date' placeholder='Start Date'></input>
                <label className='label-end-date'>End Date:</label>
                <input type='date' placeholder='End Date'></input>
                <button>Search</button>
            </div>
            
            <div xs={1} md={2} lg={3} className="grid-card-adventureCanvase-div">
                {adventureCanvases.map((adventureCanvase, idx) => (
                    <div key={idx}>
                        <AdventureCanvase adventureCanvase={adventureCanvase} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default HomeUser