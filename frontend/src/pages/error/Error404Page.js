

const Error404 = ({goBackUrl,name}) => {
    return (<>
        <div className="max-auto container mt-10 p-4">
            <div className="bg-red-200 p-5 py-6 w-full max-w-md mx-auto">
                <div className="p-3 text-center text-red-500">
                    Opps!! The page/resources you are looking for does not exist!!!
                    <p>
                        Go back to{" "}
                        <a  href={goBackUrl} className="text-blue-500 underline">
                            {name}
                        </a>
                    </p>
                </div>
            </div> 
    </div>
    </>)
}
export default Error404
