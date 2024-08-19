import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';

// contexts
import { AuthContextProvider } from './context/AuthContext';
import { TripPlanContextProvider } from './context/TripPlanContext';
import { AdventureCanvaseContextProvider } from './context/AdventureCanvaseContext';
import { CurrAdventureCanvaseContextProvider } from './context/CurrAdventureCanvaseContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <AdventureCanvaseContextProvider>
        <CurrAdventureCanvaseContextProvider>
          <TripPlanContextProvider>
            <App />
          </TripPlanContextProvider>
        </CurrAdventureCanvaseContextProvider>
      </AdventureCanvaseContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
