function StatCard({ title, value, icon: Icon }) {

    return (
        <div className="bg-white backdrop-blur-sm  rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xl font-semibold text-gray-600">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        {value}
                    </p>
                </div>
                <div className="w-11 h-11 rounded-full bg-indigo-200 flex items-center justify-center">
                    <Icon size={23} strokeWidth={2} className="text-indigo-700"/>
                </div>
            </div>
        </div>
    );
}

export default StatCard;