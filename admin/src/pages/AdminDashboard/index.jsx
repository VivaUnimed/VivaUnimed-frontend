import {
  LuCalendarDays,
  LuClipboard,
  LuTriangleAlert,
  LuSquareCheck,
  LuPlus,
  LuChevronDown,
  LuSparkles,
  LuBuilding,
  LuChartColumn,
} from 'react-icons/lu';
import './styles.css';
import { VscGraph } from 'react-icons/vsc';

const summaryCards = [
  {
    id: 1,
    title: 'Atendimentos Hoje',
    value: '1.284',
    description: 'Meta diária: 50 atendimentos',
    icon: LuCalendarDays,
    variant: 'green',
    badge: '+12%',
  },
  {
    id: 2,
    title: 'Taxa de Ocupação',
    value: '84%',
    description: '',
    icon: LuChartColumn,
    variant: 'light-green',
  },
  {
    id: 3,
    title: 'No-show (Hoje)',
    value: '03',
    description: 'Taxa de falta: 7.1% da agenda',
    icon: LuTriangleAlert,
    variant: 'red',
    badge: '-3%',
  },
];

const priorities = [
  {
    id: 1,
    title: 'Reunião de Alinhamento - Corpo Clínico',
    time: '14:30',
    status: 'green',
  },
  {
    id: 2,
    title: 'Auditoria de Prontuários (Digital)',
    time: '16:00',
    status: 'light',
  },
  {
    id: 3,
    title: 'Atualização de sistema VivaUnimed v2.4',
    time: '22:00',
    status: 'muted',
  },
];

const nextSchedules = [
  {
    id: 1,
    time: '14:30',
    patient: 'Clara Magalhães',
    doctor: 'Dra. Helena Costa',
    category: 'Geral',
  },
  {
    id: 2,
    time: '15:00',
    patient: 'Roberto Alvim',
    doctor: 'Dr. Marcos Dias',
    category: 'Exame',
  },
  {
    id: 3,
    time: '15:45',
    patient: 'Sônia Mendes',
    doctor: 'Dra. Helena Costa',
    category: 'Retorno',
  },
];

export default function StrategicDashboard() {
  return (
    <main className="strategic-dashboard-page">
      <section className="strategic-dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão consolidada da operação VivaUnimed em tempo real.</p>
        </div>

        <div className="strategic-dashboard-date">
          <LuCalendarDays size={14} />
          <span>24 de Maio, 2024</span>
        </div>
      </section>

      <section className="strategic-summary-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className={`strategic-summary-card strategic-summary-card--${card.variant}`}
            >
              <div className="strategic-summary-card__top">
                <div className="strategic-summary-card__icon">
                  <Icon size={20} />
                </div>

                {card.badge && (
                  <span className="strategic-summary-card__badge">
                    {card.badge}
                  </span>
                )}
              </div>

              <h2>{card.title}</h2>
              <strong>{card.value}</strong>
              <p>{card.description}</p>
            </div>
          );
        })}
      </section>

      <section className="strategic-bottom-grid">

        <div className="schedules-card">
          <div className="schedules-card__header">
            <h2>Próximos Horários</h2>
            <p>Fila de espera ativa para hoje</p>
          </div>

          <div className="schedules-list">
            {nextSchedules.map((item) => (
              <div key={item.id} className="schedule-item">
                <div className="schedule-item__time">{item.time}</div>
                <div className="schedule-item__info">
                  <strong>{item.patient}</strong>
                  <span>
                    {item.doctor} • {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
