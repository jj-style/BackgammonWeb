import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Spike } from './Spike';
import io from 'socket.io-client';
import "../../bootstrap.min.css";
import "./Game.css";


const socket = io.connect('http://localhost:5000');

const Game = ({gameCode, name}) => {

    const history = useHistory();
    
    if (gameCode === null || name === null) {
        history.push("/");
    }

    // Game data
    const [board, setBoard] = useState([]);
    const [start, setStart] = useState(false);
    const [players, setPlayers] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [thisPlayer, setThisPlayer] = useState(null);
    const [dice, setDice] = useState([]);

    // Game flow
    const [rolled, setRolled] = useState(false);
    const [source, setSource] = useState(null);
    const [dest, setDest] = useState(null);

    const diceFace = [
        require("../../Assets/Dice/1.png"),
        require("../../Assets/Dice/2.png"),
        require("../../Assets/Dice/3.png"),
        require("../../Assets/Dice/4.png"),
        require("../../Assets/Dice/5.png"),
        require("../../Assets/Dice/6.png"),
    ];

    useEffect(() => {
        function subscribeToGame(code) {
            socket.emit("SUBSCRIBE", code);
        }
        subscribeToGame(gameCode);
        return () => { socket.emit("UNSUBSCRIBE", gameCode) };
    }, [gameCode]);

    useEffect(() => {
        document.title = `${currentPlayer}'s turn`;
    }, [currentPlayer]);

    useEffect(() => {
        if (source !== null && dest !== null) { // both have been so selected so must be a valid move
            socket.emit("MOVE", gameCode, source, dest);
        }
    }, [source, dest, gameCode]);

    useEffect(() => {

        function setData(data) {
            setBoard(data.board);
            setPlayers(data.players)
            setStart(data.players.length === 2);
            setCurrentPlayer( (data.players.length === 2) ? data.players[data.current_player] : "waiting for player's to join");
            setThisPlayer(data.players.indexOf(name));
            setDice(data.dice);
            setRolled(data.dice.length!==0);
        } 

        socket.on("SUBSCRIBED", data => {
            console.log("subscribed callback");
            setData(JSON.parse(data));
        });

        socket.on("ROLLED", data => {
            console.log("new data callback");
            setData(JSON.parse(data));
            setRolled(true);
        });

        socket.on("MOVED", data => {
            console.log("piece moved callback");
            setData(JSON.parse(data));
            setSource(null);
            setDest(null);
        });
    }, [name]);

    function rollDice() {
        socket.emit("ROLL", gameCode);
    }

    function spikeClicked(index) {

        const validSource = (index) => {
            if (board[index] < 0 && thisPlayer === 0) { // white
                return true;
            } else {
                if (board[index] > 0 && thisPlayer === 1) { // black
                    return true;
                } else {
                    return false;
                }
            }
        }
    
        const validDest = (source, index) => {
            if (thisPlayer === 0) { // white
                if (board[index] <= 0 || board[index] === 1) {
                    // if dest is dice roll away from source
                    if (dice.includes(Math.abs(source-index)) && index < source ) {
                        return true;
                    } else {
                        return false
                    }
                } else {
                    return false;
                }
            } else { // black
                if (board[index] >= 0 || board[index] === -1) {
                    // if dest is dice roll away from source
                    if (dice.includes(Math.abs(source-index)) && index > source ) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
    
        console.log(`Cliked spike ${index}`);
        if (currentPlayer === players[thisPlayer]) {
            if (rolled) {
                if (source === null) {
                    if (validSource(index)) { // validation in this if statement
                        console.log("valid source");
                        setSource(index);
                    } else {
                        console.log(`Cannot select spike ${index} as a source`);
                    }
                } else { // dest
                    if (validDest(source,index)) {
                        console.log("valid destination");
                        setDest(index);
                    } else {
                        console.log(`Cannot select spike ${index} as a destination`)
                        setSource(null);
                        setDest(null);
                    }
                }
            } else {
                console.log("Please roll first");
            }
        } else {
            console.log("not your turn");
        }
    }

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
                        <h4>
                            { thisPlayer === 0 ? <strong>{players[0]}</strong> : players[0]}
                            (white) vs (black)  
                            { thisPlayer === 1 ? <strong>{players[1]}</strong> : players[1]}
                        </h4>
                        { (currentPlayer === players[thisPlayer] && !rolled) ?
                            <button type="button" className="btn btn-dark roll-btn" onClick={() => {rollDice();}}>Roll</button>
                        :
                        null
                        }
                        { (rolled && dice.length > 0) ?
                            dice.map((value,index) => {
                                return (
                                    <img key={index} src={diceFace[value-1]} className="img img-fluid dice-img" alt={`dice face showing ${value}`}  />
                                );
                            })
                            :
                            null
                        }
                    </div>
                </div>
                <div className="board">
                    <div className="row" style={{marginBottom:"70px"}}>
                        {board.slice(0,12).map((value, index) => {
                            return <Spike key={index} index={index} pieces={value} direction="down" color={index%2===0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} />
                        })}
                    </div>
                    <div className="row">
                        {board.slice(12,24).reverse().map((value, index) => {
                            return <Spike key={11+index} index={23-index} pieces={value} direction="up" color={index%2!==0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} />
                        })}
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

export default Game;