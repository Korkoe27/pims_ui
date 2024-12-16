// Action Types
const SET_APPOINTMENTS = "SET_APPOINTMENTS";
const SELECT_APPOINTMENT = "SELECT_APPOINTMENT";
const CLEAR_SELECTED_APPOINTMENT = "CLEAR_SELECTED_APPOINTMENT";

const FETCH_APPOINTMENTS_START = "FETCH_APPOINTMENTS_START";
const FETCH_APPOINTMENTS_SUCCESS = "FETCH_APPOINTMENTS_SUCCESS";
const FETCH_APPOINTMENTS_FAILURE = "FETCH_APPOINTMENTS_FAILURE";

// Action Creators
export const setAppointments = (appointments) => ({
  type: SET_APPOINTMENTS,
  payload: appointments,
});

export const selectAppointment = (appointment) => ({
  type: SELECT_APPOINTMENT,
  payload: appointment,
});

export const clearSelectedAppointment = () => ({
  type: CLEAR_SELECTED_APPOINTMENT,
});

export const fetchAppointmentsStart = () => ({
  type: FETCH_APPOINTMENTS_START,
});

export const fetchAppointmentsSuccess = (appointments) => ({
  type: FETCH_APPOINTMENTS_SUCCESS,
  payload: appointments,
});

export const fetchAppointmentsFailure = (error) => ({
  type: FETCH_APPOINTMENTS_FAILURE,
  payload: error,
});

// Initial State
const initialState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
};

// Reducer
export const appointmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_APPOINTMENTS_START:
      return { ...state, loading: true, error: null };
    case FETCH_APPOINTMENTS_SUCCESS:
      return { ...state, loading: false, appointments: action.payload };
    case FETCH_APPOINTMENTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SET_APPOINTMENTS:
      return { ...state, appointments: action.payload };
    case SELECT_APPOINTMENT:
      return { ...state, selectedAppointment: action.payload };
    case CLEAR_SELECTED_APPOINTMENT:
      return { ...state, selectedAppointment: null };

    default:
      return state;
  }
};
