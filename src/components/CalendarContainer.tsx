'use client';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

function CalendarContainer() {
  const [currentEvents, setCurrentEvents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('events', JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

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
    <>
      <div className="flex w-full px-10 justify-start items-start gap-8">
        {/* TODO este bloque de codigo agrega una barra lateral para ver una lista de eventos */}
        {/* <div className="w-3/12">
          <div className="py-10 text-2xl font-extrabold px-7">Calendar Events</div>
          <ul className="space-y-4">
            {currentEvents.length <= 0 && <div className="italic text-center text-gray-400">No events Preset</div>}
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
        </div> */}
        <div className="w-full mt-8">
          <FullCalendar
            height={'90vh'}
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay, timeGrid',
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            select={handleDateClick}
            eventsSet={setCurrentEvents}
            eventClick={handleEventClick}
            initialEvents={typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('events') || '[]') : []}
            locale={esLocale}
            dayMaxEventRows={true}
          />
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center mb-4">Agregar un evento</DialogTitle>
            <form className="mb-4 flex flex-col items-center gap-4" onSubmit={handleAddEvent}>
              <input
                type="text"
                placeholder="Titulo del evento"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
                className="border border-gray-200 p-3 rounded-md text-lg w-full"
              />
              <Button variant={'success'} type="submit" className="w-full m-0">
                Guardar
              </Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CalendarContainer;

// import moment from 'moment';
// import CalentarTest from './CalentarTest';

// const events = [
//   {
//     start: moment('2024-11-11T10:00:00').toDate(),
//     end: moment('2024-11-11T11:00:00').toDate(),
//     title: 'primera reparación',
//   },
//   {
//     start: moment('2024-11-12T10:00:00').toDate(),
//     end: moment('2024-11-12T11:00:00').toDate(),
//     title: 'segunda reparación',
//   },
// ];

// function CalendarContainer() {
//   return (
//     <div style={{ height: '95vh' }}>
//       <CalentarTest
//         events={events}
//         defaultView={'month'}
//         views={['agenda', 'day', 'week', 'month']}
//         toolbar={true}
//         date={moment('2024-11-01T07:00:00').toDate()}
//         max={moment('2024-11-12T18:00:00').toDate()}
//         min={moment('2024-11-11T08:00:00').toDate()}
//       />
//     </div>
//   );
// }

// export default CalendarContainer;
