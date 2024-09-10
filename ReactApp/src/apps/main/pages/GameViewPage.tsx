import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

interface GameViewPageProps {
  id: number;
  title: string;
  description: string;
  emulador: string;
  image_base64: string;
}

const GameViewPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<GameViewPageProps | null>(null);
  const navigate = useNavigate();

  const fetchGameDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/roms/detail/`, {
        params: { rom_id: gameId },
      });
      setGame(response.data[0]);
    } catch (error) {
      console.error('Erro ao buscar detalhes do jogo:', error);
    }
  };

  const handlePlayGame = () => {
    navigate(`/play/${gameId}`);
  };

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  if (!game) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>title : {game.title}</h1>
      <p>description : {game.description}</p>
      <p><strong>Emulador:</strong> {game.emulador}</p>
      
      {game.image_base64 && (
        <img
          src={`data:image/jpeg;base64,${game.image_base64}`}
          alt={game.title}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}

      <button onClick={handlePlayGame} style={{ marginRight: '10px' }}>
        <FontAwesomeIcon icon={faPlay} /> Jogar
      </button>
    </div>
  );
};

export default GameViewPage;
