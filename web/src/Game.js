import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./bootstrap.min.css";
import "./Game.css";

const Spike = ({index,board,direction,color}) => {
    return (
        <div className="col-1">
            <div className={`spike triangle-${direction}-${color} triangle-${direction}`}>
                {
                    [...Array(Math.abs(board[index])).keys()].map((value,i) => {
                        return <div key={i} className={`piece piece-${direction} circle circle-${board[index]<0 ? "white" : "black"}`}></div>
                    })
                }
            </div>
        </div>
    );
}

const Game = () => {

    let { gameCode } = useParams();

    const [board, setBoard] = useState([]);
    const [start, setStart] = useState(false);
    const [players, setPlayers] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    useEffect(() => {

        const fetchGameData = async () => {
            await fetch(`http://localhost:5000/api/game/${gameCode}`, {method:"GET"})
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setBoard(data.board);
                setPlayers(data.players)
                setStart(data.players.length === 2);
                setCurrentPlayer( (data.players.length === 2) ? data.players[data.current_player] : "waiting for player's to join");
            });
        } 
        fetchGameData();
        let timer = setInterval(() => fetchGameData(), 3000);
        return () => { clearInterval(timer); timer=null; }
    },[gameCode]);

    useEffect(() => {
        document.title = `${currentPlayer}'s turn`;
    },[currentPlayer]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="mx-auto">
                    <h1>Game {gameCode}</h1>
                </div>
            </div>
            {!start ? 
                <div className="row">
                    <div className="mx-auto alert alert-danger" role="alert">
                        Waiting for other player...
                    </div>
                </div>
            :
            <div className="mainGame">
                <div className="row">
                    <div className="mx-auto">
                        <h4>{players[0]} vs {players[1]}</h4>
                    </div>
                </div>
                <div className="board">
                    <div className="row" style={{marginBottom:"70px"}}>
                        {board.slice(0,12).map((value, index) => {
                            return <Spike key={index} index={index} board={board.slice(0,12)} direction="down" color={index%2===0 ? "dark" : "light" }/>
                        })}
                    </div>
                    <div className="row">
                        {board.slice(12,24).reverse().map((value, index) => {
                            return <Spike key={11-index} index={11-index} board={board.slice(12,24)} direction="up" color={index%2!==0 ? "dark" : "light" }/>
                        })}
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

export default Game;