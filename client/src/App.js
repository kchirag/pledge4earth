import React, { useState } from 'react';

import './App.css';
import LeaderContainer from './components/LeaderContainer';
import ViewsContainer from './components/ViewsContainer';
import NewsContainer from './components/NewsContainer';
import ClarifyViewContainer from './components/ClarifyViewContainer';
import ErrorBoundary from './components/ErrorBoundary';
import OrganizationSignup from './components/OrganizationSignup';



function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewUserView = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pledge4Earth</h1>
      </header>
      <div className="top-containers">
        <LeaderContainer />
        <ViewsContainer refreshKey={refreshKey}/>
        <NewsContainer />
      </div>
      <div className="bottom-container">
      <ErrorBoundary>

        <ClarifyViewContainer onNewUserView={handleNewUserView}/>
        <OrganizationSignup />

      </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
