import {
  LuCalendarDays,
  LuChevronDown,
  LuClock3,
  LuMapPin,
  LuMoveRight,
} from 'react-icons/lu';
import './styles.css';

const professionals = [
  'Dra. Mariana Lopes',
  'Dr. Ricardo Almeida',
  'Dra. Heloisa Santos',
];

const specialties = ['Cardiologia', 'Ortopedia', 'Pediatria'];

const units = ['Unidade Centro', 'Unidade Zona Sul', 'Unidade Norte'];

export default function NoShowRegistration() {
  return (
    <main className="no-show-registration-page">
      <section className="no-show-registration-header">
        <div>
          <span className="no-show-registration-header__eyebrow">
            Disponibilidade imediata
          </span>
          <h1>Nova Vaga No-Show</h1>
          <p>
            Preencha as informações para registrar a disponibilidade imediata.
          </p>
        </div>
      </section>

      <section className="no-show-registration-card">
        <form
          className="no-show-registration-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="no-show-registration-field no-show-registration-field--full">
            <span>Profissional de Saúde</span>
            <div className="no-show-registration-input no-show-registration-input--select">
              <select defaultValue="">
                <option value="" disabled>
                  Selecione o profissional
                </option>
                {professionals.map((professional) => (
                  <option key={professional} value={professional}>
                    {professional}
                  </option>
                ))}
              </select>
              <LuChevronDown size={18} />
            </div>
          </label>

          <label className="no-show-registration-field no-show-registration-field--full">
            <span>Especialidade</span>
            <div className="no-show-registration-input no-show-registration-input--select">
              <select defaultValue="">
                <option value="" disabled>
                  Selecione a especialidade
                </option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              <LuChevronDown size={18} />
            </div>
          </label>

          <label className="no-show-registration-field">
            <span>Unidade</span>
            <div className="no-show-registration-input no-show-registration-input--select">
              <select defaultValue="">
                <option value="" disabled>
                  Selecione a unidade
                </option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <LuMapPin
                size={17}
                className="no-show-registration-input__icon no-show-registration-input__icon--aux"
              />
              <LuChevronDown size={18} />
            </div>
          </label>

          <label className="no-show-registration-field">
            <span>Data da Vaga</span>
            <div className="no-show-registration-input">
              <input type="text" placeholder="mm/dd/yyyy" />
              <LuCalendarDays
                size={18}
                className="no-show-registration-input__icon"
              />
            </div>
          </label>

          <label className="no-show-registration-field">
            <span>Horário Específico</span>
            <div className="no-show-registration-input">
              <input type="text" placeholder="--:-- --" />
              <LuClock3
                size={18}
                className="no-show-registration-input__icon"
              />
            </div>
          </label>

          <label className="no-show-registration-field">
            <span>Tipo de Vaga</span>
            <div className="no-show-registration-input no-show-registration-input--alert">
              <input type="text" value="No-Show (Ausência)" readOnly />
            </div>
          </label>

          <div className="no-show-registration-actions">
            <button type="submit" className="no-show-registration-submit">
              Cadastrar Vaga
              <LuMoveRight size={18} />
            </button>

            <p>
              A vaga será notificada imediatamente aos pacientes na lista de
              espera.
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
