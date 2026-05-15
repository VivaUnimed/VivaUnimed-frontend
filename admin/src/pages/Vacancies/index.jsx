import { useState } from 'react';

import {
  LuCalendarCheck,
  LuChevronDown,
  LuSearch,
  LuHistory,
  LuRefreshCw,
  LuPlus,
  LuMoveRight,
  LuClock3,
  LuUsers,
  LuCircleCheck,
  LuCircleX,
  LuSend,
  LuFilter,
} from 'react-icons/lu';

import './styles.css';

const summaryCards = [
  {
    id: 1,
    label: 'Abertas',
    icon: LuCalendarCheck,
    modifier: 'open',
    matches: (slot) => slot.vacancyStatus === 'open',
  },
  {
    id: 2,
    label: 'Aguardando aceite',
    icon: LuClock3,
    modifier: 'waiting',
    matches: (slot) => slot.vacancyStatus === 'waiting-acceptance',
  },
  {
    id: 3,
    label: 'Confirmadas',
    icon: LuCircleCheck,
    modifier: 'confirmed',
    matches: (slot) => slot.vacancyStatus === 'confirmed',
  },
  {
    id: 4,
    label: 'Expiradas',
    icon: LuHistory,
    modifier: 'expired',
    matches: (slot) => slot.vacancyStatus === 'expired',
  },
  {
    id: 5,
    label: 'Canceladas',
    icon: LuCircleX,
    modifier: 'cancelled',
    matches: (slot) => slot.vacancyStatus === 'cancelled',
  },
  {
    id: 6,
    label: 'Falhas no disparo',
    icon: LuSend,
    modifier: 'error',
    matches: (slot) => slot.dispatchStatus === 'error',
  },
];

const vacancyStatusOptions = [
  { value: '', label: 'Todos os status da vaga' },
  { value: 'open', label: 'Aberta' },
  { value: 'waiting-acceptance', label: 'Aguardando aceite' },
  { value: 'in-progress', label: 'Em processamento' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'expired', label: 'Expirada' },
  { value: 'cancelled', label: 'Cancelada' },
];

const dispatchStatusOptions = [
  { value: '', label: 'Todos os status do disparo' },
  { value: 'success', label: 'Enviado com sucesso' },
  { value: 'sending', label: 'Enviando' },
  { value: 'waiting', label: 'Aguardando disparo' },
  { value: 'error', label: 'Falha no disparo' },
];

const generatedSlots = [
  {
    id: 1,
    time: '14:30',
    date: 'Hoje, 24 Out',
    specialty: 'Cardiologia',
    professional: 'Dr. Ricardo Almeida',
    queuePatients: 12,
    vacancyStatus: 'waiting-acceptance',
    vacancyStatusText: 'Aguardando aceite',
    dispatchStatus: 'success',
    dispatchStatusText: 'Enviado com sucesso',
    expiration: 'Expira em 08 min',
    confirmedPatient: null,
    action: 'Gerenciar',
  },
  {
    id: 2,
    time: '15:15',
    date: 'Hoje, 24 Out',
    specialty: 'Ortopedia',
    professional: 'Dra. Heloísa Santos',
    queuePatients: 24,
    vacancyStatus: 'in-progress',
    vacancyStatusText: 'Em processamento',
    dispatchStatus: 'sending',
    dispatchStatusText: 'Enviando...',
    expiration: 'Aguardando envio',
    confirmedPatient: null,
    action: 'Aguarde',
  },
  {
    id: 3,
    time: '16:45',
    date: 'Hoje, 24 Out',
    specialty: 'Pediatria',
    professional: 'Dr. Fábio Mello',
    queuePatients: 9,
    vacancyStatus: 'open',
    vacancyStatusText: 'Aberta',
    dispatchStatus: 'waiting',
    dispatchStatusText: 'Aguardando disparo',
    expiration: '15 min após envio',
    confirmedPatient: null,
    action: 'Processar fila',
  },
  {
    id: 4,
    time: '09:00',
    date: 'Amanhã, 25 Out',
    specialty: 'Dermatologia',
    professional: 'Dra. Cláudia Lima',
    queuePatients: 0,
    vacancyStatus: 'open',
    vacancyStatusText: 'Aberta',
    dispatchStatus: 'error',
    dispatchStatusText: 'Falha no disparo',
    expiration: 'Não iniciado',
    confirmedPatient: null,
    action: 'retry',
  },
  {
    id: 5,
    time: '10:30',
    date: 'Amanhã, 25 Out',
    specialty: 'Ginecologia',
    professional: 'Dra. Marina Costa',
    queuePatients: 18,
    vacancyStatus: 'confirmed',
    vacancyStatusText: 'Confirmada',
    dispatchStatus: 'success',
    dispatchStatusText: 'Enviado com sucesso',
    expiration: 'Finalizada',
    confirmedPatient: 'Ana Souza',
    action: 'Ver confirmação',
  },
];

function formatSummaryValue(value) {
  return String(value).padStart(2, '0');
}

export default function Vacancies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [vacancyStatusFilter, setVacancyStatusFilter] = useState('');
  const [dispatchStatusFilter, setDispatchStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const dateOptions = [...new Set(generatedSlots.map((slot) => slot.date))];
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const hasActiveFilters = Boolean(
    normalizedSearchTerm
    || vacancyStatusFilter
    || dispatchStatusFilter
    || dateFilter
  );

  const filteredSlots = generatedSlots.filter((slot) => {
    const matchesSearch = !normalizedSearchTerm
      || slot.specialty.toLowerCase().includes(normalizedSearchTerm)
      || slot.professional.toLowerCase().includes(normalizedSearchTerm)
      || slot.confirmedPatient?.toLowerCase().includes(normalizedSearchTerm);

    const matchesVacancyStatus = !vacancyStatusFilter
      || slot.vacancyStatus === vacancyStatusFilter;

    const matchesDispatchStatus = !dispatchStatusFilter
      || slot.dispatchStatus === dispatchStatusFilter;

    const matchesDate = !dateFilter || slot.date === dateFilter;

    return (
      matchesSearch
      && matchesVacancyStatus
      && matchesDispatchStatus
      && matchesDate
    );
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setVacancyStatusFilter('');
    setDispatchStatusFilter('');
    setDateFilter('');
  };

  return (
    <main className="idle-slots-page">
      <section className="idle-slots-header">
        <div>
          <h1>Vagas</h1>
          <p>
            Gestão de vagas remanescentes, disparos e confirmações de pacientes.
          </p>
        </div>

        <button type="button" className="new-vacancy-button">
          <LuPlus size={18} />
          Nova vaga
        </button>
      </section>

      <section className="vacancy-summary-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const value = filteredSlots.filter(card.matches).length;

          return (
            <article
              key={card.id}
              className={`vacancy-summary-card vacancy-summary-card--${card.modifier}`}
            >
              <div>
                <span>{card.label}</span>
                <strong>{formatSummaryValue(value)}</strong>
              </div>

              <div className="vacancy-summary-card__icon">
                <Icon size={20} />
              </div>
            </article>
          );
        })}
      </section>

      <section className="vacancy-filters">
        <div className="vacancy-filters__search">
          <LuSearch size={18} />
          <input
            type="text"
            placeholder="Buscar por especialidade ou profissional..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <label className="vacancy-filter-select">
          <LuFilter size={16} />
          <select
            value={vacancyStatusFilter}
            onChange={(event) => setVacancyStatusFilter(event.target.value)}
            aria-label="Filtrar por status da vaga"
          >
            {vacancyStatusOptions.map((option) => (
              <option key={option.value || 'all-vacancy-status'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <LuChevronDown size={16} />
        </label>

        <label className="vacancy-filter-select">
          <LuSend size={16} />
          <select
            value={dispatchStatusFilter}
            onChange={(event) => setDispatchStatusFilter(event.target.value)}
            aria-label="Filtrar por status do disparo"
          >
            {dispatchStatusOptions.map((option) => (
              <option key={option.value || 'all-dispatch-status'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <LuChevronDown size={16} />
        </label>

        <label className="vacancy-filter-select">
          <LuCalendarCheck size={16} />
          <select
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            aria-label="Filtrar por data"
          >
            <option value="">Todas as datas</option>
            {dateOptions.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
          <LuChevronDown size={16} />
        </label>

        <button
          type="button"
          className="vacancy-filter-button"
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
        >
          <LuRefreshCw size={16} />
          Limpar filtros
        </button>
      </section>

      <section className="idle-slots-main-grid">
        <section className="idle-slots-right">
          <div className="generated-slots-card">
            <div className="generated-slots-card__header">
              <div>
                <LuCalendarCheck size={22} />
                <h2>Vagas Remanescentes</h2>
              </div>

              <button type="button">
                Ver histórico completo
                <LuMoveRight size={15} />
              </button>
            </div>

            <div className="generated-slots-table-wrapper">
              <table className="generated-slots-table">
                <thead>
                  <tr>
                    <th>HORÁRIO</th>
                    <th>ESPECIALIDADE <br />/ PROFISSIONAL</th>
                    <th>FILA</th>
                    <th>STATUS DA VAGA</th>
                    <th>DISPARO</th>
                    <th>EXPIRAÇÃO</th>
                    <th>PACIENTE</th>
                    <th>AÇÃO</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSlots.length > 0 ? (
                    filteredSlots.map((slot) => (
                      <tr key={slot.id}>
                        <td>
                          <strong>{slot.time}</strong>
                          <span>{slot.date}</span>
                        </td>

                        <td>
                          <strong>{slot.specialty}</strong>
                          <span>{slot.professional}</span>
                        </td>

                        <td>
                          <div className="queue-patients">
                            <LuUsers size={15} />
                            <strong>{slot.queuePatients}</strong>
                            <span>pacientes</span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`slot-status slot-status--${slot.vacancyStatus}`}
                          >
                            {slot.vacancyStatusText}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`slot-status slot-status--${slot.dispatchStatus}`}
                          >
                            {slot.dispatchStatusText}
                          </span>
                        </td>

                        <td>
                          <span className="slot-expiration">
                            {slot.expiration}
                          </span>
                        </td>

                        <td>
                          {slot.confirmedPatient ? (
                            <strong className="confirmed-patient">
                              {slot.confirmedPatient}
                            </strong>
                          ) : (
                            <span className="empty-patient">—</span>
                          )}
                        </td>

                        <td>
                          {slot.action === 'retry' ? (
                            <button
                              type="button"
                              className="slot-action slot-action--retry"
                              title="Tentar novamente"
                            >
                              <LuRefreshCw size={22} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={`slot-action ${
                                slot.action === 'Processar fila'
                                  ? 'slot-action--primary'
                                  : ''
                              } ${
                                slot.action === 'Aguarde'
                                  ? 'slot-action--disabled'
                                  : ''
                              }`}
                              disabled={slot.action === 'Aguarde'}
                            >
                              {slot.action}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="generated-slots-empty-row">
                      <td colSpan="8">
                        <div className="generated-slots-empty">
                          <strong>Nenhuma vaga encontrada</strong>
                          <span>Tente ajustar ou limpar os filtros aplicados.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
