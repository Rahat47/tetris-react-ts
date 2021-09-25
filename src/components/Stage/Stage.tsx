import React from "react";
import Cell from "../Cell/Cell";
import { StyledStage } from "./Stage.styles";
import { TETROMINOS } from "../../setup";

export type STAGECELL = [keyof typeof TETROMINOS, string];
export type STAGE = STAGECELL[][];

type StageProps = {
    stage: STAGE;
};

const Stage: React.FC<StageProps> = ({ stage }) => {
    return (
        <StyledStage>
            {stage.map(row => {
                return row.map((cell, cellIdx) => {
                    return <Cell key={cellIdx} type={cell[0]} />;
                });
            })}
        </StyledStage>
    );
};

export default Stage;
