export default function Loading() {
    return (
        <div className="flex h-screen justify-center items-center">
            <div className="text-center">
                <p className="text-2xl font-semibold">Loading...</p>
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        </div>
    )
}