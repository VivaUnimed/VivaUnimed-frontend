import "./styles.css";
import AppNav from "../../components/layouts/AppNav";
import AppLogo from "../../components/layouts/AppLogo";
import { createElement, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Search,
  Stethoscope,
  HeartPulse,
  Baby,
  Plus,
  Minus,
  Bone,
  Brain,
  Eye as EyeIcon,
  Smile,
  Activity,
  Syringe,
  Ear,
  ScanHeart,
} from "lucide-react";
import { addInteresse, getInteresses, removeInteresse } from "../../api/interessesApi";

const iconMap = {
  Stethoscope,
  HeartPulse,
  Baby,
  Bone,
  Brain,
  EyeIcon,
  Smile,
  Activity,
  Syringe,
  Ear,
  ScanHeart,
};

const getIconComponent = (iconName) => iconMap[iconName] || Stethoscope;
const normalizeInterestId = (value) => String(value);

export default function Interesses() {
  const [interesses, setInteresses] = useState([]);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  const [queuedInterests, setQueuedInterests] = useState([]);
  const [isLoadingInteresses, setIsLoadingInteresses] = useState(false);

  const loadInteresses = async () => {
    try {
      setIsLoadingInteresses(true);
      const data = await getInteresses();
      setInteresses(data);
    } catch (error) {
      toast.error(error.message || "Não foi possível carregar seus interesses no momento.");
    } finally {
      setIsLoadingInteresses(false);
    }
  };

  useEffect(() => {
    void loadInteresses();
  }, []);

  const selectedInterests = interesses.filter(({ selected }) => selected);
  const selectedCount = selectedInterests.length;
  const selectedCards = selectedInterests;
  const unselectedInterests = interesses.filter(({ selected }) => !selected);
  const visibleTags = showAllSpecialties
    ? unselectedInterests
    : unselectedInterests.slice(0, 8);

  const handleToggleInterest = async (interestId) => {
    const normalizedId = normalizeInterestId(interestId);
    const existingInterest = interesses.find(({ id }) => normalizeInterestId(id) === normalizedId);

    if (!existingInterest) {
      return;
    }

    if (existingInterest.selected) {
      try {
        await removeInteresse(normalizedId);
        await loadInteresses();
        setQueuedInterests((currentQueue) =>
          currentQueue.filter((queuedId) => normalizeInterestId(queuedId) !== normalizedId)
        );
      } catch (error) {
        toast.error(error.message || "Não foi possível remover o interesse no momento.");
      }

      return;
    }

    const previousInteresses = interesses;

    setInteresses((currentInteresses) =>
      currentInteresses.map((interest) =>
        normalizeInterestId(interest.id) === normalizedId
          ? { ...interest, selected: true }
          : interest
      )
    );

    try {
      await addInteresse(normalizedId);
      await loadInteresses();
    } catch (error) {
      setInteresses(previousInteresses);
      toast.error(error.message || "Não foi possível adicionar o interesse no momento.");
    }
  };

  const handleEnterQueue = () => {
    setQueuedInterests(selectedInterests.map(({ id }) => normalizeInterestId(id)));
  };

  const handleLeaveQueue = () => {
    setQueuedInterests([]);
  };

  const displayedSelectedCards = selectedCards.filter(
    ({ id }) => !queuedInterests.includes(normalizeInterestId(id))
  );

  const removeFromQueue = (interestId) => {
    setQueuedInterests((currentQueue) =>
      currentQueue.filter((queuedId) => normalizeInterestId(queuedId) !== normalizeInterestId(interestId))
    );
  };

  return (
    <div className="interesses-page">
      <div className="interesses-card">
        <header className="interesses-header">
          <div className="interesses-brand">
            <AppLogo size="small" />
          </div>

          <button type="button" className="interesses-search-btn">
            <Search size={18} />
          </button>
        </header>

        <main className="interesses-content">
          <section className="interesses-title-group">
            <h1>Fila Inteligente</h1>

            <p>
              Selecione as especialidades de seu interesse. Avisaremos
              instantaneamente quando surgir uma vaga prioritaria para voce.
            </p>
          </section>

          {queuedInterests.length > 0 && (
            <div className="fila-header">
              <span>Na fila de espera</span>
              <button type="button" className="fila-exit-btn" onClick={handleLeaveQueue}>Sair da fila</button>
            </div>
          )}

          <section className="fila-container">
            {queuedInterests.map((id) => {
              const item = interesses.find(
                (interest) => normalizeInterestId(interest.id) === normalizeInterestId(id)
              );
              if (!item) return null;
              const { name, status, iconName } = item;
              const IconComponent = getIconComponent(iconName);

              return (
                <div key={id} className="fila-card">
                  <div className="fila-left">
                    <div className="interesse-icon green">{createElement(IconComponent, { size: 16 })}</div>
                    <div className="fila-info">
                      <strong>{name}</strong>
                      <span className="fila-status">{status}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="fila-exit-single"
                    aria-label={`Sair da fila ${name}`}
                    onClick={() => removeFromQueue(id)}
                  >
                    Sair
                  </button>
                </div>
              );
            })}
          </section>

          <section className="interesses-grid">
            {displayedSelectedCards.map(({ id, name, status, iconName }) => {
              const IconComponent = getIconComponent(iconName);

              return (
                <div key={id} className="interesse-card active">
                  <div className="interesse-top-row">
                    <div className="interesse-icon green">{createElement(IconComponent, { size: 18 })}</div>

                    <button
                      type="button"
                      className="interesse-remove-btn"
                      aria-label={`Remover ${name}`}
                      onClick={() => {
                        void handleToggleInterest(id);
                      }}
                    >
                      <Minus size={16} />
                    </button>
                  </div>

                  <div className="interesse-content-box">
                    <h3>{name}</h3>
                    <span>{status}</span>
                  </div>
                </div>
              );
            })}

            {displayedSelectedCards.length === 0 && !isLoadingInteresses && (
              <div className="interesse-empty">Selecione um interesse abaixo</div>
            )}
          </section>

          <section className="interesses-tags">
            {visibleTags.map(({ id, name, iconName, selected }) => {
              const IconComponent = getIconComponent(iconName);

              return (
                <button
                  key={id}
                  type="button"
                  className="tag-button"
                  aria-pressed={selected}
                  onClick={() => {
                    void handleToggleInterest(id);
                  }}
                >
                  <div className="tag-icon">{IconComponent ? createElement(IconComponent, { size: 14 }) : null}</div>
                  <span className="tag-name">{name}</span>
                  <div className="tag-action">
                    <Plus size={14} />
                  </div>
                </button>
              );
            })}
          </section>

          <button
            type="button"
            className={`interesses-toggle-btn ${showAllSpecialties ? "active" : ""}`}
            aria-expanded={showAllSpecialties}
            onClick={() => setShowAllSpecialties((isShowing) => !isShowing)}
          >
            <span>{showAllSpecialties ? "Ver menos" : "Ver todas"}</span>
            <Plus size={16} />
          </button>

          <button
            type="button"
            className="interesses-main-btn"
            disabled={selectedCount === 0}
            onClick={handleEnterQueue}
          >
            {selectedCount > 0 ? `Entrar na Fila (${selectedCount})` : "Selecione interesses"}
          </button>
        </main>

        <AppNav className="interesses-bottom-nav" active="interesses" />
      </div>
    </div>
  );
}
