const PatientNavbar = () => {
    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-xl font-bold">Patient Portal</h1>
                <div>
                    <a href="/patient/dashboard" className="text-white mx-2">Dashboard</a>
                    <a href="/patient/appointments" className="text-white mx-2">Appointments</a>
                    <a href="/patient/profile" className="text-white mx-2">Profile</a>
                </div>
            </div>
        </nav>
    );
};
export default PatientNavbar;