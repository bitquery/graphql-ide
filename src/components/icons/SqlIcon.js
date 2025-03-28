import React from 'react';

function SqlIcon(props) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M12 2C6.48 2 2 3.79 2 6V18C2 20.21 6.48 22 12 22C17.52 22 22 20.21 22 18V6C22 3.79 17.52 2 12 2ZM12 4C16.97 4 20 5.79 20 6C20 6.21 16.97 8 12 8C7.03 8 4 6.21 4 6C4 5.79 7.03 4 12 4ZM4 9.14C5.79 10.1 8.71 10.73 12 10.73C15.29 10.73 18.21 10.1 20 9.14V12.05C18.21 13.01 15.29 13.64 12 13.64C8.71 13.64 5.79 13.01 4 12.05V9.14ZM4 15.19C5.79 16.15 8.71 16.78 12 16.78C15.29 16.78 18.21 16.15 20 15.19V18C20 18.21 16.97 20 12 20C7.03 20 4 18.21 4 18V15.19Z"
                fill="#3f3f46"
            />
        </svg>
    );
}

export default SqlIcon;
