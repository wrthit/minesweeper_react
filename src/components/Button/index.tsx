import React from "react";
import { CellState, CellValue } from "../../types";
import "./Button.scss";

interface ButtonProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
  fatal: boolean;
  onClick(rowParam: number, colParam: number): (e: React.MouseEvent) => void;
  onContextMenu(rowParam: number, colParam: number): any;
}

const Button: React.FC<ButtonProps> = ({
  row,
  col,
  state,
  value,
  fatal,
  onClick,
  onContextMenu,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.CLEARED) {
      if (value === CellValue.MINE) {
        return (
          <span role="img" aria-label="mine">
            💣
          </span>
        );
      }
      return value === CellValue.NONE ? null : value;
    } else if (state === CellState.FLAGGED) {
      return (
        <span role="img" aria-label="flag">
          🚩
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className={`Button
      ${state === CellState.CLEARED ? "cleared" : ""}
      ${fatal ? "lethalBlow" : ""}
      value-${value}`}
      onClick={onClick(row, col)}
      onContextMenu={onContextMenu(row, col)}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
