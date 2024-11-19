// 'use client';

// import moment from 'moment';
// import { Calendar as BigCalendar, CalendarProps, momentLocalizer } from 'react-big-calendar';

// const localizer = momentLocalizer(moment);

// export default function CalentarTest(props: Omit<CalendarProps, 'localizer'>) {
//   return <BigCalendar localizer={localizer} {...props} />;
// }

import { DateSelectArg, EventApi, EventClickArg, formatDate } from '@fullcalendar/core';
import React, { useState } from 'react';

function CalendarContainer() {
  const [currentEvents, setCurrentEvents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle('');
  };

  const handleEventClick = (selected: EventClickArg) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'?`)) {
      selected.event.remove();
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();
      const newEvent = {
        id: `${selectedDate?.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate?.start,
        end: selectedDate?.end,
        allDay: selectedDate?.allDay,
      };
      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  return (
    <div className="flex w-full px-10 justify-start items-start gap-8">
      <div className="w-3/12"></div>
      <div className="py-10 text-2xl font-extrabold px-7">Calendar Events</div>
      <ul className="space-y-4">
        {currentEvents.length <= 0 && <div className="italic text-center text-gray-400">No events Preset</div>};
        {currentEvents.length > 0 &&
          currentEvents.map((event: EventApi) => (
            <li className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800" key={event.id}>
              {event.title} <br />
              <label className="text-slate-950">
                {formatDate(event.start!, { year: 'numeric', month: 'long', day: 'numeric' })}
              </label>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default CalendarContainer;
