import { useEffect, useRef } from 'react'

function ChessBot({ chess, chessBot, setChess, setAIThinking }) {

    const sfRef = useRef(null);

    function postMessageToSf(sf, fen){
        if (!sf) return

        const elo = chessBot.elo ?? 1500;
        const skillLevel = Math.min(20, Math.max(Math.ceil(elo - 1350) / 70, 0))

        sf.postMessage("uci");
        sf.postMessage("isready");
        sf.postMessage("setoption name UCI_LimitStrength value true")
        sf.postMessage(`setoption name UCI_Elo value ${elo}`)
        sf.postMessage(`setoption name Skill Level value ${skillLevel}`);
        sf.postMessage(`position fen ${fen}`);
        sf.postMessage("go depth 12");
    }

    useEffect(() => {
        if (!chessBot) return
        if (chess.hasCheckmate.checkmate) return
        if (chess.turn === 'w') return

        setAIThinking(true)
        const sf = new Worker('/findminegame/stockfish.js')
        const chessClone = chess.getState()
        sfRef.current = sf
        sf.onmessage = (event) => {
            const message = typeof event.data === "string" ? event.data : event;

            if (message.startsWith("bestmove")) {
                const move = message.split(" ")[1];
                if (move === "(none)") return;
                const state = chessClone.chessBotMove(move)
                console.log(state.turn)

                setChess(state)
                setAIThinking(false)
            }
        };

        postMessageToSf(sfRef.current, chessClone.fen)

        return () => {
            sf.terminate()
            sfRef.current = null
        };  
        
    }, [chess.turn, chess])


    return (
        <div></div>
    )
}

export default ChessBot