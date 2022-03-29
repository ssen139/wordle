import React from 'react'
import { Game } from './Game';
import { HeaderBar } from './HeaderBar';
import '../Styling/App.css';

export const App = () => {
  return (
    <div className="Body-css">
      <HeaderBar />
      <Game />
    </div>
  );
}
