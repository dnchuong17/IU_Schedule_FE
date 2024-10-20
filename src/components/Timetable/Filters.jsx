import React, { useState } from 'react';

const Filters = () => {

    return (
        <div className="h-full w-80 bg-white shadow-2xl rounded-l-lg p-6 relative">
            <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-300"
                onClick={() => console.log('Close Popup')}
            >
            </button>
        </div>
    );
};

export default Filters;