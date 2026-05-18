import { useState } from 'react';
import {
  LuUserPlus,
  LuSlidersHorizontal,
  LuSearch,
  LuChevronDown,
  LuRefreshCw,
} from 'react-icons/lu';
import './styles.css';
import { NavLink } from 'react-router-dom';

const professionals = [
  {
    id: 1,
    name: 'Dra. Beatriz Santos',
    email: 'beatriz.santos@unimed.com',
    specialties: ['Ginecologia', 'Obstetrícia'],
    crm: 'CRM-RS 12345',
    unit: 'Unidade Centro',
    status: 'Ativo',
    avatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Dr. Ricardo Oliveira',
    email: 'ricardo.o@unimed.com',
    specialties: ['Ortopedia', 'Clínica Médica'],
    crm: 'CRM-RS 54321',
    unit: 'Unidade Cassino',
    status: 'Ativo',
    avatar:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Dra. Mariana Lima',
    email: 'm.lima@unimed.com',
    specialties: ['Clínica Médica', 'Cardiologia', 'Pediatria'],
    crm: 'CRM-RS 98765',
    unit: 'Unidade São Pedro',
    status: 'Inativo',
    avatar:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Dr. Felipe Arantes',
    email: 'f.arantes@unimed.com',
    specialties: ['Cardiologia', 'Dermatologia', 'Clínica Médica'],
    crm: 'CRM-RS 67899',
    unit: 'Unidade Centro',
    status: 'Ativo',
    avatar:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face',
  },
];

const totalProfessionalsLabel = '142';
const statusOptions = ['Ativo', 'Inativo'];
const specialtyOptions = [
  ...new Set(professionals.flatMap((professional) => professional.specialties)),
];
const unitOptions = [...new Set(professionals.map((professional) => professional.unit))];

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function Professionals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');

  const normalizedSearchTerm = normalizeText(searchTerm.trim());
  const hasActiveFilters = Boolean(
    normalizedSearchTerm || statusFilter || specialtyFilter || unitFilter
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSpecialtyFilter('');
    setUnitFilter('');
  };

  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch =
      !normalizedSearchTerm ||
      [
        professional.name,
        professional.email,
        professional.crm,
        ...professional.specialties,
      ].some((value) => normalizeText(value).includes(normalizedSearchTerm));

    const matchesStatus =
      !statusFilter || professional.status === statusFilter;
    const matchesSpecialty =
      !specialtyFilter || professional.specialties.includes(specialtyFilter);
    const matchesUnit = !unitFilter || professional.unit === unitFilter;

    return matchesSearch && matchesStatus && matchesSpecialty && matchesUnit;
  });

  return (
    <main className="professionals-page">
      <section className="professionals-header">
        <div>
          <h1>Gestão de Profissionais</h1>
          <p>
            Gerencie profissionais e especialidades utilizados no cadastro de
            vagas remanescentes.
          </p>
        </div>

        <NavLink to="/professionals/new">
          <button type="button" className="professionals-header__button">
            <LuUserPlus size={18} />
            Cadastrar Profissional
          </button>
        </NavLink>
      </section>

      <section className="professionals-content">
        <div className="professionals-table-card">
          <div className="professionals-table-card__header">
            <h2>Lista de Profissionais</h2>
          </div>

          <div className="professionals-filters">
            <div className="professionals-filters__search">
              <LuSearch size={18} />
              <input
                id="professionals-search"
                type="search"
                placeholder="Buscar por nome, especialidade, CRM ou e-mail..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <label className="professionals-filter-button">
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
              <LuChevronDown
                size={16}
                className="professionals-filter-button__chevron"
              />
            </label>

            <label className="professionals-filter-button">
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
              <LuChevronDown
                size={16}
                className="professionals-filter-button__chevron"
              />
            </label>

            <label className="professionals-filter-button">
              <LuSlidersHorizontal size={16} />
              <select
                value={unitFilter}
                onChange={(event) => setUnitFilter(event.target.value)}
                aria-label="Filtrar por unidade"
              >
                <option value="">Unidade</option>
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <LuChevronDown
                size={16}
                className="professionals-filter-button__chevron"
              />
            </label>

            <button
              type="button"
              className="professionals-filter-clear-button"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              <LuRefreshCw size={16} />
              Limpar filtros
            </button>
          </div>

          <div className="professionals-table-wrapper">
            <table className="professionals-table">
              <thead>
                <tr>
                  <th>NOME</th>
                  <th>ESPECIALIDADES</th>
                  <th>CRM</th>
                  <th>UNIDADE</th>
                  <th>STATUS</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>

              <tbody>
                {filteredProfessionals.length > 0 ? (
                  filteredProfessionals.map((professional) => {
                    const visibleSpecialties =
                      professional.specialties.slice(0, 2);
                    const remainingSpecialties =
                      professional.specialties.length - visibleSpecialties.length;

                    return (
                      <tr key={professional.id}>
                        <td>
                          <div className="professional-info">
                            <img
                              src={professional.avatar}
                              alt={professional.name}
                            />

                            <div>
                              <strong>{professional.name}</strong>
                              <span>{professional.email}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="specialties-list">
                            {visibleSpecialties.map((specialty) => (
                              <span key={specialty} className="specialty-badge">
                                {specialty}
                              </span>
                            ))}

                            {remainingSpecialties > 0 ? (
                              <span className="specialty-badge specialty-badge--more">
                                +{remainingSpecialties}
                              </span>
                            ) : null}
                          </div>
                        </td>

                        <td>
                          <span className="crm-badge">{professional.crm}</span>
                        </td>

                        <td>
                          <span className="professional-unit">
                            {professional.unit}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              professional.status === 'Ativo'
                                ? 'status-badge status-badge--active'
                                : 'status-badge status-badge--inactive'
                            }
                          >
                            {professional.status}
                          </span>
                        </td>

                        <td>
                          <div className="professional-actions">
                            <button
                              type="button"
                              className="professional-actions__edit"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className={
                                professional.status === 'Ativo'
                                  ? 'professional-actions__disable'
                                  : 'professional-actions__enable'
                              }
                            >
                              {professional.status === 'Ativo'
                                ? 'Desativar'
                                : 'Ativar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="professionals-table__empty">
                      Nenhum profissional encontrado com os filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="professionals-table-card__footer">
            <span>
              Exibindo {filteredProfessionals.length} de {totalProfessionalsLabel}{' '}
              profissionais
            </span>

            <div className="pagination">
              <button type="button">‹</button>
              <button type="button" className="pagination__active">
                1
              </button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button">›</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
