import React from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import iCalendarPlugin from '@fullcalendar/icalendar'

export default function App() {
  return (
    <div style={{ width: '800px', height: '480px', background: 'white', overflow: 'hidden' }}>
      
      <style>{`
        /* --- 1. FONTS & RESET (E-Ink Optimized) --- */
        body {
          font-family: "Courier New", Courier, monospace;
          background: white;
          color: black;
          margin: 0;
          
          /* CRITICAL FOR SHARPNESS ON TRMNL */
          -webkit-font-smoothing: none;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: geometricPrecision;
          shape-rendering: crispEdges;
        }
        
        table { border-collapse: collapse; border: none; }
        td, th { border: none; padding: 0; }

        /* --- 2. GRID LINES (2px for Visibility) --- */
        /* We increased this to 2px so the server doesn't delete them */
        .fc-timegrid-slots tr {
          border-bottom: 2px dotted black !important;
        }
        .fc-timegrid-col {
          border-right: 2px dotted black !important;
        }

        /* --- 3. HEADERS (Floating) --- */
        .fc-col-header-cell-cushion {
          color: black;
          font-weight: 900;
          font-size: 1.2rem;
          text-decoration: none;
          padding: 10px 0;
          display: block; 
        }

        /* TODAY: The Thick Black Box */
        .fc-col-header-cell.fc-day-today {
          border: 4px solid black !important;
          background: white !important;
        }
        
        /* Remove yellow highlight */
        .fc-day-today {
          background: transparent !important;
        }

        /* --- 4. EVENTS (Cutout Style) --- */
        .fc-event {
          background-color: black !important;
          border: 2px solid white !important;
          border-radius: 4px !important;
          box-shadow: none !important;
          opacity: 1 !important;
          overflow: hidden !important; 
        }

        .fc-event-main {
          color: white !important;
          background-color: black !important;
          padding: 2px 3px !important; 
          font-family: "Courier New", Courier, monospace;
          font-size: 0.75rem !important;
          font-weight: bold;
          line-height: 1.1;
        }
        
        .fc-event-time { display: none !important; }

        /* --- 5. CLEAN UP AXIS --- */
        .fc-timegrid-axis-cushion { display: none !important; }
        .fc-timegrid-slot-label { border: none !important; }
        .fc-timegrid-slot-label-cushion {
          color: black;
          font-weight: bold;
          font-size: 0.8rem;
          text-transform: lowercase;
          padding-right: 5px;
        }

        /* --- 6. "NOW" INDICATOR --- */
        .fc-timegrid-now-indicator-line {
          border-color: black !important;
          border-width: 2px;
        }
        .fc-timegrid-now-indicator-arrow {
          border-color: black !important;
          border-width: 5px;
        }

      `}</style>

      <FullCalendar
        plugins={[timeGridPlugin, iCalendarPlugin]}
        initialView="timeGridWeek"
        
        events={{
          url: '/feed.ics',
          format: 'ics'
        }}
        
        headerToolbar={false}
        
        dayHeaderFormat={{ 
            weekday: 'short', 
            month: 'numeric', 
            day: 'numeric', 
            omitCommas: true 
        }}
        
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: 'short'
        }}
        
        /* ZOOM SETTINGS */
        slotMinTime="07:00:00"  /* Start at 7 AM */
        slotMaxTime="23:00:00"  /* End at 11 PM */
        slotDuration="01:00:00"
        
        allDaySlot={false}
        nowIndicator={true}
        height="100%"
        expandRows={true}
      />
    </div>
  )
}
