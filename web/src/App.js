import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import './App.css';
import './bootstrap.min.css'
import JoinGameForm from './JoinGameForm';
import CreateGameForm from './CreateGameForm';


function App() {
    let history = useHistory("");

    function enterGame(gameCode,name) {
        history.push(`/game/${gameCode}?name=${name}`);
    }

    function joinGame(code, name) {
        console.log(`attempting to join game ${code} for ${name}`);
        fetch(`http://localhost:5000/api/game/join?gameCode=${code}&name=${name}`, 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"}
            }
        )
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.error)
                console.log(data.error);
            else
                enterGame(code,name);
        });
    }

    function createGame(name) {
        console.log("creating new game for " + name);
        fetch(`http://localhost:5000/api/game/create?name=${name}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            enterGame(data.gameCode,name);
        });
    }

    const [showFormOption, setShowFormOption] = useState(0); // 0 = none, 1 = create, 2 = join

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="mx-auto">
                    <h3>Backgammon</h3>
                </div>
            </div>
            <div className="row">
                <div className="mx-auto">
                    <div className="btn-group">
                        <button type="button" className="btn btn-outline-info" onClick={() => setShowFormOption(1)}>Create Game</button>
                        <button type="button" className="btn btn-outline-info" onClick={() => setShowFormOption(2)}>Join Game</button>
                    </div>
                </div>
            </div>
            
            { showFormOption === 2 ? <JoinGameForm joinGame={joinGame} hideJoinForm={() => setShowFormOption(0)}/> : null }
            { showFormOption === 1 ? <CreateGameForm createGame={createGame} hideCreateForm={() => setShowFormOption(0)}/> : null }

        </div>
    );
}

export default App;
