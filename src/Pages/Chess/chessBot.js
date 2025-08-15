import { useEffect, useRef } from 'react'
import { setReplacePiece } from './Action';
import { 
    chessBotMove,
    copyBoardChess,
    copyPiecesChess,
    copyMoves,
    hiddenInvalidMoveAndTake,
    replacePiece,
    capturePiece
 } from './Function'

function ChessBot({ chess, dispatch, setBoard }) {

    const sfRef = useRef(null);

    function postMessageToSf(sf, fen){
        if (!sf) return

        sf.postMessage("uci");
        sf.postMessage("isready");
        sf.postMessage(`position fen ${fen}`);
        sf.postMessage("go depth 1");
    }

    useEffect(() => {
        if (chess.turn === 'w') return

        const sf = new Worker('/stockfish.js')
        sfRef.current = sf
        sf.onmessage = (event) => {
            const message = typeof event.data === "string" ? event.data : event;

            if (message.startsWith("bestmove")) {
                const move = message.split(" ")[1];
                if (move === "(none)") return;
                const turn = chess.turn
                const state = chessBotMove(
                    move,
                    chess.attacks,
                    hiddenInvalidMoveAndTake(
                        copyBoardChess(chess.board)
                    ),
                    copyPiecesChess(chess.pieces),
                    turn,
                    chess.direction,
                    chess.canCastle,
                    chess.squaresEP,
                    copyMoves(chess.moves),
                    chess.bout,
                    replacePiece,
                    capturePiece
                )

                if (!state) return

                setBoard(state.board)
                dispatch(setReplacePiece(state))
            }
        };

        postMessageToSf(sfRef.current, chess.fen)

        return () => {
            sf.terminate()
            sfRef.current = null
        };  
        
    }, [chess])


    return (
        <></>
    )
}

export default ChessBot