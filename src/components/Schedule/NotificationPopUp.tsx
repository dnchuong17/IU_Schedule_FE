import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";

type NotificationPopUpProps = {};

const NotificationPopUp: React.FC<NotificationPopUpProps> = () => {
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const navigate = useNavigate();

    const onClose = (): void => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-md p-4 w-80 relative">
            <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={onClose}
            >
                <AiOutlineClose size={24} />
            </button>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Notification</h4>
            <p className="text-gray-700">You have a new task due soon. Check your deadlines!</p>
            <button
                onClick={() => navigate("/deadlinePopUp")}
                className="w-full bg-blue-600 text-white py-2 rounded-md mt-3 hover:bg-blue-700">
                View Details
            </button>
        </div>
    );
};

export default NotificationPopUp;
