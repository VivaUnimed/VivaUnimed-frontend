import "./styles.css";
import AppNav from "../../components/layouts/AppNav";
import AppLogo from "../../components/layouts/AppLogo";
import { useEffect, useRef, useState } from "react";
import {
  getNotificacoesRecentes,
  getVagasTempoReal,
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
  const [showCriticalHero, setShowCriticalHero] = useState(true);
  const [activeTab, setActiveTab] = useState("recentes");
  const [notificacoesRecentes, setNotificacoesRecentes] = useState([]);
  const [vagasTempoReal, setVagasTempoReal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { key: "recentes", label: "Recentes" },
    { key: "vagas", label: "Vagas em tempo real" },
    { key: "exames", label: "Exames e relatorios" },
  ];

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

        const [notificacoes, vagas] = await Promise.all([
          getNotificacoesRecentes(),
          getVagasTempoReal(),
        ]);

        if (!isMounted) {
          return;
        }

        setNotificacoesRecentes(notificacoes || []);
        setVagasTempoReal(vagas || []);
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

  const renderNotificationIcon = (tipo) => {
    const normalizedTipo = (tipo || "").toLowerCase();

    if (normalizedTipo.includes("vaga") || normalizedTipo.includes("agendamento")) {
      return <Bell size={16} />;
    }

    if (normalizedTipo.includes("confirm")) {
      return <ClipboardCheck size={16} />;
    }

    if (normalizedTipo.includes("atraso") || normalizedTipo.includes("alert")) {
      return <TriangleAlert size={16} />;
    }

    if (normalizedTipo.includes("resultado") || normalizedTipo.includes("exame")) {
      return <FileCheck2 size={16} />;
    }

    if (normalizedTipo.includes("saude") || normalizedTipo.includes("hidrat")) {
      return <Droplets size={16} />;
    }

    return <Bell size={16} />;
  };

  const getNotificationClassName = (prioridade, lida) => {
    const normalizedPrioridade = (prioridade || "").toLowerCase();

    if (lida) {
      return "alerta-item";
    }

    if (normalizedPrioridade.includes("alta") || normalizedPrioridade.includes("urgente") || normalizedPrioridade.includes("crítica")) {
      return "alerta-item warning";
    }

    if (normalizedPrioridade.includes("media") || normalizedPrioridade.includes("média")) {
      return "alerta-item";
    }

    return "alerta-item success";
  };

  const getNotificationLabelClassName = (prioridade, lida) => {
    const normalizedPrioridade = (prioridade || "").toLowerCase();

    if (lida) {
      return "alerta-label gray";
    }

    if (normalizedPrioridade.includes("alta") || normalizedPrioridade.includes("urgente") || normalizedPrioridade.includes("crítica")) {
      return "alerta-label red";
    }

    if (normalizedPrioridade.includes("media") || normalizedPrioridade.includes("média")) {
      return "alerta-label gray";
    }

    return "alerta-label green";
  };

  const getNotificationIconClassName = (prioridade, lida) => {
    const normalizedPrioridade = (prioridade || "").toLowerCase();

    if (lida) {
      return "gray";
    }

    if (normalizedPrioridade.includes("alta") || normalizedPrioridade.includes("urgente") || normalizedPrioridade.includes("crítica")) {
      return "red";
    }

    if (normalizedPrioridade.includes("media") || normalizedPrioridade.includes("média")) {
      return "gray";
    }

    return "green";
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "";
    }

    const dateValue = new Date(value);

    if (Number.isNaN(dateValue.getTime())) {
      return value;
    }

    return dateValue.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="alertas-page">
      <div className="alertas-card">

        {/* HEADER */}
        <header className="alertas-header">

          <div className="alertas-brand">

            <AppLogo size="small" />

          </div>

<button
          type="button"
          className={`alerta-toggle-btn ${showCriticalHero ? "on" : "off"}`}
          onClick={() => setShowCriticalHero((current) => !current)}
          aria-pressed={showCriticalHero}
        >
          Balão: {showCriticalHero ? "ON" : "OFF"}
        </button>

        <button className="alertas-search-btn">
          <Search size={18} />
        </button>

        </header>

        {/* CONTENT */}
        <main
          className={`alertas-content ${showCriticalHero ? "" : "hero-hidden"}`}
          ref={contentRef}
        >

          {/* HERO ALERT */}
          {showCriticalHero && (
            <section
              className={`alerta-hero ${
                isCriticalHidden ? "alerta-hero-hidden" : ""
              }`}
            >
              <div className="alerta-hero-top">
                <div className="alerta-dot"></div>
                <span>ALERTA</span>
              </div>

              <h1>Oportunidade Crítica</h1>

              <p>
                Vaga aberta agora em Cardiologia para hoje às 15:45.
                Expira em instantes.
              </p>

              <button className="alerta-hero-btn">
                Aceitar Vaga Agora
                <ChevronRight size={16} />
              </button>

              <div className="alerta-lightning"></div>
            </section>
          )}

          <section className="alertas-tabs" aria-label="Tipos de alertas">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`alertas-tab ${
                  activeTab === tab.key ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </section>

          {activeTab === "recentes" && (
          <>
          {/* SECTION TITLE */}
          <section className="alertas-section-title">

            <h3>Recentes</h3>

            <button>
              Marcar todas como lidas
            </button>

          </section>

          {/* ALERT LIST */}
          <section className="alertas-list">
            {loading && <p>Carregando notificações...</p>}
            {!loading && error && <p>{error}</p>}
            {!loading && !error && notificacoesRecentes.length === 0 && (
              <p>Nenhuma notificação recente.</p>
            )}
            {!loading && !error && notificacoesRecentes.map((notificacao) => (
              <div key={notificacao.id || notificacao.title || notificacao.mensagem} className={getNotificationClassName(notificacao.prioridade, notificacao.lida)}>
                <div className={`alerta-item-icon ${getNotificationIconClassName(notificacao.prioridade, notificacao.lida)}`}>
                  {renderNotificationIcon(notificacao.tipo)}
                </div>

                <div className="alerta-item-content">
                  <div className="alerta-item-top">
                    <span className={`alerta-label ${getNotificationLabelClassName(notificacao.prioridade, notificacao.lida)}`}>
                      {(notificacao.tipo || "NOTIFICAÇÃO").toUpperCase()}
                    </span>

                    <small>{formatDateTime(notificacao.data || notificacao.horario || notificacao.createdAt)}</small>
                  </div>

                  <h4>{notificacao.titulo || notificacao.title || "Notificação"}</h4>

                  <p>{notificacao.mensagem || notificacao.message || "Sem descrição disponível."}</p>

                  {(notificacao.titulo || notificacao.message || notificacao.mensagem) && (
                    <div className="alerta-actions">
                      <button className="btn-green">
                        Ver detalhes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
          </>
          )}

          {activeTab === "vagas" && (
          <>
          {/* LIVE VACANCIES */}
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
                    <button className="btn-accept">
                      {vaga.status || "Disponível"}
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
          </>
          )}

          {activeTab === "exames" && (
          <>
          <section className="alertas-section-title">

            <h3>Exames e relatorios</h3>

            <button>
              Marcar todas como lidas
            </button>

          </section>

          <section className="alertas-list">

            <div className="alerta-item success">

              <div className="alerta-item-icon green">
                <FileCheck2 size={16} />
              </div>

              <div className="alerta-item-content">

                <div className="alerta-item-top">
                  <span className="alerta-label green">
                    RESULTADOS
                  </span>

                  <small>Ontem</small>
                </div>

                <h4>Exames laboratoriais prontos</h4>

                <p>
                  Seus resultados de Hemograma e Glicemia
                  ja estao disponiveis no app.
                </p>

                <button className="alerta-link-btn">
                  Ver resultados
                </button>

              </div>

            </div>

            <div className="alerta-item">

              <div className="alerta-item-icon gray">
                <ClipboardCheck size={16} />
              </div>

              <div className="alerta-item-content">

                <div className="alerta-item-top">
                  <span className="alerta-label gray">
                    RELATORIO
                  </span>

                  <small>2 dias atras</small>
                </div>

                <h4>Relatorio de consulta liberado</h4>

                <p>
                  O resumo da sua consulta com a endocrinologia
                  foi atualizado para revisao.
                </p>

                <button className="alerta-link-btn">
                  Abrir relatorio
                </button>

              </div>

            </div>

            <div className="alerta-item">

              <div className="alerta-item-icon light">
                <Droplets size={16} />
              </div>

              <div className="alerta-item-content">

                <div className="alerta-item-top">
                  <span className="alerta-label light">
                    DICA DE SAUDE
                  </span>

                  <small>Ontem</small>
                </div>

                <h4>Hidratacao e Exames</h4>

                <p>
                  Mantenha-se hidratado para o seu exame
                  de sangue de quinta-feira.
                </p>

              </div>

            </div>

          </section>
          </>
          )}

        </main>

        {/* NAVIGATION */}
        <AppNav className="alertas-bottom-nav" active="alertas" />

      </div>
    </div>
  );
}
