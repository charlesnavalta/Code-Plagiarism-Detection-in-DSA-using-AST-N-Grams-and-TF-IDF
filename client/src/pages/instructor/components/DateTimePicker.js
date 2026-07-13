import React from 'react';
import './DateTimePicker.css';

const DateTimePicker = ({ label, name, value, defaultValue, onChange, required }) => {
    return (
        <div className="datetime-picker-group">
            {label && <label>{label}</label>}
            <div className="datetime-input-wrapper">
                <input
                    type="datetime-local"
                    name={name}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    className="styled-datetime-input"
                    required={required}
                    // This natively forces the mini-calendar to pop open when the input is clicked anywhere
                    onClick={(e) => e.target.showPicker && e.target.showPicker()} 
                />
            </div>
        </div>
    );
};

export default DateTimePicker;