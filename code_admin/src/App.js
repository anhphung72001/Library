import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.scss';
import AppRouter from './router';

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
