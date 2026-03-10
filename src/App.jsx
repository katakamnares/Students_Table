import React, { useState } from 'react';
import { Plus, Download, Edit2, Trash2, Users, Search, AlertCircle } from 'lucide-react';
import StudentModal from './components/StudentModal';
import DeleteDialog from './components/DeleteDialog';
import { exportToExcel } from './utils/exportUtils';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function App() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Data States for Modal and Deletion
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  
  // Loading Simulation State
  const [isLoading, setIsLoading] = useState(false);

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const simulateLoading = (ms = 800) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const handleAddClick = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveStudent = async (studentData) => {
    setIsLoading(true);
    await simulateLoading();
    
    if (selectedStudent) {
      // Edit mode
      setStudents(prev => 
        prev.map(s => s.id === selectedStudent.id ? { ...studentData, id: s.id } : s)
      );
    } else {
      // Add mode - generate simple ID based on date
      const newStudent = { ...studentData, id: Date.now().toString() };
      setStudents(prev => [...prev, newStudent]);
    }
    
    setIsLoading(false);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    await simulateLoading();
    
    setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
    
    setIsLoading(false);
    setIsDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleExport = () => {
    exportToExcel(filteredStudents, 'Students_List.xlsx');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Students Directory</h1>
              <p className="text-slate-500 text-sm mt-1">Manage your student records efficiently</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleExport}
              disabled={students.length === 0}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
              Export
            </button>
            <button
              onClick={handleAddClick}
              className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-300"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm"
              />
            </div>
            
            <div className="text-sm text-slate-500 w-full sm:w-auto text-right">
              Showing <span className="font-semibold text-slate-700">{filteredStudents.length}</span> students
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Age</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shadow-inner">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {student.age} yrs
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                          <button
                            onClick={() => handleEditClick(student)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                            aria-label="Edit student"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(student)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                            aria-label="Delete student"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-32 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                          {searchQuery ? (
                             <Search className="w-6 h-6 text-slate-400" />
                          ) : (
                             <Users className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <p className="text-lg font-medium text-slate-700 mb-1">
                          {searchQuery ? 'No matching students' : 'No students found'}
                        </p>
                        <p className="text-slate-400 max-w-sm mb-6">
                          {searchQuery 
                            ? `We couldn't find any students matching "${searchQuery}".` 
                            : "Get started by adding your first student to the directory."}
                        </p>
                        {!searchQuery && (
                          <button
                            onClick={handleAddClick}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                          >
                            + Add New Student
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        onSave={handleSaveStudent}
        student={selectedStudent}
        isLoading={isLoading}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => !isLoading && setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        studentName={studentToDelete?.name}
        isLoading={isLoading}
      />

    </div>
  );
}

export default App;
