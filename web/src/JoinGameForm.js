import React, { useState } from 'react';

const JoinGameForm = ({joinGame, hideJoinForm}) => {

    const submit = (e) => {
        e.preventDefault();
        joinGame(code);
    }

    const [code, setCode] = useState("");

    return (
        <div className="row">
            <div className="col-6 mx-auto">
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="gameCodeInput">Game Code</label>
                        <input id="gameCodeInput" type="text" className="form-control" placeholder="e.g. ABC123" value={code} onChange={(e) => {setCode(e.target.value)}}></input>
                    </div>
                    <div className="form-row align-items-center">
                        <div className="col-auto">
                        <button className="btn btn-danger" onClick={() => {hideJoinForm()}}>Cancel</button>
                        </div>
                        <div className="col-auto">
                        <button className="btn btn-success" onClick={(e) => {submit(e)}}>Join</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default JoinGameForm;