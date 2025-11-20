import React, { useEffect, useState } from "react";
import { User, Calendar, FileText, Users, Activity, Plus, Search, Bell, Settings, LogOut } from "lucide-react";

// Mock user data - in real app this would come from Firebase/auth
const mockUsers = {
  doctor: {
    id: "doc_001",
    email: "dr.smith@mediverse.com",
    name: "Dr. Sarah Smith",
    role: "doctor",
    specialty: "Cardiology",
    avatar: "👩‍⚕️"
  },
  patient: {
    id: "pat_001", 
    email: "john.doe@email.com",
    name: "John Doe",
    role: "patient",
    age: 32,
    avatar: "👨"
  }
};

// Mock data
const mockAppointments = [
  { id: 1, patient: "John Doe", doctor: "Dr. Smith", date: "2024-09-10", time: "10:00 AM", status: "confirmed", type: "Consultation" },
  { id: 2, patient: "Jane Wilson", doctor: "Dr. Smith", date: "2024-09-10", time: "2:00 PM", status: "pending", type: "Follow-up" },
  { id: 3, patient: "Mike Johnson", doctor: "Dr. Smith", date: "2024-09-11", time: "11:00 AM", status: "completed", type: "Check-up" },
];

const mockPatients = [
  { id: 1, name: "John Doe", age: 32, condition: "Hypertension", lastVisit: "2024-08-15" },
  { id: 2, name: "Jane Wilson", age: 45, condition: "Diabetes", lastVisit: "2024-08-20" },
  { id: 3, name: "Mike Johnson", age: 28, condition: "Asthma", lastVisit: "2024-08-25" },
];

const mockRecords = [
  { id: 1, type: "Lab Result", date: "2024-08-15", title: "Blood Test Results", doctor: "Dr. Smith" },
  { id: 2, type: "Prescription", date: "2024-08-10", title: "Medication Refill", doctor: "Dr. Smith" },
  { id: 3, type: "Imaging", date: "2024-07-25", title: "Chest X-Ray", doctor: "Dr. Wilson" },
];

function DoctorDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats] = useState({
    todayAppointments: 5,
    totalPatients: 124,
    pendingReports: 8,
    completedToday: 3
  });

  const renderOverview = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Today's Appointments</p>
              <p className="text-3xl font-bold text-blue-900">{stats.todayAppointments}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold text-green-900">{stats.totalPatients}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Pending Reports</p>
              <p className="text-3xl font-bold text-orange-900">{stats.pendingReports}</p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Completed Today</p>
              <p className="text-3xl font-bold text-purple-900">{stats.completedToday}</p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Appointments</h3>
          <div className="space-y-3">
            {mockAppointments.slice(0, 3).map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{apt.patient}</p>
                  <p className="text-sm text-gray-600">{apt.date} at {apt.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Patients</h3>
          <div className="space-y-3">
            {mockPatients.slice(0, 3).map(patient => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-gray-600">{patient.condition}</p>
                </div>
                <p className="text-sm text-gray-500">Last: {patient.lastVisit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Appointments</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Appointment
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {mockAppointments.map(apt => (
            <div key={apt.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{apt.patient}</h4>
                  <p className="text-gray-600">{apt.type}</p>
                  <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Patient Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Patient
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid gap-4">
          {mockPatients.map(patient => (
            <div key={patient.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{patient.name}</h4>
                  <p className="text-gray-600">Age: {patient.age} | Condition: {patient.condition}</p>
                  <p className="text-sm text-gray-500">Last Visit: {patient.lastVisit}</p>
                </div>
                <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded">
                  View Records
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">Mediverse</h1>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Doctor Portal</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
            <Settings className="h-5 w-5 text-gray-600 cursor-pointer" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.specialty}</p>
              </div>
              <span className="text-2xl">{user.avatar}</span>
              <button onClick={onLogout} className="text-gray-600 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          <aside className="w-64 bg-white rounded-lg border p-4">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'patients', label: 'Patients', icon: Users },
                { id: 'records', label: 'Medical Records', icon: FileText },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === item.id 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'appointments' && renderAppointments()}
            {activeTab === 'patients' && renderPatients()}
            {activeTab === 'records' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
                <p className="text-gray-600">Medical records management coming soon...</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function PatientDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");

  const renderOverview = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Next Appointment</p>
              <p className="text-lg font-semibold text-green-900">Sep 10, 10:00 AM</p>
              <p className="text-sm text-green-700">Dr. Smith</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Medical Records</p>
              <p className="text-3xl font-bold text-blue-900">12</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Health Score</p>
              <p className="text-3xl font-bold text-purple-900">85</p>
              <p className="text-sm text-purple-700">Good</p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {mockAppointments.filter(apt => apt.patient === "John Doe").map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Dr. {apt.doctor.split(' ')[1]}</p>
                  <p className="text-sm text-gray-600">{apt.date} at {apt.time}</p>
                  <p className="text-sm text-gray-500">{apt.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Book New Appointment
          </button>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Records</h3>
          <div className="space-y-3">
            {mockRecords.slice(0, 3).map(record => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{record.title}</p>
                  <p className="text-sm text-gray-600">{record.type}</p>
                  <p className="text-sm text-gray-500">{record.date}</p>
                </div>
                <button className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-sm">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Appointments</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Book Appointment
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {mockAppointments.filter(apt => apt.patient === "John Doe").map(apt => (
            <div key={apt.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">Dr. {apt.doctor.split(' ')[1]}</h4>
                  <p className="text-gray-600">{apt.type}</p>
                  <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {apt.status}
                  </span>
                  {apt.status === 'pending' && (
                    <button className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecords = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Medical Records</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {mockRecords.map(record => (
            <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{record.title}</h4>
                  <p className="text-gray-600">{record.type}</p>
                  <p className="text-sm text-gray-500">By {record.doctor} • {record.date}</p>
                </div>
                <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">Mediverse</h1>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Patient Portal</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
            <Settings className="h-5 w-5 text-gray-600 cursor-pointer" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">Patient ID: {user.id}</p>
              </div>
              <span className="text-2xl">{user.avatar}</span>
              <button onClick={onLogout} className="text-gray-600 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          <aside className="w-64 bg-white rounded-lg border p-4">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'appointments', label: 'My Appointments', icon: Calendar },
                { id: 'records', label: 'Medical Records', icon: FileText },
                { id: 'profile', label: 'Profile', icon: User },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === item.id 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'appointments' && renderAppointments()}
            {activeTab === 'records' && renderRecords()}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={user.name} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={user.email} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input type="number" value={user.age} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);

  const handleLogin = (type) => {
    setUserType(type);
    setCurrentUser(mockUsers[type]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserType(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mediverse</h1>
            <p className="text-gray-600">Choose your portal to continue</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => handleLogin('doctor')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
            >
              <span className="text-2xl">👩‍⚕️</span>
              <div className="text-left">
                <div className="font-semibold">Doctor Portal</div>
                <div className="text-sm opacity-90">Manage patients & appointments</div>
              </div>
            </button>
            
            <button
              onClick={() => handleLogin('patient')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
            >
              <span className="text-2xl">👨</span>
              <div className="text-left">
                <div className="font-semibold">Patient Portal</div>
                <div className="text-sm opacity-90">View records & book appointments</div>
              </div>
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Demo version - Click any portal to explore
            </p>
          </div>
        </div>
      </div>
    );
  }

  return userType === 'doctor' ? 
    <DoctorDashboard user={currentUser} onLogout={handleLogout} /> :
    <PatientDashboard user={currentUser} onLogout={handleLogout} />;
}