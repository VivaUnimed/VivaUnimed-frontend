import './styles.css';
import AppNav from '../../components/layouts/AppNav';
import AppLogo from '../../components/layouts/AppLogo';
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Map,
  MapPin,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getConsultaDetalhes } from '../../api/consultasApi';

export default function ConsultaDetalhes() {
  const navigate = useNavigate();
  const { consultaId } = useParams();
  const [consulta, setConsulta] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(consultaId));
  const [errorMessage, setErrorMessage] = useState(
    consultaId ? '' : 'Consulta não informada.',
  );

  useEffect(() => {
    let isMounted = true;

    if (!consultaId) {
      return () => {
        isMounted = false;
      };
    }

    const loadConsulta = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getConsultaDetalhes(consultaId);

        if (isMounted) {
          setConsulta(data);
        }
      } catch (error) {
        if (isMounted) {
          setConsulta(null);
          setErrorMessage(
            error.message || 'Não foi possível carregar os detalhes desta consulta.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadConsulta();

    return () => {
      isMounted = false;
    };
  }, [consultaId]);

  const consultaData = consulta || {};

  return (
    <div className="consulta-detalhes-page">
      <div className="consulta-detalhes-card">
        <header className="consulta-detalhes-header">
          <div className="consulta-detalhes-brand">
            <AppLogo size="small" />
          </div>

          <div className="consulta-detalhes-avatar"></div>
        </header>

        <div className="consulta-detalhes-background"></div>

        <main className="consulta-modal">
          <button
            type="button"
            className="consulta-close-btn"
            onClick={() => navigate('/consultas')}
          >
            <X size={22} />
          </button>

          <section className="consulta-modal-top">
            <div className="consulta-doctor-image"></div>

            <div className="consulta-doctor-info">
              <small>ESPECIALIDADE</small>

              <h2>
                {isLoading
                  ? 'Carregando...'
                  : consultaData.medico || 'Consulta não encontrada'}
              </h2>

              <span>
                {isLoading
                  ? 'Carregando...'
                  : consultaData.especialidade || 'Não informado'}
              </span>
            </div>
          </section>

          {!isLoading && errorMessage && (
            <p className="consulta-status-message">{errorMessage}</p>
          )}

          <section className="consulta-info-grid">
            <div className="consulta-info-box">
              <div className="consulta-info-title">
                <Calendar size={14} />
                <span>DATA</span>
              </div>

              <strong>
                {isLoading
                  ? 'Carregando...'
                  : consultaData.data || 'Não informado'}
              </strong>
            </div>

            <div className="consulta-info-box">
              <div className="consulta-info-title">
                <Clock3 size={14} />
                <span>HORA</span>
              </div>

              <strong>
                {isLoading
                  ? 'Carregando...'
                  : consultaData.hora || 'Não informado'}
              </strong>
            </div>
          </section>

          <section className="consulta-location-box">
            <div>
              <div className="consulta-info-title">
                <MapPin size={14} />
                <span>LOCALIZACAO</span>
              </div>

              <h3>
                {isLoading
                  ? 'Carregando...'
                  : consultaData.local || 'Não informado'}
              </h3>
            </div>

            <button type="button" className="consulta-map-btn">
              <Map size={18} />
            </button>
          </section>

          <section className="consulta-actions">
            <button type="button" className="consulta-confirm-btn">
              <CheckCircle2 size={18} />
              Confirmar Presenca
            </button>

            <button type="button" className="consulta-preparo-btn">
              <ClipboardList size={18} />
              Orientacoes de Preparo
            </button>

            <button type="button" className="consulta-cancel-btn">
              Cancelar Consulta
            </button>
          </section>
        </main>

        <AppNav className="consulta-bottom-nav" active="home" />
      </div>
    </div>
  );
}
