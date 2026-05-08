import {
  LuUserPlus,
  LuCamera,
  LuSun,
  LuClock,
  LuChevronLeft,
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function CreateProfessional() {
  const navigate = useNavigate();

  return (
    <main className="professionals-page">
      <section className="professionals-header">
        <div>
          <button
            onClick={() => navigate('/professionals')}
            style={{
              background: 'none',
              border: 'none',
              color: '#008256',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            <LuChevronLeft size={20} /> Voltar para listagem
          </button>
          <h1>Novo Profissional</h1>
          <p>Insira os dados cadastrais e profissionais do novo integrante.</p>
        </div>
      </section>

      <section className="professional-form-card">
        {/* O formulário permanece o mesmo que estava no seu index.jsx */}
        <form className="professional-form" >
          {/* ... colunas de dados pessoais, atuação e perfil ... */}

          <div className="professional-form__column">
            <h3>DADOS PESSOAIS</h3>
            <label>
              Nome Completo
              <input type="text" placeholder="Ex: Dr. João da Silva" />
            </label>
            <label>
              E-mail Corporativo
              <input type="email" placeholder="nome@unimed.com" />
            </label>
            <label>
              Telefone / WhatsApp
              <input type="text" placeholder="(53) 00000-0000" />
            </label>
          </div>

          <div className="professional-form__column">
            <h3>ATUAÇÃO PROFISSIONAL</h3>
            <label>
              Especialidade
              <select defaultValue="">
                <option value="" disabled>
                  Selecione uma especialidade
                </option>
                <option value="cardiologia">Cardiologia</option>
                <option value="neurologia">Neurologia</option>
                <option value="pediatria">Pediatria</option>
                <option value="ginecologia">Ginecologia</option>
              </select>
            </label>
            <div className="professional-form__row">
              <label>
                Nº Registro (CRM)
                <input type="text" placeholder="00000" />
              </label>
              <label>
                UF
                <select defaultValue="RS">
                  <option value="RS">RS</option>
                  <option value="SC">SC</option>
                  <option value="PR">PR</option>
                </select>
              </label>
            </div>
            <label>
              Carga Horária Semanal
              <input type="number" placeholder="40" />
            </label>
          </div>

          <div className="professional-form__column">
            <h3>PERFIL E DOCUMENTOS</h3>
            <div className="upload-card">
              <div className="upload-card__icon">
                <LuCamera size={24} />
              </div>
              <div>
                <strong>Foto de Perfil</strong>
                <span>PNG ou JPG até 2MB.</span>
                <span>Utilizada na agenda.</span>
              </div>
            </div>

            <div className="status-field">
              <span>Status Inicial</span>
              <div className="status-field__options">
                <label>
                  <input type="radio" name="status" defaultChecked />
                  Ativo
                </label>
                <label>
                  <input type="radio" name="status" />
                  Inativo
                </label>
              </div>
            </div>
          </div>

          {/* NOVA SEÇÃO: HORÁRIO DE ATENDIMENTO */}
          <div className="professional-form__schedule">
            <div className="schedule-header">
              <h3>HORÁRIO DE ATENDIMENTO</h3>
              <span className="weekly-badge">PADRÃO SEMANAL</span>
            </div>

            <div className="days-selector">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((day) => (
                <button key={day} type="button" className="day-btn active">
                  {day}
                </button>
              ))}
              {['Sáb', 'Dom'].map((day) => (
                <button key={day} type="button" className="day-btn">
                  {day}
                </button>
              ))}
            </div>

            <div className="time-periods">
              <div className="time-period">
                <div className="time-period__title">
                  <LuSun size={18} />
                  <span>Período Manhã</span>
                </div>
                <div className="time-inputs">
                  <input type="text" defaultValue="08:00 AM" />
                  <span>até</span>
                  <input type="text" defaultValue="12:00 PM" />
                </div>
              </div>

              <div className="time-period">
                <div className="time-period__title">
                  <LuClock size={18} />
                  <span>Período Tarde</span>
                </div>
                <div className="time-inputs">
                  <input type="text" defaultValue="01:30 PM" />
                  <span>até</span>
                  <input type="text" defaultValue="06:00 PM" />
                </div>
              </div>
            </div>

            <div className="schedule-notice">
              <LuClock size={16} />
              <span>
                Estes horários serão replicados para todos os dias úteis
                selecionados acima.
              </span>
            </div>
          </div>

          {/* ... seção de horários ... */}

          <div className="form-buttons-container">
            <button
              type="button"
              className="form-buttons__cancel"
              onClick={() => navigate('/profissionais')}
            >
              Cancelar
            </button>
            <button type="submit" className="form-buttons__save">
              Salvar Cadastro
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
