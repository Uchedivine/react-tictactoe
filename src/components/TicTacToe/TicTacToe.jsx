import React, { useState, useRef } from 'react'
import './TicTacToe.css'
import circle_icon from '../Assets/circle.png'
import cross_icon from '../Assets/cross.png'

let data = ["", "", "", "", "", "", "", "", ""]

export const TicTacToe = () => {
    let [count, setCount] = useState(0);
    let [lock, setLock] = useState(false);
    let [vsAI, setVsAI] = useState(true); // vs AI or 2 players
    let [difficulty, setDifficulty] = useState("easy"); // "easy" | "medium" | "hard"

    const human = "x"; 
    const ai = "o";    

    let titleRef = useRef(null);
    let box1 = useRef(null);
    let box2 = useRef(null);
    let box3 = useRef(null);
    let box4 = useRef(null);
    let box5 = useRef(null);
    let box6 = useRef(null);
    let box7 = useRef(null);
    let box8 = useRef(null);
    let box9 = useRef(null);

    let box_array = [box1, box2, box3, box4, box5, box6, box7, box8, box9];

    const toggle = (e, num) => {
        if (lock) return;
        if (data[num] !== "") return;

        const symbol = count % 2 === 0 ? "x" : "o";
        const icon = symbol === "x" ? cross_icon : circle_icon;

        e.target.innerHTML = `<img src='${icon}'>`;
        data[num] = symbol;
        setCount(prev => prev + 1);

        checkWin();

        if (vsAI && symbol === human && !lock) {
            setTimeout(() => {
                if (!lock) {
                    if (difficulty === "easy") {
                        aiMoveEasy();
                    } else if (difficulty === "medium") {
                        aiMoveMedium();
                    } else {
                        aiMoveHard();
                    }
                }
            }, 350);
        }
    };

    const checkWin = () => {
        const wins = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];

        for (let combo of wins) {
            const [a, b, c] = combo;
            if (data[a] && data[a] === data[b] && data[a] === data[c]) {
                won(data[a]);
                return true;
            }
        }
        return false;
    };

    const won = (winner) => {
        setLock(true);
        titleRef.current.innerHTML = `Congratulations: <img src=${winner === "x" ? cross_icon : circle_icon} />`;
    };

    // ✅ EASY MODE (Random Move)
    const aiMoveEasy = () => {
        if (lock) return;
        const empty = data.map((v, i) => (v === "" ? i : null)).filter(i => i !== null);
        if (empty.length === 0) return;

        const choice = empty[Math.floor(Math.random() * empty.length)];
        placeMove(choice, ai);
    };

    // ✅ MEDIUM MODE (50% smart, 50% random)
    const aiMoveMedium = () => {
        if (lock) return;
        if (Math.random() < 0.5) {
            // smart move
            const bestMove = minimax(data, ai).index;
            placeMove(bestMove, ai);
        } else {
            // random move
            aiMoveEasy();
        }
    };

    // ✅ HARD MODE (Minimax - unbeatable)
    const aiMoveHard = () => {
        if (lock) return;
        const bestMove = minimax(data, ai).index;
        placeMove(bestMove, ai);
    };

    const placeMove = (index, player) => {
        const icon = player === "x" ? cross_icon : circle_icon;
        const boxRef = box_array[index];
        if (boxRef && boxRef.current) {
            boxRef.current.innerHTML = `<img src='${icon}'>`;
        }
        data[index] = player;
        setCount(prev => prev + 1);
        checkWin();
    };

    // ✅ Minimax Algorithm
    const minimax = (board, player) => {
        const empty = board.map((v, i) => (v === "" ? i : null)).filter(i => i !== null);

        if (checkWinner(board, human)) return { score: -10 };
        if (checkWinner(board, ai)) return { score: 10 };
        if (empty.length === 0) return { score: 0 };

        let moves = [];

        for (let i of empty) {
            let move = {};
            move.index = i;
            board[i] = player;

            if (player === ai) {
                let result = minimax(board, human);
                move.score = result.score;
            } else {
                let result = minimax(board, ai);
                move.score = result.score;
            }

            board[i] = "";
            moves.push(move);
        }

        let bestMove;
        if (player === ai) {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    };

    const checkWinner = (board, player) => {
        const wins = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        return wins.some(combo => combo.every(i => board[i] === player));
    };

    const resetGame = () => {
        data = ["", "", "", "", "", "", "", "", ""];
        setCount(0);
        setLock(false);
        titleRef.current.innerHTML = "Tic Tac Toe Game in <span>React</span>";
        box_array.forEach(b => {
            if (b.current) b.current.innerHTML = "";
        })
    };

    return (
        <div className='container'>
            <h1 className='title' ref={titleRef}>
                Tic Tac Toe Game in <span>React</span>
            </h1>

            {/* ✅ Mode toggle buttons */}
            <div className="mode-controls">
                <button onClick={() => setVsAI(true)} className={vsAI ? 'active' : ''}>Play vs AI</button>
                <button onClick={() => setVsAI(false)} className={!vsAI ? 'active' : ''}>2 Players</button>
            </div>

            {/* ✅ Difficulty buttons (only show if AI is enabled) */}
            {vsAI && (
                <div className="mode-controls">
                    <button onClick={() => setDifficulty("easy")} className={difficulty === "easy" ? 'active' : ''}>Easy</button>
                    <button onClick={() => setDifficulty("medium")} className={difficulty === "medium" ? 'active' : ''}>Medium</button>
                    <button onClick={() => setDifficulty("hard")} className={difficulty === "hard" ? 'active' : ''}>Hard</button>
                </div>
            )}

            <div className="board">
                <div className="row1">
                    <div className="boxes" ref={box1} onClick={(e) => { toggle(e, 0) }}></div>
                    <div className="boxes" ref={box2} onClick={(e) => { toggle(e, 1) }}></div>
                    <div className="boxes" ref={box3} onClick={(e) => { toggle(e, 2) }}></div>
                </div>
                <div className="row2">
                    <div className="boxes" ref={box4} onClick={(e) => { toggle(e, 3) }}></div>
                    <div className="boxes" ref={box5} onClick={(e) => { toggle(e, 4) }}></div>
                    <div className="boxes" ref={box6} onClick={(e) => { toggle(e, 5) }}></div>
                </div>
                <div className="row3">
                    <div className="boxes" ref={box7} onClick={(e) => { toggle(e, 6) }}></div>
                    <div className="boxes" ref={box8} onClick={(e) => { toggle(e, 7) }}></div>
                    <div className="boxes" ref={box9} onClick={(e) => { toggle(e, 8) }}></div>
                </div>
            </div>

            <button className="reset" onClick={resetGame}>Reset</button>
        </div>
    )
}

export default TicTacToe
