import React, { useState } from 'react';
import {
  LuCalendarDays,
  LuFilter,
  LuChevronDown,
  LuClock,
  LuCirclePlus,
  LuCircleX,
  LuChevronLeft,
  LuChevronRight,
  LuUsers,
} from 'react-icons/lu';
import './styles.css';

const weekDays = [
  { day: 'SEG', number: '23', date: '2023-10-23' },
  { day: 'TER', number: '24', date: '2023-10-24', active: true },
  { day: 'QUA', number: '25', date: '2023-10-25' },
  { day: 'QUI', number: '26', date: '2023-10-26' },
  { day: 'SEX', number: '27', date: '2023-10-27' },
  { day: 'SÁB', number: '28', date: '2023-10-28', disabled: true },
  { day: 'DOM', number: '29', date: '2023-10-29', disabled: true },
];

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'];

const appointments = [
  {
    id: 1,
    date: '2023-10-23',
    time: '08:00',
    type: 'CONSULTA',
    patient: 'Beatriz Oliveira',
    details: 'Cardiologia - Sala 04',
    status: 'busy',
  },
  {
    id: 2,
    date: '2023-10-24',
    time: '08:00',
    type: 'CONSULTA PRESENCIAL',
    patient: 'Marcos Silva',
    details: 'Ortopedia - Sala 02',
    status: 'busy',
  },
  {
    id: 3,
    date: '2023-10-24',
    time: '10:00',
    type: 'RETORNO',
    patient: 'Ana Paula',
    details: 'Cardiologia - Sala 04',
    status: 'busy',
  },
  {
    id: 4,
    date: '2023-10-25',
    time: '09:00',
    type: 'CANCELADO',
    patient: 'Atendimento cancelado',
    details: '',
    status: 'canceled',
  },
  {
    id: 5,
    date: '2023-10-26',
    time: '08:00',
    type: 'CHECK-UP',
    patient: 'Carlos Mendes',
    details: 'Clínica Geral - Sala 01',
    status: 'busy',
  },
  {
    id: 6,
    date: '2023-10-27',
    time: '14:00',
    type: 'EMERGÊNCIA',
    patient: 'Juliana Castro',
    details: 'Pronto atendimento',
    status: 'emergency',
  },
];

const monthDays = Array.from({ length: 35 }, (_, index) => {
  const dayNumber = index - 0;
  const isCurrentMonth = dayNumber >= 1 && dayNumber <= 31;

  return {
    id: index,
    number: isCurrentMonth ? dayNumber : '',
    date: isCurrentMonth ? `2023-10-${String(dayNumber).padStart(2, '0')}` : null,
    muted: !isCurrentMonth,
    active: dayNumber === 24,
  };
});

function getAppointment(date, time) {
  return appointments.find((item) => item.date === date && item.time === time);
}

function getAppointmentsByDate(date) {
  return appointments.filter((item) => item.date === date);
}

function AppointmentCard({ appointment }) {
  if (!appointment) {
    return (
      <button type="button" className="empty-slot" aria-label="Adicionar horário">
        <LuCirclePlus size={24} />
      </button>
    );
  }

  if (appointment.status === 'canceled') {
    return (
      <div className="schedule-event schedule-event--canceled">
        <LuCircleX size={18} />
        <strong>CANCELADO</strong>
      </div>
    );
  }

  return (
    <div
      className={`schedule-event schedule-event--filled ${
        appointment.status === 'emergency' ? 'schedule-event--emergency' : 'schedule-event--green'
      }`}
    >
      <span>{appointment.type}</span>
      <strong>{appointment.patient}</strong>
      <small>{appointment.details}</small>
    </div>
  );
}

export default function WeeklySchedule() {
  const [view, setView] = useState('week');

  const selectedDay = weekDays.find((item) => item.active);
  const selectedDayAppointments = getAppointmentsByDate(selectedDay.date);

  const totalAppointments = view === 'day' ? selectedDayAppointments.length : appointments.length;
  const periodLabel = view === 'month' ? 'Outubro, 2023' : view === 'day' ? '24 de Outubro, 2023' : '23 - 29 de Outubro, 2023';

  return (
    <main className="weekly-schedule-page">
      <section className="weekly-schedule-header">
        <div>
          <h1>Agenda de Atendimentos</h1>

          <div className="weekly-schedule-header__info">
            <span>
              <LuCalendarDays size={14} />
              {periodLabel}
            </span>

            <p>Visualizando: {totalAppointments} atendimentos</p>
          </div>
        </div>

        <div className="schedule-view-toggle">
          <button
            type="button"
            className={view === 'day' ? 'schedule-view-toggle__active' : ''}
            onClick={() => setView('day')}
          >
            Dia
          </button>
          <button
            type="button"
            className={view === 'week' ? 'schedule-view-toggle__active' : ''}
            onClick={() => setView('week')}
          >
            Semana
          </button>
          <button
            type="button"
            className={view === 'month' ? 'schedule-view-toggle__active' : ''}
            onClick={() => setView('month')}
          >
            Mês
          </button>
        </div>
      </section>

      <section className="weekly-schedule-top">
        <aside className="quick-filters-card">
          <div className="quick-filters-card__title">
            <LuFilter size={20} />
            <h2>Filtros Rápidos</h2>
          </div>

          <label>
            ESPECIALIDADE
            <div className="quick-filter-select">
              <select defaultValue="">
                <option value="">Todas as Especialidades</option>
                <option value="cardiologia">Cardiologia</option>
                <option value="ortopedia">Ortopedia</option>
              </select>
              <LuChevronDown size={16} />
            </div>
          </label>

          <label>
            MÉDICO RESPONSÁVEL
            <div className="quick-filter-select">
              <select defaultValue="">
                <option value="">Qualquer Médico</option>
                <option value="ricardo-silva">Dr. Ricardo Silva</option>
                <option value="ana-clara">Dra. Ana Clara</option>
                <option value="marcos-silva">Dr. Marcos Silva</option>
                <option value="beatriz-oliveira">Dra. Beatriz Oliveira</option>
              </select>

              <LuChevronDown size={16} />
            </div>
          </label>

          <div className="schedule-legend">
            <h3>LEGENDA</h3>
            <div className="schedule-legend__grid">
              <span><small className="legend-color legend-color--busy" /> Ocupado</span>
              <span><small className="legend-color legend-color--free" /> Livre</span>
              <span><small className="legend-color legend-color--canceled" /> Cancelado</span>
              <span><small className="legend-color legend-color--emergency" /> Emergência</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="weekly-calendar-card">
        {view === 'day' && (
          <div className="view-container-day">
            <div className="day-view-header">
              <button type="button" className="nav-button" aria-label="Dia anterior">
                <LuChevronLeft size={20} />
              </button>

              <div>
                <span>TERÇA-FEIRA</span>
                <strong>24 de Outubro</strong>
              </div>

              <button type="button" className="nav-button" aria-label="Próximo dia">
                <LuChevronRight size={20} />
              </button>
            </div>

            <div className="weekly-calendar-grid weekly-calendar-grid--day weekly-calendar-grid--header">
              <div className="calendar-time-header">
                <LuClock size={24} />
              </div>
              <div className="calendar-day-header calendar-day-header--active">
                <span>{selectedDay.day}</span>
                <strong>{selectedDay.number}</strong>
              </div>
            </div>

            {timeSlots.map((time) => (
              <div key={time} className="weekly-calendar-grid weekly-calendar-grid--day calendar-row">
                <div className="calendar-time">{time}</div>
                <div className="calendar-cell">
                  <AppointmentCard appointment={getAppointment(selectedDay.date, time)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'week' && (
          <div className="view-container-week">
            <div className="weekly-calendar-grid weekly-calendar-grid--header">
              <div className="calendar-time-header">
                <LuClock size={24} />
              </div>

              {weekDays.map((item) => (
                <div
                  key={item.date}
                  className={`calendar-day-header ${item.active ? 'calendar-day-header--active' : ''} ${
                    item.disabled ? 'calendar-day-header--disabled' : ''
                  }`}
                >
                  <span>{item.day}</span>
                  <strong>{item.number}</strong>
                </div>
              ))}
            </div>

            {timeSlots.map((time) => (
              <div key={time} className="weekly-calendar-grid calendar-row">
                <div className="calendar-time">{time}</div>

                {weekDays.map((day) => (
                  <div
                    key={`${day.date}-${time}`}
                    className={`calendar-cell ${day.disabled ? 'calendar-cell--disabled' : ''}`}
                  >
                    {!day.disabled && <AppointmentCard appointment={getAppointment(day.date, time)} />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {view === 'month' && (
          <div className="view-container-month">
            <div className="month-view-header">
              <button type="button" className="nav-button" aria-label="Mês anterior">
                <LuChevronLeft size={20} />
              </button>

              <strong>Outubro 2023</strong>

              <button type="button" className="nav-button" aria-label="Próximo mês">
                <LuChevronRight size={20} />
              </button>
            </div>

            <div className="month-grid-header">
              {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="month-grid-body">
              {monthDays.map((day) => {
                const dayAppointments = day.date ? getAppointmentsByDate(day.date) : [];

                return (
                  <button
                    type="button"
                    key={day.id}
                    className={`month-cell ${day.active ? 'month-cell--active' : ''} ${day.muted ? 'month-cell--muted' : ''}`}
                    disabled={day.muted}
                  >
                    <span className="month-day-number">{day.number}</span>

                    <div className="month-events-list">
                      {dayAppointments.slice(0, 2).map((appointment) => (
                        <span
                          key={appointment.id}
                          className={`month-event-pill month-event-pill--${appointment.status}`}
                        >
                          {appointment.time} {appointment.patient}
                        </span>
                      ))}

                      {dayAppointments.length > 2 && (
                        <small>+{dayAppointments.length - 2} atendimento(s)</small>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <button type="button" className="schedule-floating-button" aria-label="Adicionar atendimento">
        <LuCirclePlus size={28} />
      </button>
    </main>
  );
}
