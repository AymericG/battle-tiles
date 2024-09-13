import React from 'react';
import { Player } from '../models/Player';
import { Tile } from '../models/Tile';
import './PlayerPiles.css';

interface PlayerPilesProps {
  player: Player;
  side: 'left' | 'right';
}

export const PlayerPiles: React.FC<PlayerPilesProps> = ({ player, side }) => {
  const renderPile = (pile: Tile[], title: string) => (
    <div className="pile">
      <div className="pile-content">
        <h3>{title}</h3>
        <div className="pile-count">{pile.length}</div>
      </div>
    </div>
  );

  return (
    <div className={`player-piles ${side}`}>
      <h2>{player.name}</h2>
      {renderPile(player.drawPile, 'Draw Pile')}
      {renderPile(player.discardPile, 'Discard Pile')}
    </div>
  );
};