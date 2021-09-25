import React, { useRef, useState } from "react";
import { createStage } from "./gameHelpers";

//custom Hooks
import { useInterval } from "./hooks/useInterval";
import { usePlayer } from "./hooks/usePlayer";
import { useStage } from "./hooks/useStage";

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

    const { player, resetPlayer, updatePlayerPos } = usePlayer();
    const { stage, setStage } = useStage(player, resetPlayer);

    const movePlayer = (dir: number) => {
        updatePlayerPos({ x: dir, y: 0, collided: false });
    };

    const keyUp = ({ keyCode }: { keyCode: number }): void => {
        // Change the droptime speed when user Releases down arrow key
        if (keyCode === 40) {
            setDropTime(1000);
        }
    };

    const handleStartGame = (): void => {
        //Need to focus the window with the key events on start
        if (gameArea.current) {
            gameArea.current.focus();
        }

        //Reset Everything
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
    };

    const move = ({
        keyCode,
        repeat,
    }: {
        keyCode: number;
        repeat: boolean;
    }): void => {
        if (keyCode === 37) {
            movePlayer(-1);
        } else if (keyCode === 39) {
            movePlayer(1);
        } else if (keyCode === 40) {
            //just call once
            if (repeat) return;
            setDropTime(30);
        } else if (keyCode === 38) {
            //Implement this later
        }
    };

    const drop = (): void => {
        updatePlayerPos({ x: 0, y: 1, collided: false });
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
                            <Display text={`Score: `} />
                            <Display text={`Rows: `} />
                            <Display text={`Level: `} />
                        </>
                    )}
                </div>

                <Stage stage={stage} />
            </StyledTetris>
        </StyledTetrisWrapper>
    );
};

export default App;
