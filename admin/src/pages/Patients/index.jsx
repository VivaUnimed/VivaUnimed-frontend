import { useState } from 'react';
import {
  LuBadgeAlert,
  LuBadgeCheck,
  LuChevronDown,
  LuDownload,
  LuPlus,
  LuRefreshCw,
  LuSearch,
  LuSlidersHorizontal,
} from 'react-icons/lu';
import './styles.css';

const totalPatientsLabel = '1.284';

const summaryCards = [
  {
    id: 1,
    title: 'TOTAL DE PACIENTES',
    value: totalPatientsLabel,
    helper: '+12% este mês',
    modifier: 'default',
  },
  {
    id: 2,
    title: 'EM FILA INTELIGENTE',
    value: '42',
    helper: 'Tempo médio: 14 min',
    modifier: 'neutral',
  },
  {
    id: 3,
    title: 'CONFIRMADOS HOJE',
    value: '18',
    helper: 'Vagas remanescentes preenchidas',
    modifier: 'highlight',
  },
];

const patients = [
  {
    id: 1,
    name: 'Beatriz Helena Ferreira',
    cpf: '123.***.***-01',
    phone: '(53) 99999-0001',
    email: 'beatriz@email.com',
    phoneValid: true,
    interests: ['Dermatologia', 'Cardiologia'],
    status: 'Ativo',
    lastNotificationDate: '12 Mai, 2024',
    lastNotificationStatus: 'Enviada',
    lastConfirmationDate: '18 Jun, 2024',
    lastConfirmationSpecialty: 'Dermatologia',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Ricardo Mendes Albuquerque',
    cpf: '892.***.***-45',
    phone: '(53) 99999-1120',
    email: 'ricardo.mendes@email.com',
    phoneValid: false,
    interests: ['Ortopedia', 'Fisiatria'],
    status: 'Em fila',
    lastNotificationDate: '16 Jun, 2024',
    lastNotificationStatus: 'Falhou',
    lastConfirmationDate: '',
    lastConfirmationSpecialty: '',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Joaquim de Souza Neto',
    cpf: '541.***.***-22',
    phone: '(53) 98888-4321',
    email: 'joaquim.neto@email.com',
    phoneValid: true,
    interests: ['Neurologia', 'Clínica Médica', 'Cardiologia'],
    status: 'Inativo',
    lastNotificationDate: 'Sem envio',
    lastNotificationStatus: 'Sem envio',
    lastConfirmationDate: '',
    lastConfirmationSpecialty: '',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Mariana Luzia Santos',
    cpf: '211.***.***-98',
    phone: '(53) 99777-2054',
    email: 'mariana.luzia@email.com',
    phoneValid: true,
    interests: ['Nutrologia', 'Endocrinologia'],
    status: 'Ativo',
    lastNotificationDate: '18 Jun, 2024',
    lastNotificationStatus: 'Enviada',
    lastConfirmationDate: '18 Jun, 2024',
    lastConfirmationSpecialty: 'Nutrologia',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 5,
    name: 'Ana Carolina Rocha',
    cpf: '734.***.***-63',
    phone: '(53) 99666-7810',
    email: 'ana.rocha@email.com',
    phoneValid: true,
    interests: ['Pediatria', 'Alergologia'],
    status: 'Em fila',
    lastNotificationDate: '17 Jun, 2024',
    lastNotificationStatus: 'Enviada',
    lastConfirmationDate: '',
    lastConfirmationSpecialty: '',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=80&h=80&fit=crop&crop=face',
  },
];

const statusOptions = ['Ativo', 'Em fila', 'Inativo'];
const specialtyOptions = [...new Set(patients.flatMap((patient) => patient.interests))];
const contactOptions = [
  { value: 'valid', label: 'Telefone válido' },
  { value: 'invalid', label: 'Telefone inválido' },
];

function toSlug(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [contactFilter, setContactFilter] = useState('');

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const hasActiveFilters = Boolean(
    normalizedSearchTerm
    || statusFilter
    || specialtyFilter
    || contactFilter
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSpecialtyFilter('');
    setContactFilter('');
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = !normalizedSearchTerm
      || [
        patient.name,
        patient.phone,
        patient.email,
        patient.cpf,
      ].some((value) => value.toLowerCase().includes(normalizedSearchTerm));

    const matchesStatus = !statusFilter || patient.status === statusFilter;
    const matchesSpecialty = !specialtyFilter || patient.interests.includes(specialtyFilter);
    const matchesContact = !contactFilter
      || (contactFilter === 'valid' ? patient.phoneValid : !patient.phoneValid);

    return (
      matchesSearch
      && matchesStatus
      && matchesSpecialty
      && matchesContact
    );
  });

  return (
    <main className="patients-page">
      <section className="patients-header">
        <div>
          <h1>Gestão de Pacientes</h1>
          <p>Consulte, cadastre e acompanhe pacientes inscritos na fila inteligente.</p>
        </div>

        <div className="patients-header__actions">
          <button
            type="button"
            className="patients-header__button patients-header__button--secondary"
          >
            <LuDownload size={18} />
            Importar pacientes
          </button>

          <button
            type="button"
            className="patients-header__button patients-header__button--primary"
          >
            <LuPlus size={18} />
            Novo paciente
          </button>
        </div>
      </section>

      <section className="patients-stats">
        {summaryCards.map((card) => (
          <article
            key={card.id}
            className={`patient-stat-card patient-stat-card--${card.modifier}`}
          >
            <span>{card.title}</span>
            <strong>{card.value}</strong>
            <p>{card.helper}</p>
          </article>
        ))}
      </section>

      <section className="patients-filters">
        <div className="patients-filters__search">
          <LuSearch size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, telefone, e-mail ou CPF..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <label className="patients-filter-button">
          <LuSlidersHorizontal size={16} />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filtrar por status"
          >
            <option value="">Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <LuChevronDown size={16} className="patients-filter-button__chevron" />
        </label>

        <label className="patients-filter-button">
          <LuSlidersHorizontal size={16} />
          <select
            value={specialtyFilter}
            onChange={(event) => setSpecialtyFilter(event.target.value)}
            aria-label="Filtrar por especialidade"
          >
            <option value="">Especialidade</option>
            {specialtyOptions.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <LuChevronDown size={16} className="patients-filter-button__chevron" />
        </label>

        <label className="patients-filter-button">
          <LuSlidersHorizontal size={16} />
          <select
            value={contactFilter}
            onChange={(event) => setContactFilter(event.target.value)}
            aria-label="Filtrar por contato"
          >
            <option value="">Contato</option>
            {contactOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <LuChevronDown size={16} className="patients-filter-button__chevron" />
        </label>

        <button
          type="button"
          className="patients-filter-clear-button"
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
        >
          <LuRefreshCw size={16} />
          Limpar filtros
        </button>
      </section>

      <section className="patients-table-card">
        <div className="patients-table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>PACIENTE</th>
                <th>CONTATO</th>
                <th>INTERESSES</th>
                <th>STATUS</th>
                <th>ÚLTIMA NOTIFICAÇÃO</th>
                <th>ÚLTIMA CONFIRMAÇÃO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const visibleInterests = patient.interests.slice(0, 2);
                  const hiddenInterests = patient.interests.length - visibleInterests.length;

                  return (
                    <tr key={patient.id}>
                      <td>
                        <div className="patient-info">
                          <img src={patient.avatar} alt={patient.name} />

                          <div>
                            <strong>{patient.name}</strong>
                            <span>CPF: {patient.cpf}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="patient-contact">
                          <div className="patient-contact__phone">
                            <strong className="table-main-text">{patient.phone}</strong>
                            <span
                              className={`patient-contact-status patient-contact-status--${patient.phoneValid ? 'valid' : 'invalid'}`}
                              title={patient.phoneValid ? 'Telefone válido' : 'Telefone inválido'}
                              aria-label={patient.phoneValid ? 'Telefone válido' : 'Telefone inválido'}
                            >
                              {patient.phoneValid ? (
                                <LuBadgeCheck size={16} />
                              ) : (
                                <LuBadgeAlert size={16} />
                              )}
                            </span>
                          </div>
                          <span className="table-secondary-text">{patient.email}</span>
                        </div>
                      </td>

                      <td>
                        <div className="patient-interests">
                          {visibleInterests.map((interest) => (
                            <span key={interest} className="patient-interest-badge">
                              {interest}
                            </span>
                          ))}

                          {hiddenInterests > 0 && (
                            <span className="patient-interest-badge">+{hiddenInterests}</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className={`patient-status patient-status--${toSlug(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>

                      <td>
                        <strong className="table-main-text">{patient.lastNotificationDate}</strong>
                        <span
                          className={`notification-status notification-status--${toSlug(patient.lastNotificationStatus)}`}
                        >
                          {patient.lastNotificationStatus}
                        </span>
                      </td>

                      <td>
                        {patient.lastConfirmationDate ? (
                          <>
                            <strong className="table-main-text table-main-text--green">
                              {patient.lastConfirmationDate}
                            </strong>
                            <span className="table-secondary-text">
                              {patient.lastConfirmationSpecialty}
                            </span>
                          </>
                          ) : (
                          <>
                            <strong className="table-main-text">Nenhuma confirmação</strong>
                            <span className="table-secondary-text">Sem retorno registrado</span>
                          </>
                        )}
                      </td>

                      <td>
                        <div className="patient-actions">
                          <button
                            type="button"
                            className="patient-action-button patient-action-button--primary"
                          >
                            Detalhes
                          </button>
                          <button type="button" className="patient-action-button">
                            Editar
                          </button>
                          <button type="button" className="patient-action-button">
                            Histórico
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="patients-table__empty">
                    Nenhum paciente encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="patients-table-card__footer">
          <span>
            Exibindo {filteredPatients.length} de {totalPatientsLabel} pacientes
          </span>

          <div className="patients-pagination">
            <button type="button">‹</button>
            <button type="button" className="patients-pagination__active">
              1
            </button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">›</button>
          </div>
        </div>
      </section>
    </main>
  );
}
