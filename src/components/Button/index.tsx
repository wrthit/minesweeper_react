import React from "react";
import { CellState, CellValue } from "../../types";
import "./Button.scss";

interface ButtonProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
}

const Button: React.FC<ButtonProps> = ({ row, col, state, value }) => {
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
      value-${value}`}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
