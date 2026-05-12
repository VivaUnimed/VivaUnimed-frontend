import { useReducer } from 'react';
import { professionalReducer } from './professionalReducer';
import { professionalInitialState } from './professionalInitialState';
import { professionalContext as ProfessionalContext } from './professionalContext.js';
import * as professionalsApi from '../../api/professionals.js';

export default function ProfessionalProvider({ children }) {
  const [professionalState, professionalDispatch] = useReducer(
    professionalReducer,
    professionalInitialState,
  );

  const getProfessionals = async () => {
    return await professionalsApi.getAllProfessionals(professionalDispatch);
  };

  const createProfessional = async (newProfessional) => {
    return await professionalsApi.createProfessional(
      newProfessional,
      professionalDispatch,
    );
  };

  const updateProfessional = async (updatedProfessional, id) => {
    return await professionalsApi.updateProfessional(
      updatedProfessional,
      id,
      professionalDispatch,
    );
  };

  const deleteProfessional = async (id) => {
    return await professionalsApi.deleteProfessional(id, professionalDispatch);
  };

  return (
    <ProfessionalContext.Provider
      value={{
        professionalState,
        professionalDispatch,
        getProfessionals,
        createProfessional,
        updateProfessional,
        deleteProfessional,
      }}
    >
      {children}
    </ProfessionalContext.Provider>
  );
}
