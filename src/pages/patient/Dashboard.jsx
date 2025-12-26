// frontend/src/pages/patient/Dashboard.jsx
import { useAuth } from '../../context/AuthContext';
import MainNavbar from '../../components/navbar/MainNavbar';

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Patient Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
            <div className="space-y-4">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">Book Appointment</h3>
                <p className="text-gray-600">Schedule a new appointment with a doctor</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">My Appointments</h3>
                <p className="text-gray-600">View and manage your appointments</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">Medical History</h3>
                <p className="text-gray-600">Access your medical records</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;