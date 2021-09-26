import React, { useRef, useState } from "react";
import { createStage, isColliding } from "./gameHelpers";

//custom Hooks
import { useInterval } from "./hooks/useInterval";
import { usePlayer } from "./hooks/usePlayer";
import { useStage } from "./hooks/useStage";
import { useGameStatus } from "./hooks/useGameStatus";

//Components
import Stage from "./components/Stage/Stage";
import Display from "./components/Display/Display";
import StartButton from "./components/StartButton/StartButton";

// Styles
import { StyledTetrisWrapper, StyledTetris } from "./App.styles";

const App: React.FC = () => {
    const [gameOver, setGameOver] = useState(true);
    const [dropTime, setDropTime] = useState<null | number>(null);

    const gameArea = useRef<HTMLDivElement>(null);

    const { player, resetPlayer, updatePlayerPos, playerRotate } = usePlayer();
    const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
    const { score, setScore, rows, setRows, level, setLevel } =
        useGameStatus(rowsCleared);

    const movePlayer = (dir: number) => {
        if (!isColliding(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0, collided: false });
        }
    };

    const keyUp = ({ keyCode }: { keyCode: number }): void => {
        if (!gameOver) {
            if (keyCode === 40) {
                setDropTime(1000 / (level + 1));
            }
        }
    };

    const handleStartGame = (): void => {
        //Need to focus the window with the key events on start
        if (gameArea.current) {
            gameArea.current.focus();
        }

        //Reset Everything
        setStage(createStage());
        setDropTime(1000 / (level + 1));
        resetPlayer();
        setScore(0);
        setRows(0);
        setLevel(1);
        setGameOver(false);
    };

    const move = ({
        keyCode,
        repeat,
    }: {
        keyCode: number;
        repeat: boolean;
    }): void => {
        if (!gameOver) {
            if (keyCode === 37) {
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40) {
                //just call once
                if (repeat) return;
                setDropTime(30);
            } else if (keyCode === 38) {
                playerRotate(stage);
            }
        }
    };

    const drop = (): void => {
        //Increase level when player has cleared 10 rows
        if (rows > level * 10) {
            setLevel(prev => prev + 1);
            //Increase speed
            setDropTime(1000 / (level + 200));
        }

        if (!isColliding(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game over!
            if (player.pos.y < 1) {
                console.log("Game over!");
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    };

    useInterval(() => {
        drop();
    }, dropTime);

    return (
        <StyledTetrisWrapper
            ref={gameArea}
            onKeyUp={keyUp}
            onKeyDown={move}
            role="button"
            tabIndex={0}
        >
            <StyledTetris>
                <div className="display">
                    {gameOver ? (
                        <>
                            <Display gameOver={gameOver} text="Game Over" />
                            <StartButton callback={handleStartGame} />
                        </>
                    ) : (
                        <>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                        </>
                    )}
                </div>

                <Stage stage={stage} />
            </StyledTetris>
        </StyledTetrisWrapper>
    );
};

export default App;
