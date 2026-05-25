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
  LuRefreshCw,
} from 'react-icons/lu';
import { normalizeText } from '../../data/professionals';
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
    specialty: 'Cardiologia',
    professional: 'Dra. Mariana Lopes',
    status: 'occupied',
  },
  {
    id: 2,
    date: '2023-10-24',
    time: '08:00',
    type: 'OCUPADO',
    patient: 'Marcos Silva',
    details: 'Ortopedia - Sala 02',
    specialty: 'Ortopedia',
    professional: 'Dr. Carlos Mendes',
    status: 'occupied',
  },
  {
    id: 3,
    date: '2023-10-24',
    time: '10:00',
    type: 'CONFIRMADA PELA FILA',
    patient: 'Ana Paula',
    details: 'Cardiologia - Dr. Ricardo Almeida',
    specialty: 'Cardiologia',
    professional: 'Dr. Ricardo Almeida',
    status: 'confirmed_by_queue',
  },
  {
    id: 4,
    date: '2023-10-25',
    time: '09:00',
    type: 'CANCELADO',
    patient: 'Atendimento cancelado',
    details: 'Horário disponível para reaproveitamento',
    specialty: 'Ortopedia',
    professional: 'Dra. Juliana Castro',
    status: 'cancelled',
  },
  {
    id: 5,
    date: '2023-10-26',
    time: '08:00',
    type: 'VAGA REMANESCENTE',
    patient: 'Aguardando aceite',
    details: 'Clínica Geral - Expira em 12 min',
    specialty: 'Clínica Geral',
    professional: 'Dra. Juliana Castro',
    status: 'available_vacancy',
  },
  {
    id: 6,
    date: '2023-10-27',
    time: '14:00',
    type: 'EXPIRADA',
    patient: 'Sem aceite no prazo',
    details: 'Dermatologia - Expirou há 8 min',
    specialty: 'Dermatologia',
    professional: 'Dra. Mariana Lopes',
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

function getAppointment(date, time, appointments = operationalEvents) {
  return appointments.find((item) => item.date === date && item.time === time);
}

function getAppointmentsByDate(date, appointments = operationalEvents) {
  return appointments.filter((item) => item.date === date);
}

function countAvailableSlots(days) {
  return days.reduce(
    (total, day) =>
      total + timeSlots.filter((time) => !getAppointment(day.date, time)).length,
    0,
  );
}

function appointmentMatchesFilters(appointment, filters) {
  const normalizedSpecialtyFilter = normalizeText(filters.specialtyFilter);
  const normalizedProfessionalFilter = normalizeText(filters.professionalFilter);
  const matchesSpecialty =
    !normalizedSpecialtyFilter
    || normalizeText(appointment.specialty) === normalizedSpecialtyFilter;
  const matchesProfessional =
    !normalizedProfessionalFilter
    || normalizeText(appointment.professional) === normalizedProfessionalFilter;
  const matchesStatus = !filters.statusFilter || appointment.status === filters.statusFilter;

  return matchesSpecialty && matchesProfessional && matchesStatus;
}

function EmptySlotButton({ date, time, onEmptySlotClick }) {
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

function AppointmentCard({ appointment }) {
  if (!appointment) {
    return null;
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

function ScheduleSlotContent({
  appointment,
  hasAppointment,
  showEmptySlot,
  date,
  time,
  onEmptySlotClick,
}) {
  if (appointment) {
    return <AppointmentCard appointment={appointment} />;
  }

  if (!hasAppointment && showEmptySlot) {
    return (
      <EmptySlotButton
        date={date}
        time={time}
        onEmptySlotClick={onEmptySlotClick}
      />
    );
  }

  return null;
}

export default function WeeklySchedule() {
  const navigate = useNavigate();
  const [view, setView] = useState('week');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [professionalFilter, setProfessionalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const selectedDay = weekDays.find((item) => item.active) || weekDays[0];
  const filteredAppointments = operationalEvents.filter((appointment) =>
    appointmentMatchesFilters(appointment, {
      specialtyFilter,
      professionalFilter,
      statusFilter,
    }),
  );
  const selectedDayAppointments = getAppointmentsByDate(selectedDay.date, filteredAppointments);
  const visibleWeekDays = weekDays.filter((item) => !item.disabled);
  const isFreeSlotsOnlyView = statusFilter === 'free' && !specialtyFilter && !professionalFilter;
  const totalAppointments = isFreeSlotsOnlyView
    ? view === 'day'
      ? countAvailableSlots([selectedDay])
      : view === 'week'
        ? countAvailableSlots(visibleWeekDays)
        : 0
    : view === 'day'
      ? selectedDayAppointments.length
      : filteredAppointments.length;
  const totalLabel = isFreeSlotsOnlyView
    ? totalAppointments === 1
      ? 'horário livre'
      : 'horários livres'
    : totalAppointments === 1
      ? 'registro operacional'
      : 'registros operacionais';
  const canShowEmptySlots = !specialtyFilter && !professionalFilter
    && (!statusFilter || statusFilter === 'free');
  const hasActiveFilters = Boolean(specialtyFilter || professionalFilter || statusFilter);

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

  const handleClearFilters = () => {
    setSpecialtyFilter('');
    setProfessionalFilter('');
    setStatusFilter('');
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
              <select
                value={specialtyFilter}
                onChange={(event) => setSpecialtyFilter(event.target.value)}
                aria-label="Filtrar por especialidade"
              >
                <option value="">Todas as especialidades</option>
                {specialtyOptions.map((specialty) => (
                  <option key={specialty} value={specialty}>
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
              <select
                value={professionalFilter}
                onChange={(event) => setProfessionalFilter(event.target.value)}
                aria-label="Filtrar por médico responsável"
              >
                <option value="">Qualquer médico</option>
                {professionalOptions.map((professional) => (
                  <option key={professional} value={professional}>
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
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filtrar por status da vaga"
              >
                {statusFilterOptions.map((option) => (
                  <option key={option.value || 'all-status'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <LuChevronDown size={16} />
            </div>
          </label>

          <div className="quick-filters-actions">
            <button
              type="button"
              className="quick-filters-clear-button"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              <LuRefreshCw size={16} />
              Limpar filtros
            </button>
          </div>

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
                  <ScheduleSlotContent
                    appointment={getAppointment(selectedDay.date, time, filteredAppointments)}
                    hasAppointment={Boolean(getAppointment(selectedDay.date, time))}
                    showEmptySlot={canShowEmptySlots}
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
                      <ScheduleSlotContent
                        appointment={getAppointment(day.date, time, filteredAppointments)}
                        hasAppointment={Boolean(getAppointment(day.date, time))}
                        showEmptySlot={canShowEmptySlots}
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
                const dayAppointments = day.date
                  ? getAppointmentsByDate(day.date, filteredAppointments)
                  : [];

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
