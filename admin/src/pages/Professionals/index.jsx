import {
  LuUserPlus,
  LuSlidersHorizontal,
  LuDownload,
  LuStethoscope,
  LuBrain,
  LuBaby,
  LuCamera,
  LuSun,
  LuClock,
} from 'react-icons/lu';
import './styles.css';
import { NavLink } from 'react-router-dom';

const professionals = [
  {
    id: 1,
    name: 'Dra. Beatriz Santos',
    email: 'beatriz.santos@unimed.com',
    specialty: 'Ginecologia',
    crm: 'CRM-RS 12345',
    status: 'Ativo',
    avatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Dr. Ricardo Oliveira',
    email: 'ricardo.o@unimed.com',
    specialty: 'Ortopedia',
    crm: 'CRM-RS 54321',
    status: 'Ativo',
    avatar:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Dra. Mariana Lima',
    email: 'm.lima@unimed.com',
    specialty: 'Clínica Médica',
    crm: 'CRM-RS 98765',
    status: 'Inativo',
    avatar:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Dr. Felipe Arantes',
    email: 'f.arantes@unimed.com',
    specialty: 'Cardiologia',
    crm: 'CRM-RS 67899',
    status: 'Ativo',
    avatar:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face',
  },
];

export default function Professionals() {
  return (
    <main className="professionals-page">
      <section className="professionals-header">
        <div>
          <h1>Gestão de Profissionais</h1>
          <p>
            Administre a base de médicos e equipe assistencial da sua unidade.
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

            <div className="professionals-table-card__actions">
              <button type="button">
                <LuSlidersHorizontal size={17} />
              </button>

              <button type="button">
                <LuDownload size={17} />
              </button>
            </div>
          </div>

          <div className="professionals-table-wrapper">
            <table className="professionals-table">
              <thead>
                <tr>
                  <th>NOME</th>
                  <th>ESPECIALIDADE</th>
                  <th>CRM/CONSELHO</th>
                  <th>STATUS</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>

              <tbody>
                {professionals.map((professional) => (
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

                    <td>{professional.specialty}</td>

                    <td>
                      <span className="crm-badge">{professional.crm}</span>
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
                ))}
              </tbody>
            </table>
          </div>

          <div className="professionals-table-card__footer">
            <span>Exibindo 4 de 142 profissionais</span>

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
