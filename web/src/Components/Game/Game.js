import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Spike } from './Spike';
import { MyAlert as Alert } from './Alert';
import { GameOverModal } from './GameOverModal';
import { SettingsModal } from './SettingsModal';
import io from 'socket.io-client';
import "../../bootstrap.min.css";
import "./Game.css";
import gearImg from 'bootstrap-icons/icons/gear-fill.svg'

const socket = io.connect("/api");

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
    const [takenPieces, setTakenPieces] = useState([]);
    const [possibleMoves, setPossibleMoves] = useState(null);
    const [removedPieces, setRemovedPieces] = useState([0,0]);

    // Game flow
    const [rolled, setRolled] = useState(false);
    const [source, setSource] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [myTurn, setMyTurn] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [pieceCol1, setPieceCol1] = useState("#FFFFFF");
    const [pieceCol2, setPieceCol2] = useState("#000000");
    const [flipH, setFlipH] = useState(false);

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
        return () => { socket.emit("UNSUBSCRIBE", gameCode, name) };
    }, [gameCode,name]);

    useEffect(() => {
        document.title = `${currentPlayer}'s turn`;
    }, [currentPlayer]);

    useEffect(() => {

        function setData(data) {
            console.log(data);
            setBoard(data.board);
            setPlayers(data.players)
            setStart(data.players.length === 2);
            setCurrentPlayer( (data.players.length === 2) ? data.players[data.current_player] : "waiting for player's to join");
            setThisPlayer(data.players.indexOf(name));
            setDice(data.dice);
            setRolled(data.dice.length!==0);
            setTakenPieces(data.taken_pieces);
            setRemovedPieces(data.removed_pieces);
            setMyTurn(data.current_player === data.players.indexOf(name));
            setGameOver(data.game_over);
        }

        socket.on("SUBSCRIBED", data => {
            console.log("subscribed callback");
            setData(JSON.parse(data));
        });

        socket.on("ROLLED", data => {
            console.log("new data callback");
            setData(JSON.parse(data));
            setRolled(true);
            setPossibleMoves(JSON.parse(data).possible_moves);
        });

        socket.on("MOVED", data => {
            console.log("piece moved callback");
            setData(JSON.parse(data));
            setSource(null);
            setPossibleMoves(JSON.parse(data).possible_moves);
        });

        socket.on("ENDEDTURN", data => {
            console.log("Ended turn callback");
            setData(JSON.parse(data));
        });

    }, [name, gameCode]);

    // useEffect(() => {
    //     console.log("my turn", myTurn);
    //     console.log("pos moves", possibleMoves);
    //     console.log("rolled", rolled);
    //     if (myTurn && possibleMoves !== null && rolled) {
    //         if (Object.keys(possibleMoves).length === 0) {
    //             console.log("No possible moves, ending turn");
    //             setShowCannotMove(true);
    //             setTimeout(() => {
    //                 setRolled(false);
    //                 socket.emit("ENDTURN", gameCode);
    //             }, 100); //2000
    //         }
    //     }
    // }, [possibleMoves,myTurn,gameCode,rolled])

    // function getAllPossibleMoves() {
    //     if (myTurn) {
    //         fetch(`api/game/${gameCode}/possibleMoves`)
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log("all moves",data.allMoves);
    //             setPossibleMoves(data.allMoves);
    //             if (myTurn) {
    //                 if (Object.keys(data.allMoves).length === 0) {
    //                     console.log("No moves possible, ending turn");
    //                     setShowCannotMove(true);
    //                     setTimeout(() => {
    //                         setRolled(false);
    //                         socket.emit("ENDTURN", gameCode);
    //                     }, 3000);
    //                 } 
    //             }
    //         });
    //     }
    // }

    const rollDice = () => socket.emit("ROLL", gameCode);

    function spikeClicked(index) {
    
        console.log(`Cliked spike ${index}`);
        console.log("Possible Moves:", possibleMoves);
        if (myTurn) {
            if (rolled) {
                if (Object.keys(possibleMoves).length === 0) {
                    setAlertMsg("No possible moves, please end your turn.");
                    setShowAlert(true);
                }
                if (source === null) {
                    if (index in possibleMoves) {
                        console.log("valid source");
                        setSource(index);
                    } else {
                        console.log(`Cannot select spike ${index} as a source`);
                    }
                } else { // dest
                    if (possibleMoves[source].includes(index)) {
                        console.log("valid destination");
                        socket.emit("MOVE", gameCode, source, index);
                    } else {
                        console.log(`Cannot select spike ${index} as a destination`)
                        setSource(null);
                    }
                }
            } else {
                console.log("Please roll first");
                setAlertMsg("Please roll first");
                setShowAlert(true);
            }
        } else {
            console.log("not your turn");
            setAlertMsg("Not your turn");
            setShowAlert(true);
        }
    }

    function endMyTurn() {
        if (Object.keys(possibleMoves).length === 0) {
            socket.emit("ENDTURN", gameCode);
        } else {
            setAlertMsg("Cannot end turn as still possible to move.");
            setShowAlert(true);
        }
    }

    function saveSettings(newCol1, newCol2, newFlipH) {
        setPieceCol1(newCol1);
        setPieceCol2(newCol2);
        setFlipH(newFlipH);
        setShowSettings(false);
    }

    return (
        <div className="container-fluid">
            <GameOverModal show={gameOver} handleCloseGameOver={() => {history.push("/")}} winner={currentPlayer} />
            <SettingsModal show={showSettings} cancelSettings={() => {setShowSettings(false)}} saveSettings={saveSettings} currentColour1={pieceCol1} currentColour2={pieceCol2} currentFlipH={flipH} players={players||["Player 1", "Player 2"]}/>
            <img src={gearImg} alt="settings" onClick={() => {setShowSettings(true)}} style={{cursor:"pointer"}} />
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
                            <span className="piece circle mx-1" style={{backgroundColor:pieceCol1}} /> vs <span className="piece circle circle-black mx-1" style={{backgroundColor:pieceCol2}} />
                            { thisPlayer === 1 ? <strong>{players[1]}</strong> : players[1]}
                        </h4>
                        { (myTurn && !rolled) ?
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
                        {myTurn && rolled ? 
                            <button type="button" class="btn btn-outline-warning ml-2" onClick={() => {endMyTurn();}}>End Turn</button>
                        : null
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="mx-auto">
                        <Alert showAlert={showAlert} setShowAlert={setShowAlert} msg={alertMsg}/>
                    </div>
                </div>
                <div className="row">
                    <div className={`removed-pieces mx-auto col-10 my-1 py-3 ${source !== null && possibleMoves[source].includes("off") ?"rmv-pos-dest":null}`} onClick={() => spikeClicked("off")} >
                        {
                        removedPieces.map((v,i) => {
                            return [...Array(v).keys()].map((n,j) => {
                                return <div key={j} className={`removed-piece piece circle mx-1`} style={{backgroundColor:i===0?pieceCol1:pieceCol2}} />
                            });
                        })
                        }
                    </div>
                </div>
                <div className="board">
                    <div className="row" style={{marginBottom:"70px"}}>
                        {
                        flipH?
                            thisPlayer?
                                board.slice(0,12).reverse().map((value, index) => {
                                    return <Spike key={11-index} index={11-index} pieces={value} direction="down" color={index%2===0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} possibleMoves={possibleMoves} pieceCol1={pieceCol1} pieceCol2={pieceCol2} />
                                })
                            :
                                board.slice(12,24).map((value, index) => {
                                    return <Spike key={11+index} index={12+index} pieces={value} direction="down" color={index%2===0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} possibleMoves={possibleMoves} pieceCol1={pieceCol1} pieceCol2={pieceCol2} />
                                })
                        :
                            thisPlayer?
                                board.slice(0,12).map((value, index) => {
                                    return <Spike key={index} index={index} pieces={value} direction="down" color={index%2===0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} possibleMoves={possibleMoves} pieceCol1={pieceCol1} pieceCol2={pieceCol2} />
                                })
                            :
                                board.slice(12,24).reverse().map((value, index) => {
                                    return <Spike key={index} index={23-index} pieces={value} direction="down" color={index%2===0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} possibleMoves={possibleMoves} pieceCol1={pieceCol1} pieceCol2={pieceCol2} />
                                })
                        }
                    </div>
                    <div className="row">
                        {
                        flipH?
                        thisPlayer?
                            board.slice(12,24).map((value, index) => {
                                return <Spike key={index} index={12+index} pieces={value} direction="up" color={index%2!==0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} possibleMoves={possibleMoves} pieceCol1={pieceCol1} pieceCol2={pieceCol2} />
                            })
                            :
                            board.slice(0,12).reverse().map((value, index) => {
                                return <Spike key={index} index={11-index} pieces={value} direction="up" color={index%2!==0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} possibleMoves={possibleMoves} pieceCol1={pieceCol1} pieceCol2={pieceCol2} />
                            })
                        :
                        thisPlayer?
                            board.slice(12,24).reverse().map((value, index) => {
                                return <Spike key={11+index} index={23-index} pieces={value} direction="up" color={index%2!==0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} possibleMoves={possibleMoves} pieceCol1={pieceCol1} pieceCol2={pieceCol2} />
                            })
                            :
                            board.slice(0,12).map((value, index) => {
                                return <Spike key={11+index} index={index} pieces={value} direction="up" color={index%2!==0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} possibleMoves={possibleMoves} pieceCol1={pieceCol1} pieceCol2={pieceCol2} />
                            })
                        }
                    </div>
                </div>
                <div className="row">
                    <div className={`takenPieces mx-auto col-4 my-1 py-3 ${source === -1 || source === 24 ? "select" : "null" }`}>
                        {
                        takenPieces.map((value, index) => {
                            return <div key={index} className={`takenPiece piece circle mx-1`} style={{backgroundColor:value<0?pieceCol1:pieceCol2}} onClick={() => spikeClicked(thisPlayer === 0 ? 24 : -1)} />
                        })}
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

export default Game;