import { STAGE_WIDTH } from "../setup";
import { isColliding, randomTetromino } from "../gameHelpers";
import { useCallback, useState } from "react";
import { STAGE } from "./useStage";

export type PLAYER = {
    pos: {
        x: number;
        y: number;
    };
    tetromino: (string | number)[][];
    collided: boolean;
};

export const usePlayer = () => {
    const [player, setPlayer] = useState({} as PLAYER);

    const rotate = (matrix: PLAYER["tetromino"]) => {
        //Make the rows to become columns
        const rotatedTetromino = matrix.map((_, index) =>
            matrix.map(column => column[index])
        );

        //Reverse each row to get a rotated matrix
        return rotatedTetromino.map(row => row.reverse());
    };

    const playerRotate = (stage: STAGE): void => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino);

        // this one is so the player can't rotate the tetromino when it collides with the wall or other tetrminos
        const posX = clonedPlayer.pos.x;
        let offset = 1;
        while (isColliding(clonedPlayer, stage, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));

            if (offset > clonedPlayer.tetromino[0].length) {
                clonedPlayer.pos.x = posX;
                return;
            }
        }

        setPlayer(clonedPlayer);
    };

    const updatePlayerPos = ({
        x,
        y,
        collided,
    }: {
        x: number;
        y: number;
        collided: boolean;
    }): void => {
        setPlayer(prevState => ({
            ...prevState,
            pos: {
                x: (prevState.pos.x += x),
                y: (prevState.pos.y += y),
            },
            collided,
        }));
    };

    const resetPlayer = useCallback(
        (): void =>
            setPlayer({
                pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
                tetromino: randomTetromino().shape,
                collided: false,
            }),
        []
    );

    return { player, updatePlayerPos, resetPlayer, playerRotate };
};
