
const ErrorMsg = ({ msg }) => {
    return (
        <section className='errorMsg-container'>
            <label className='error'><i className='fa fa-times-circle'></i> {msg}</label>
        </section>
    )
}

export default ErrorMsg