const DashboardPage = () => {
    return (
        <div className="px-4 flex w-full flex-col justify-start items-start">
            <h1 className="font-extrabold text-xl">Static Navigation</h1>
            <ol className="flex items-center space-x-2 mb-4">
                <li className="font-extrabold text-md"><a className='text-blue-600 underline' href="/admin">Dashboard</a></li>
                <li className="font-extrabold text-xl">Static Navigation</li>
            </ol>
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <p className="mb-0">
                    This page is an example of using static navigation. By removing the
                    <code className="text-blue-600">.sb-nav-fixed</code> className from the <code className="text-blue-600">body</code>, the top navigation and side navigation will become static on scroll. Scroll down this page to see an example.
                </p>
            </div>
            {/* Form starts here */}
            <form className="w-full">
                <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                    {/* Form content */}
                </div>
            </form>
            {/* Form ends here */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <p className="mb-0">When scrolling, the navigation stays at the top of the page. This is the end of the static navigation demo.</p>
            </div>
        </div>
    );
}

export default DashboardPage;



