import './styles/style.css';
import { initApp } from './App';

document.addEventListener('DOMContentLoaded', () => {
  initApp().catch(console.error);
});
