import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./bootstrap.min.css";
import "./Game.css";

const Spike = ({index,board,direction,color}) => {
    return (
        <div className="col-1">
            <div className={`triangle-${direction}-${color} triangle-${direction}`}>
                {
                    [...Array(Math.abs(board[index])).keys()].map((value,i) => {
                        return <div key={i} className={`circle circle-${board[index]<0 ? "white" : "black"}`}></div>
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
    const [timer, setTimer] = useState(null);

    useEffect(() => {

        const fetchGameData = async () => {
            await fetch(`http://localhost:5000/api/game/${gameCode}`, {method:"GET"})
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setBoard(data.board);
                setStart(data.players.length === 2);
            });
        } 
        fetchGameData();
        setTimer(setInterval(() => fetchGameData(), 3000));
        return () => { clearInterval(timer); setTimer(null); }
    },[gameCode]);

    return (
        <div className="container-fluid">
            <h1>Game {gameCode}</h1>
            {!start ? 
                <div className="alert alert-danger" role="alert">
                    Waiting for other player...
                </div>
            :
            null
            }
            <div className="row board-row">
                {board.slice(0,12).map((value, index) => {
                    return <Spike key={index} index={index} board={board.slice(0,12)} direction="down" color={index%2===0 ? "dark" : "light" }/>
                })}
            </div>
            
            <div className="row board-row">
                {board.slice(12,24).map((value, index) => {
                    return <Spike key={index} index={index} board={board.slice(12,24)} direction="up" color={index%2===0 ? "dark" : "light" }/>
                })}
            </div>
        </div>
    );
}

export default Game;