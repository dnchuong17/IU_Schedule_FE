import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Api } from '../../utils/api.ts'; // Import the API class

interface NotePopUpProps {
    onClose?: () => void;
    courseValueId?: number;  // Ensure this is required or optional as per your needs
    existingNote?: string;  // Optional prop to pass existing note content
}

const NotePopUp: React.FC<NotePopUpProps> = ({ onClose, courseValueId, existingNote }) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [content, setContent] = useState<string>(''); // Note content
    const [loading, setLoading] = useState<boolean>(false); // Loading spinner state
    const [error, setError] = useState<string>(''); // Error message state

    const api = new Api();

    // Populate content if an existing note is provided
    useEffect(() => {
        if (existingNote) {
            setContent(existingNote);
        }
    }, [existingNote]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    const handleSaveNote = async () => {
        if (!content.trim()) {
            setError('Note content cannot be empty.');
            return;
        }

        setLoading(true);
        setError(''); // Reset error state before making API call

        try {
            if (existingNote) {
                // Update existing note
                const response = await api.updateNote(content, courseValueId);  // Pass courseValueId here
                console.log('Note updated successfully:', response.message);
            } else {
                // Create a new note
                const response = await api.createNote(content, courseValueId);  // Pass courseValueId here
                console.log('Note created successfully:', response.message);
            }
            handleClose(); // Close popup after successful operation
        } catch (err) {
            setError('Failed to save the note. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl relative">
                {/* Close Button */}
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-300"
                    onClick={handleClose}
                >
                    <AiOutlineClose size={24} />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
                    {existingNote ? 'Edit Note' : 'Create a Note'}
                </h2>

                {/* Note Input */}
                <div className="mb-4">
                    <textarea
                        placeholder="Enter your note here..."
                        className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm resize-none bg-gray-50 text-gray-700 placeholder-gray-400 transition duration-300 ease-in-out"
                        rows={8}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* Save Button */}
                <button
                    onClick={handleSaveNote}
                    className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : existingNote ? 'Update Note' : 'Create Note'}
                </button>
            </div>
        </div>
    );
};

export default NotePopUp;
