
const SuccessMsg = ({ msg }) => {
    return (
        <section className='SuccesMsg-container'>
            <label className='success'><i className='fa fa-check-circle'></i> {msg}</label>
        </section>
    )
}

export default SuccessMsg