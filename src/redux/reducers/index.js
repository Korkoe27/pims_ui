import { combineReducers } from "redux";
import { patientsReducer } from "./patients";
import { appointmentsReducer } from "./appointments";

const rootReducer = combineReducers({
  patients: patientsReducer,
  appointments: appointmentsReducer,
});

export default rootReducer;
