import React from 'react';
import { Player } from '../models/Player';
import { TileComponent } from './TileComponent';

interface PlayerPilesProps {
  player: Player;
  side: 'left' | 'right';
  showHand: boolean;
}

export const PlayerPiles: React.FC<PlayerPilesProps> = ({ player, side, showHand }) => {
  return (
    <div className={`player-piles ${side}`}>
      <h3>{player.name}</h3>
      <div className="pile draw-pile">
        <h4>Draw Pile ({player.drawPile.length})</h4>
        <div className="pile-tiles">
          {player.drawPile.map((tile, index) => (
            <TileComponent key={index} tile={tile} />
          ))}
        </div>
      </div>
      <div className="pile discard-pile">
        <h4>Discard Pile ({player.discardPile.length})</h4>
        <div className="pile-tiles">
          {player.discardPile.map((tile, index) => (
            <TileComponent key={index} tile={tile} />
          ))}
        </div>
      </div>
      {showHand && (
        <div className="hand">
          <h4>Hand ({player.hand.length})</h4>
          <div className="hand-tiles">
            {player.hand.map((tile, index) => (
              <TileComponent key={index} tile={tile} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};