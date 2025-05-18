"use client"

import { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';

// Define types for our application
interface Student {
  id: number;
  name: string;
  marks: number[];
}

const StudentMarksTracker = () => {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Student 1', marks: [] },
    { id: 2, name: 'Student 2', marks: [] },
    { id: 3, name: 'Student 3', marks: [] },
  ]);
  
  const [editing, setEditing] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Generate a random mark between 60 and 100
  const generateMark = (): number => Math.floor(Math.random() * 41) + 60;

  // Handle student name click to add mark
  const handleAddMark = (studentId: number): void => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          marks: [...student.marks, generateMark()]
        };
      }
      return student;
    }));
  };

  // Start editing a student name
  const startEditing = (student: Student): void => {
    setEditing(student.id);
    setEditValue(student.name);
  };

  // Save edited student name
  const saveEdit = (): void => {
    if (editValue.trim() === '') return;
    
    setStudents(students.map(student => {
      if (student.id === editing) {
        return {
          ...student,
          name: editValue
        };
      }
      return student;
    }));
    
    setEditing(null);
  };

  // Handle keyboard events for editing
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditing(null);
    }
  };

  // Calculate total marks for a student
  const calculateTotal = (marks: number[]): number => {
    return marks.reduce((sum, mark) => sum + mark, 0);
  };

  // Find maximum number of marks any student has
  const maxMarksCount = Math.max(...students.map(student => student.marks.length), 0);
  
  // Create array of assessment numbers based on max marks count
  const assessments = Array.from({ length: maxMarksCount }, (_, i) => i + 1);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Student Marks Tracker</h1>
      
      {/* Student Names Row */}
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        {students.map(student => (
          <div 
            key={student.id} 
            className="flex-shrink-0 min-w-32 text-center"
          >
            {editing === student.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border border-gray-300 rounded text-center"
                autoFocus
              />
            ) : (
              <div 
                className="p-2 bg-blue-100 rounded cursor-pointer hover:bg-blue-200 transition duration-200"
                onClick={() => handleAddMark(student.id)}
                onDoubleClick={() => startEditing(student)}
              >
                {student.name}
                <div className="text-xs text-gray-500 mt-1">(Click to add mark, double-click to edit)</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Marks Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Assessment</th>
              {students.map(student => (
                <th key={student.id} className="border p-2 min-w-32">{student.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="border p-2 font-medium">Assessment {assessment}</td>
                {students.map(student => (
                  <td key={student.id} className="border p-2 text-center">
                    {student.marks[index] !== undefined ? student.marks[index] : '-'}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-blue-50 font-bold">
              <td className="border p-2">Total Marks</td>
              {students.map(student => (
                <td key={student.id} className="border p-2 text-center">
                  {student.marks.length > 0 ? calculateTotal(student.marks) : '-'}
                </td>
              ))}
            </tr>
            {/* Average Row */}
            <tr className="bg-green-50">
              <td className="border p-2 font-medium">Average</td>
              {students.map(student => (
                <td key={student.id} className="border p-2 text-center">
                  {student.marks.length > 0 
                    ? (calculateTotal(student.marks) / student.marks.length).toFixed(1) 
                    : '-'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => {
            const newId = Math.max(...students.map(s => s.id), 0) + 1;
            setStudents([...students, { id: newId, name: `Student ${newId}`, marks: [] }]);
          }}
        >
          Add Student
        </button>
      </div>
    </div>
  );
};

export default StudentMarksTracker;