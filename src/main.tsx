import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Diagnostico from './Diagnostico.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Diagnostico />
  </StrictMode>,
);
