import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { api, ApiError } from '../utils/api';
import { authUtils } from '../utils/auth';
import { Note, User } from '../types';

interface AccordionNoteProps {
  note: Note;
  onDelete: (noteId: string) => void;
  defaultOpen?: boolean;
}

const AccordionNote: React.FC<AccordionNoteProps> = ({ note, onDelete, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-in slide-in-from-top-2 fade-in duration-500">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
      >
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 transition-colors duration-200">{note.title}</h4>
          <p className="text-xs text-gray-400 mt-1 transition-colors duration-200">
            {new Date(note.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200 rounded-full hover:bg-red-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed pt-3 animate-in fade-in slide-in-from-top-1 duration-300">
            {note.content}
          </p>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    const currentUser = authUtils.getUser();
    const token = authUtils.getToken();
    
    if (!currentUser || !token) {
      navigate('/signin');
      return;
    }
    
    setUser(currentUser);
    loadNotes();
  }, [navigate]);

  const loadNotes = async () => {
    const token = authUtils.getToken();
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      setLoading(true);
      const notesResponse = await api.getNotes(token);
      console.log('Notes API response:', notesResponse);
      
      // Handle different response formats
      let notesArray = [];
      if (Array.isArray(notesResponse)) {
        notesArray = notesResponse;
      } else if (notesResponse && Array.isArray(notesResponse.notes)) {
        notesArray = notesResponse.notes;
      } else if (notesResponse && notesResponse.data && Array.isArray(notesResponse.data)) {
        notesArray = notesResponse.data;
      }
      
      console.log('Processed notes array:', notesArray);
      setNotes(notesArray);
    } catch (error) {
      console.error('Load notes error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError('Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      }
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    authUtils.logout();
    toast.success('Signed out successfully!');
    navigate('/signin');
  };

  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    const token = authUtils.getToken();
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      setCreateLoading(true);
      const response = await api.createNote(token, newNote);
      
      // Handle different response formats for created note
      const createdNote = response.note || response.data || response;
      
      // Add the new note to the existing notes array instead of reloading
      setNotes(prevNotes => [createdNote, ...prevNotes]);
      
      setNewNote({ title: '', content: '' });
      setShowCreateModal(false);
      toast.success('Note created successfully!');
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError('Failed to create note');
        toast.error('Failed to create note');
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const token = authUtils.getToken();
    if (!token) return;

    try {
      await api.deleteNote(token, noteId);
      
      // Remove the note from the existing notes array instead of reloading
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      
      toast.success('Note deleted successfully!');
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError('Failed to delete note');
        toast.error('Failed to delete note');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Logo />
              <h1 className="ml-4 text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="text-blue-600 hover:text-blue-500 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 transform transition-all duration-300 hover:shadow-md animate-in slide-in-from-top-1 fade-in duration-500">
          <h2 className="text-xl font-bold text-gray-900 mb-2 animate-in slide-in-from-left-2 fade-in duration-700">
            Welcome, {user?.name} !
          </h2>
          <p className="text-gray-600 animate-in slide-in-from-left-2 fade-in duration-700 delay-150">Email: {user?.email}</p>
        </div>

        {/* Create Note Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-full py-4 text-lg font-medium transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Create Note
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Notes Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          
          {notes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-gray-500">No notes yet. Create your first note!</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <div
                    key={note.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-in slide-in-from-bottom-2 fade-in duration-500"
                  >
                    <AccordionNote 
                      note={note} 
                      onDelete={handleDeleteNote}
                      defaultOpen={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg max-w-md w-full p-6 transform animate-in zoom-in-95 slide-in-from-bottom-4 fade-in duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Note</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); handleCreateNote(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter note title"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  placeholder="Enter note content"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  loading={createLoading}
                  disabled={createLoading}
                  className="flex-1"
                >
                  Create Note
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewNote({ title: '', content: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
