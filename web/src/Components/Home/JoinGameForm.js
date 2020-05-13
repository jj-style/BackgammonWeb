import React, { useState, useRef, useEffect } from 'react';

const JoinGameForm = ({joinGame, hideJoinForm}) => {

    const submit = (e) => {
        e.preventDefault();
        joinGame(code, name);
    }

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [disable, setDisabled] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    },[inputRef]);

    useEffect(() => {
        setDisabled(code.length === 0 || name.length === 0);
    },[code, name]);

    return (
        <div className="row">
            <div className="col-6 mx-auto">
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="gameCodeInput">Game Code</label>
                        <input ref={inputRef} id="gameCodeInput" type="text" className="form-control" placeholder="e.g. ABC123" value={code} onChange={(e) => {setCode(e.target.value)}}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="displayNameInput">Display Name</label>
                        <input id="displayNameInput" type="text" className="form-control" value={name} onChange={(e) => {setName(e.target.value)}}></input>
                    </div>
                    <div className="form-row align-items-center">
                        <div className="col-auto">
                        <button className="btn btn-danger" onClick={() => {hideJoinForm()}}>Cancel</button>
                        </div>
                        <div className="col-auto">
                        <button className={`btn btn-success ${disable?"disabled":null}`} onClick={(e) => {submit(e)}}>Join</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default JoinGameForm;