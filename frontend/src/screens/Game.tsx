import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";


export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());

    useEffect(()=>{
        if(!socket){
            return;
        }
        socket.onmessage = (event) =>{
            const message = JSON.parse(event.data);
            switch(message.type){
                case INIT_GAME:
                    setChess(new Chess());
                    setBoard(chess.board());
                    console.log("game initialized");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("move made");
                    break;
                case GAME_OVER:
                    console.log("game ended");
                    break;
            }
        }
    })

    if(!socket) return <div>Connecting.....</div>
    return <div>
        return <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg flex w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4 bg-red-200 flex justify-center">
                        <ChessBoard board={board} />
                    </div>
                    <div className="col-span-2 bg-green-200 w-full">
                        <Button onClick={() => { 
                            socket.send(JSON.stringify({
                                type:INIT_GAME
                            }))
                         }}>
                            Play
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}