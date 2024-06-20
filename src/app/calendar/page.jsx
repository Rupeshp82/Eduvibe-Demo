"use client";

import React, { useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: new Date(), end: new Date() });

  const handleAddEvent = () => {
    setEvents([...events, newEvent]);
    setNewEvent({ title: '', start: new Date(), end: new Date() });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Academic Calendar</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="p-2 border rounded-lg w-full mb-2"
          />
          <DatePicker
            selected={newEvent.start}
            onChange={(start) => setNewEvent({ ...newEvent, start })}
            showTimeSelect
            dateFormat="Pp"
            className="p-2 border rounded-lg w-full mb-2"
            placeholderText="Start Date and Time"
          />
          <DatePicker
            selected={newEvent.end}
            onChange={(end) => setNewEvent({ ...newEvent, end })}
            showTimeSelect
            dateFormat="Pp"
            className="p-2 border rounded-lg w-full mb-2"
            placeholderText="End Date and Time"
          />
          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 w-full"
          >
            Add Event
          </button>
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
};

export default MyCalendar;
