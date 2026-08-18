import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateTimePicker.css';

const DateTimePicker = ({ label, name, value, onChange, required }) => {
    // 1. Internal State: Allows the picker to work even if the parent doesn't provide an onChange
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);

    // 2. Sync State: If a parent (like EditAssignment) passes a new value, update the calendar
    useEffect(() => {
        if (value) {
            setSelectedDate(new Date(value));
        } else {
            setSelectedDate(null);
        }
    }, [value]);

    const handleDateChange = (date) => {
        // Update the UI immediately
        setSelectedDate(date); 
        
        // Format the date for the backend (YYYY-MM-DDThh:mm)
        let formattedDate = '';
        if (date) {
            const offset = date.getTimezoneOffset() * 60000;
            formattedDate = (new Date(date - offset)).toISOString().slice(0, 16);
        }

        // 3. Optional Callback: Only trigger onChange if the parent component actually passed one!
        if (onChange) {
            onChange({ target: { name, value: formattedDate } });
        }
    };

    // Calculate the hidden string value for native form submissions
    let hiddenInputValue = '';
    if (selectedDate) {
        const offset = selectedDate.getTimezoneOffset() * 60000;
        hiddenInputValue = (new Date(selectedDate - offset)).toISOString().slice(0, 16);
    }

    // Calculate minTime and maxTime so past hours/minutes cannot be picked if today is selected
    const now = new Date();
    const isToday = selectedDate && selectedDate.toDateString() === now.toDateString();
    
    // If today is selected, minTime is the current time; if future date, allow 00:00 - 23:59
    const minTime = isToday ? now : new Date(new Date().setHours(0, 0, 0, 0));
    const maxTime = new Date(new Date().setHours(23, 59, 59, 999));

    return (
        <div className="datetime-picker-group">
            {label && <label>{label}</label>}
            <div className="datetime-input-wrapper">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="styled-datetime-input custom-react-datepicker"
                    required={required && !selectedDate} // Only require the visible input if no date is picked
                    placeholderText="Select deadline..."
                    minDate={now}
                    minTime={minTime}
                    maxTime={maxTime}
                />
                
                {/* 🌟 THE MAGIC: This hidden input ensures standard form submission (e.target.deadline.value) still works perfectly! */}
                <input type="hidden" name={name} value={hiddenInputValue} />
            </div>
        </div>
    );
};

export default DateTimePicker;