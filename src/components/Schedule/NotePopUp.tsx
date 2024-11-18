import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface NotePopUpProps {
    onClose?: () => void;
}

const NotePopUp: React.FC<NotePopUpProps> = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start z-50">
            <div className="h-full w-80 bg-white shadow-2xl rounded-l-lg p-4 relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-300"
                    onClick={handleClose}
                >
                    <AiOutlineClose size={24} />
                </button>

                <h2 className="text-3xl font-bold text-blue-600 mb-2 pt-10">
                    Create a Note
                </h2>

                <div className="mb-4">
                    <textarea
                        placeholder="Enter a note"
                        className="w-full py-4 px-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm resize-none bg-gray-50 text-gray-700 placeholder-gray-400 transition duration-300 ease-in-out"
                        rows={10}
                    />
                </div>

                <button className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out">
                    Create Note
                </button>
            </div>
        </div>
    );
};

export default NotePopUp;
