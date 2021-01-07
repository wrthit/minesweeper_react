import React, { useEffect, useState } from "react";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import { generateCells } from "../../utils";
import Button from "../Button";
import { Cell, CellState, Face } from "../../types";
import { NUM_OF_MINES } from "../../constants";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.SMILE);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [availableFlags, setAvailableFlags] = useState<number>(NUM_OF_MINES);

  useEffect(() => {
    const handleMouseDown = (): void => {
      setFace(Face.PRAY);
    };

    const handleMouseUp = (): void => {
      setFace(Face.SMILE);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  const handleCellClick = (rowParam: number, colParam: number) => () => {
    if (!live) {
      setLive(true);
    }
  };

  const handleFlag = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();

    if (!live) {
      setLive(true);
    }

    const currentCell = cells[rowParam][colParam];
    if (currentCell.state === CellState.CLEARED) {
      return;
    }

    if (availableFlags > 0 && currentCell.state === CellState.UNKNOWN) {
      cells[rowParam][colParam] = {
        ...cells[rowParam][colParam],
        state: CellState.FLAGGED,
      };
      setAvailableFlags(availableFlags - 1);
    } else if (currentCell.state === CellState.FLAGGED) {
      cells[rowParam][colParam] = {
        ...cells[rowParam][colParam],
        state: CellState.UNKNOWN,
      };
      setAvailableFlags(availableFlags + 1);
    }
  };

  const handleFaceClick = (): void => {
    if (live) {
      setLive(false);
      setTime(0);
      setCells(generateCells());
    }
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          onClick={handleCellClick}
          onContextMenu={handleFlag}
          row={rowIndex}
          col={colIndex}
        />
      ))
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={availableFlags} />
        <div className="Face" onClick={handleFaceClick}>
          <span role="img" aria-label="face">
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
