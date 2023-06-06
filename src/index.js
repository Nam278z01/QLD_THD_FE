import React from 'react';
import App from './App.jsx';
import './i18n/i18n';

import 'bootstrap/dist/css/bootstrap.min.css';


import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
