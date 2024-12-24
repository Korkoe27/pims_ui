import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store} from "./redux/store";
import LoadingSpinner from "./components/LoadingSpinner"; // Optional loading spinner for persistor

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 3, retryDelay: 500 } },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* Provide Redux Store */}
    <Provider store={store}>
      {/* Handle Persisted Redux State */}
      {/* <PersistGate loading={<LoadingSpinner />} > */}
        {/* React Query Provider */}
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
