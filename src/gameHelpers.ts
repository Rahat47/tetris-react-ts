import { PLAYER } from "./hooks/usePlayer";
import { STAGE } from "./hooks/useStage";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./setup";
import { TETROMINOS } from "./setup";

export const createStage = () =>
    Array.from(Array(STAGE_HEIGHT), () =>
        Array(STAGE_WIDTH).fill([0, "clear"])
    );

export const randomTetromino = () => {
    const tetrominos = [
        "I",
        "J",
        "L",
        "O",
        "S",
        "T",
        "Z",
    ] as (keyof typeof TETROMINOS)[];
    const randTetromino =
        tetrominos[Math.floor(Math.random() * tetrominos.length)];
    return TETROMINOS[randTetromino];
};

export const isColliding = (
    player: PLAYER,
    stage: STAGE,
    { x: moveX, y: moveY }: { x: number; y: number }
) => {
    //Using for loops to be able to return and break
    for (let y = 0; y < player.tetromino.length; y++) {
        for (let x = 0; x < player.tetromino[y].length; x++) {
            //1. Check that we're not checking an empty space
            if (player.tetromino[y][x] !== 0) {
                if (
                    //2. Check that we're not outside the stage
                    !stage[y + player.pos.y + moveY] ||
                    //3. Check that we're not outside the stage
                    !stage[y + player.pos.y + moveY][
                        x + player.pos.x + moveX
                    ] ||
                    //4. Check that we're not colliding with a block we're already in
                    stage[y + player.pos.y + moveY][
                        x + player.pos.x + moveX
                    ][1] !== "clear"
                ) {
                    return true;
                }
            }
        }
    }

    //If we've made it this far, we're not colliding
    return false;
};
