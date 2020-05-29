import React from 'react';
import "./Spike.css";

export const Spike = ({index,pieces,direction,color,spikeClicked,source,possibleMoves,pieceCol1,pieceCol2}) => {
    return (
        <div className="col-1">
            <div className={`spike triangle-${direction}-${color} triangle-${direction} ${source===index?"select":null} ${source !== null && possibleMoves[source].includes(index)?"pos-dest":null} `} onClick={() => spikeClicked(index)}>
                {
                    [...Array(Math.abs(pieces)).keys()].map((value,i) => {
                        return <div key={i} className={`piece piece-${direction} circle`} style={{backgroundColor:pieces<0?pieceCol1:pieceCol2}} />
                    })
                }
            </div>
        </div>
    );
}