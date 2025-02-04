import React from 'react';

const Field = ({ name, label, children, help }) => {
    return <div className="col">
        <label htmlFor={name} className="form-label">{label}</label>
        {children}
        <div id={name + '-help'} className="form-text">{help}</div>
    </div>
}

export default Field;
