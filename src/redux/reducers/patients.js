// actions
const SET_PATIENTS = "SET_PATIENTS";
const SELECT_PATIENT = "SELECT_PATIENT";
const CLEAR_SELECTED_PATIENT = "CLEAR_SELECTED_PATIENT";

// action creators
export const setPatients = (patients) => ({
  type: SET_PATIENTS,
  payload: patients,
});

export const selectPatient = (patient) => ({
  type: SELECT_PATIENT,
  payload: patient,
});

export const clearSelectedPatient = () => ({
  type: CLEAR_SELECTED_PATIENT,
});

// initial state
const initialState = {
  patients: [],
  selectedPatient: null,
};

// reducer
export const patientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PATIENTS:
      return { ...state, patients: action.payload };
    case SELECT_PATIENT:
      return { ...state, selectedPatient: action.payload };
    case CLEAR_SELECTED_PATIENT:
      return { ...state, selectedPatient: null };
    default:
      return state;
  }
};
