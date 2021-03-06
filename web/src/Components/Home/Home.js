import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';
import '../../bootstrap.min.css'
import JoinGameForm from './JoinGameForm';
import CreateGameForm from './CreateGameForm';

const Home = ({dispatch}) => {
    let history = useHistory("");

    useEffect(() => {
        document.title = "Backgammon";
    },[]);

    function joinGame(code, name) {
        console.log(`attempting to join game ${code} for ${name}`);
        fetch(`/api/game/join?gameCode=${code}&name=${name}`, 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"}
            }
        )
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.error) {
                console.log(data.error);
            } else {
                dispatch({type:"JOIN", gameCode:code, name:name});
                history.push("/game");
            }
        });
    }

    function createGame(name) {
        console.log("creating new game for " + name);
        fetch(`/api/game/create?name=${name}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            dispatch({type:"CREATE", gameCode:data.gameCode, name:name});
            history.push("/game");
        });
    }

    const [showFormOption, setShowFormOption] = useState(0); // 0 = none, 1 = create, 2 = join

    return (
        <div className="container-fluid main">
            <div className="row">
                <div className="col-12">
                    <div className="jumbotron jumbotron-fluid">
                        <div className="container-fluid">
                            <h1 className="display-4">Backgammon</h1>
                            <p className="lead">A simple online backgammon game to play with friends.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="mx-auto">
                    <div className="btn-group">
                        <button type="button" className="btn btn-outline-info" onClick={() => setShowFormOption( showFormOption === 1 ? 0 : 1)}>Create Game</button>
                        <button type="button" className="btn btn-outline-info" onClick={() => setShowFormOption( showFormOption === 2 ? 0 : 2)}>Join Game</button>
                    </div>
                </div>
            </div>
            
            { showFormOption === 2 ? <JoinGameForm joinGame={joinGame} hideJoinForm={() => setShowFormOption(0)}/> : null }
            { showFormOption === 1 ? <CreateGameForm createGame={createGame} hideCreateForm={() => setShowFormOption(0)}/> : null }

            {/* <footer id="sticky-footer" className="py-4 bg-dark text-white-50">
                <div className="container text-center">
                    <small>Copyright &copy; Your Website</small>
                </div>
            </footer> */}

        </div>
    );
}

export default Home;
