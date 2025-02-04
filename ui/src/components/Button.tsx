import React from 'react';

const Button = ({ label, onClick, variant = 'primary' }) => {
    return <button
        type="button"
        className={"btn btn-" + variant}
        onClick={onClick}
    >
        {label}
    </button>
}

export default Button;
