import "./styles.css";
import AppNav from "../../components/layouts/AppNav";
import AppLogo from "../../components/layouts/AppLogo";
import { useEffect, useRef, useState } from "react";
import {
  getAlertaUrgente,
  getNotificacoesRecentes,
  getNotificacoesConsultas,
  getVagasTempoReal,
  getResultadosExames,
  getInformativos,
  aceitarVaga,
} from "../../api/alarmesApi";

import {
  Search,
  Bell,
  TriangleAlert,
  ClipboardCheck,
  Droplets,
  FileCheck2,
  Clock3,
  ChevronRight,
} from "lucide-react";

export default function Alertas() {
  const contentRef = useRef(null);
  const [isCriticalHidden, setIsCriticalHidden] = useState(false);
  const [alertaUrgente, setAlertaUrgente] = useState(null);
  //const [consultas, setConsultas] = useState([]);
  const [vagasTempoReal, setVagasTempoReal] = useState([]);
  //const [exames, setExames] = useState([]);
  //const [informativos, setInformativos] = useState([]);
  const [acceptingVagaId, setAcceptingVagaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const contentNode = contentRef.current;

    const handleScroll = (event) => {
      const currentScrollTop =
        event?.currentTarget === contentNode
          ? contentNode.scrollTop
          : window.scrollY;

      setIsCriticalHidden(currentScrollTop > 48);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    contentNode?.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      contentNode?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAlertData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [alertaUrgenteData, , vagas] = await Promise.all([
          getAlertaUrgente(),
          getNotificacoesRecentes(),
          getNotificacoesConsultas(),
          getVagasTempoReal(),
          getResultadosExames(),
          getInformativos(),
        ]);

        if (!isMounted) {
          return;
        }

        setAlertaUrgente(alertaUrgenteData);
        //setConsultas(consultasList || []);
        setVagasTempoReal(vagas || []);
        //setExames(examesList || []);
        //setInformativos(informativosList || []);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err.message || "Não foi possível carregar os alertas.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAlertData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAceitarVaga = async (vagaId) => {
    if (!vagaId) {
      return;
    }

    try {
      setAcceptingVagaId(vagaId);
      await aceitarVaga(vagaId);
      setVagasTempoReal((current) =>
        current.map((vaga) =>
          vaga.id === vagaId ? { ...vaga, status: 'Aceita' } : vaga
        )
      );
    } catch (err) {
      setError(err.message || 'Não foi possível aceitar a vaga.');
    } finally {
      setAcceptingVagaId(null);
    }
  };

  return (
    <div className="alertas-page">
      <div className="alertas-card">

        {/* HEADER */}
        <header className="alertas-header">

          <div className="alertas-brand">

            <AppLogo size="small" />

          </div>

        <button className="alertas-search-btn">
          <Search size={18} />
        </button>

        </header>

        {/* CONTENT */}
        <main ref={contentRef}>

          {/* HERO ALERT */}
          {alertaUrgente?.ativo === true && (
            <section
              className={`alerta-hero ${
                isCriticalHidden ? "alerta-hero-hidden" : ""
              }`}
            >
              <div className="alerta-hero-top">
                <div className="alerta-dot"></div>
                <span>ALERTA</span>
              </div>

              <h1>{alertaUrgente?.titulo}</h1>

              <p>{alertaUrgente?.mensagem}</p>

              <button
                type="button"
                className="alerta-hero-btn"
                onClick={() => handleAceitarVaga(vagasTempoReal[0]?.id)}
                disabled={acceptingVagaId != null || vagasTempoReal.length === 0}
              >
                {alertaUrgente?.botao}
                <ChevronRight size={16} />
              </button>

              <div className="alerta-lightning"></div>
            </section>
          )}

          <section className="tempo-real-section">

            <div className="tempo-real-title">

              <div className="tempo-real-line"></div>

              <div>
                <h2>Vagas em Tempo Real</h2>

                <p>
                  As oportunidades expiram rapidamente.
                </p>
              </div>

            </div>

            {loading && <p>Carregando vagas...</p>}
            {!loading && error && <p>{error}</p>}
            {!loading && !error && vagasTempoReal.length === 0 && (
              <p>Nenhuma vaga disponível no momento.</p>
            )}
            {!loading && !error && vagasTempoReal.map((vaga) => (
              <div key={vaga.id || vaga.especialidade || vaga.profissional} className={`vaga-card ${vaga.status?.toLowerCase() === "urgente" ? "urgent" : vaga.status?.toLowerCase() === "disponivel" ? "success" : "neutral"}`}>
                <div className="vaga-profile">
                  <div className="vaga-profile-image"></div>

                  <div>
                    <h4>{vaga.profissional || vaga.professional || "Profissional"}</h4>
                    <span>{(vaga.especialidade || vaga.specialty || "ESPECIALIDADE").toUpperCase()}</span>
                  </div>
                </div>

                <div className="vaga-footer">
                  <div className="vaga-time">
                    <small>HORÁRIO DISPONÍVEL</small>

                    <div>
                      <Clock3 size={16} />
                      <strong>{vaga.horario || vaga.time || "--:--"}</strong>
                    </div>
                  </div>

                  <div className="vaga-buttons">
                    <button
                      type="button"
                      className="btn-accept"
                      onClick={() => handleAceitarVaga(vaga.id)}
                      disabled={acceptingVagaId === vaga.id}
                    >
                      {acceptingVagaId === vaga.id
                        ? 'Aceitando...'
                        : vaga.status || 'Disponível'}
                    </button>
                    {vaga.prioridade && (
                      <button className="btn-reject">
                        {vaga.prioridade}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

          </section>

        </main>

        {/* NAVIGATION */}
        <AppNav className="alertas-bottom-nav" active="alertas" />

      </div>
    </div>
  );
}
