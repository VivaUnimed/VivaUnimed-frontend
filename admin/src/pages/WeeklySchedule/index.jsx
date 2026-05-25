import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuCalendarDays,
  LuFilter,
  LuChevronDown,
  LuClock,
  LuCirclePlus,
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

const specialtyOptions = [
  'Cardiologia',
  'Ortopedia',
  'Clínica Geral',
  'Dermatologia',
];

const professionalOptions = [
  'Dr. Ricardo Almeida',
  'Dra. Mariana Lopes',
  'Dr. Carlos Mendes',
  'Dra. Juliana Castro',
];

const statusFilterOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'occupied', label: 'Ocupado' },
  { value: 'free', label: 'Livre' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'available_vacancy', label: 'Vaga remanescente' },
  { value: 'confirmed_by_queue', label: 'Confirmada pela fila' },
  { value: 'expired', label: 'Expirada' },
];

const operationalEvents = [
  {
    id: 1,
    date: '2023-10-23',
    time: '08:00',
    type: 'OCUPADO',
    patient: 'Beatriz Oliveira',
    details: 'Cardiologia - Dra. Mariana Lopes',
    status: 'occupied',
  },
  {
    id: 2,
    date: '2023-10-24',
    time: '08:00',
    type: 'OCUPADO',
    patient: 'Marcos Silva',
    details: 'Ortopedia - Sala 02',
    status: 'occupied',
  },
  {
    id: 3,
    date: '2023-10-24',
    time: '10:00',
    type: 'CONFIRMADA PELA FILA',
    patient: 'Ana Paula',
    details: 'Cardiologia - Dr. Ricardo Almeida',
    status: 'confirmed_by_queue',
  },
  {
    id: 4,
    date: '2023-10-25',
    time: '09:00',
    type: 'CANCELADO',
    patient: 'Atendimento cancelado',
    details: 'Horário disponível para reaproveitamento',
    status: 'cancelled',
  },
  {
    id: 5,
    date: '2023-10-26',
    time: '08:00',
    type: 'VAGA REMANESCENTE',
    patient: 'Aguardando aceite',
    details: 'Clínica Geral - Expira em 12 min',
    status: 'available_vacancy',
  },
  {
    id: 6,
    date: '2023-10-27',
    time: '14:00',
    type: 'EXPIRADA',
    patient: 'Sem aceite no prazo',
    details: 'Dermatologia - Expirou há 8 min',
    status: 'expired',
  },
];

const statusPresentation = {
  occupied: {
    label: 'Ocupado',
    modifier: 'occupied',
  },
  cancelled: {
    label: 'Cancelado',
    modifier: 'cancelled',
  },
  available_vacancy: {
    label: 'Vaga remanescente',
    modifier: 'available-vacancy',
    badge: 'Disponível',
    badgeVariant: 'highlight',
  },
  confirmed_by_queue: {
    label: 'Confirmada pela fila',
    modifier: 'confirmed',
    badge: 'Fila confirmou',
    badgeVariant: 'success',
    badgeIcon: LuUsers,
  },
  expired: {
    label: 'Expirada',
    modifier: 'expired',
  },
};

const legendItems = [
  { label: 'Ocupado', legendClass: 'legend-color--occupied' },
  { label: 'Livre', legendClass: 'legend-color--free' },
  { label: 'Cancelado', legendClass: 'legend-color--cancelled' },
  { label: 'Vaga remanescente', legendClass: 'legend-color--available-vacancy' },
  { label: 'Confirmada pela fila', legendClass: 'legend-color--confirmed' },
  { label: 'Expirada', legendClass: 'legend-color--expired' },
];

const monthDays = Array.from({ length: 35 }, (_, index) => {
  const dayNumber = index;
  const isCurrentMonth = dayNumber >= 1 && dayNumber <= 31;

  return {
    id: index,
    number: isCurrentMonth ? dayNumber : '',
    date: isCurrentMonth ? `2023-10-${String(dayNumber).padStart(2, '0')}` : null,
    muted: !isCurrentMonth,
    active: dayNumber === 24,
  };
});

function getStatusPresentation(status) {
  return statusPresentation[status] || statusPresentation.occupied;
}

function getAppointment(date, time) {
  return operationalEvents.find((item) => item.date === date && item.time === time);
}

function getAppointmentsByDate(date) {
  return operationalEvents.filter((item) => item.date === date);
}

function AppointmentCard({ appointment, date, time, onEmptySlotClick }) {
  if (!appointment) {
    return (
      <button
        type="button"
        className="empty-slot"
        aria-label={`Adicionar vaga remanescente em ${date} às ${time}`}
        onClick={() => onEmptySlotClick(date, time)}
      >
        <LuCirclePlus size={24} />
      </button>
    );
  }

  const presentation = getStatusPresentation(appointment.status);
  const BadgeIcon = presentation.badgeIcon;

  return (
    <div className={`schedule-event schedule-event--filled schedule-event--${presentation.modifier}`}>
      <div className="schedule-event__header">
        <span className="schedule-event__type">{appointment.type}</span>

        {presentation.badge ? (
          <span className={`schedule-event__badge schedule-event__badge--${presentation.badgeVariant}`}>
            {BadgeIcon ? <BadgeIcon size={12} /> : null}
            {presentation.badge}
          </span>
        ) : null}
      </div>

      <strong className="schedule-event__title">{appointment.patient}</strong>
      <small className="schedule-event__details">{appointment.details}</small>
    </div>
  );
}

export default function WeeklySchedule() {
  const navigate = useNavigate();
  const [view, setView] = useState('week');

  const selectedDay = weekDays.find((item) => item.active);
  const selectedDayAppointments = getAppointmentsByDate(selectedDay.date);

  const totalAppointments = view === 'day' ? selectedDayAppointments.length : operationalEvents.length;
  const totalLabel = totalAppointments === 1 ? 'registro operacional' : 'registros operacionais';
  const periodLabel =
    view === 'month'
      ? 'Outubro, 2023'
      : view === 'day'
        ? '24 de Outubro, 2023'
        : '23 - 29 de Outubro, 2023';

  const handleCreateVacancy = (date, time) => {
    navigate('/vacancies/new', {
      state: {
        date,
        time,
      },
    });
  };

  return (
    <main className="weekly-schedule-page">
      <section className="weekly-schedule-header">
        <div>
          <h1>Agenda Operacional</h1>
          <p className="weekly-schedule-header__subtitle">
            Visualize horários ocupados, livres, cancelados e vagas remanescentes
            disponíveis para reaproveitamento.
          </p>

          <div className="weekly-schedule-header__info">
            <span>
              <LuCalendarDays size={14} />
              {periodLabel}
            </span>

            <p>
              Visualizando: {totalAppointments} {totalLabel}
            </p>
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
                <option value="">Todas as especialidades</option>
                {specialtyOptions.map((specialty) => (
                  <option key={specialty} value={specialty.toLowerCase()}>
                    {specialty}
                  </option>
                ))}
              </select>
              <LuChevronDown size={16} />
            </div>
          </label>

          <label>
            MÉDICO RESPONSÁVEL
            <div className="quick-filter-select">
              <select defaultValue="">
                <option value="">Qualquer médico</option>
                {professionalOptions.map((professional) => (
                  <option key={professional} value={professional.toLowerCase()}>
                    {professional}
                  </option>
                ))}
              </select>

              <LuChevronDown size={16} />
            </div>
          </label>

          <label>
            STATUS DA VAGA
            <div className="quick-filter-select">
              <select defaultValue="">
                {statusFilterOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <LuChevronDown size={16} />
            </div>
          </label>

          <div className="schedule-legend">
            <h3>LEGENDA</h3>
            <div className="schedule-legend__grid">
              {legendItems.map((item) => (
                <span key={item.label}>
                  <small className={`legend-color ${item.legendClass}`} />
                  {item.label}
                </span>
              ))}
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
                  <AppointmentCard
                    appointment={getAppointment(selectedDay.date, time)}
                    date={selectedDay.date}
                    time={time}
                    onEmptySlotClick={handleCreateVacancy}
                  />
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
                    {!day.disabled ? (
                      <AppointmentCard
                        appointment={getAppointment(day.date, time)}
                        date={day.date}
                        time={time}
                        onEmptySlotClick={handleCreateVacancy}
                      />
                    ) : null}
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
                      {dayAppointments.slice(0, 2).map((appointment) => {
                        const presentation = getStatusPresentation(appointment.status);

                        return (
                          <span
                            key={appointment.id}
                            className={`month-event-pill month-event-pill--${presentation.modifier}`}
                          >
                            {appointment.time} {appointment.type}
                          </span>
                        );
                      })}

                      {dayAppointments.length > 2 && (
                        <small>+{dayAppointments.length - 2} registro(s)</small>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <button
        type="button"
        className="schedule-floating-button"
        aria-label="Adicionar vaga remanescente"
        onClick={() => navigate('/vacancies/new')}
      >
        <LuCirclePlus size={28} />
      </button>
    </main>
  );
}
