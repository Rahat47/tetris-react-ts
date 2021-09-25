import { STAGE_WIDTH } from "../setup";
import { randomTetromino } from "../gameHelpers";
import React, { useCallback, useState } from "react";

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

    return { player, updatePlayerPos, resetPlayer };
};
