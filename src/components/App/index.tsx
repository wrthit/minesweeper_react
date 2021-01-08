import React, { useEffect, useState } from "react";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../utils";
import Button from "../Button";
import { Cell, CellState, CellValue, Face } from "../../types";
import { MAX_COLUMNS, MAX_ROWS, NUM_OF_MINES } from "../../constants";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.SMILE);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [availableFlags, setAvailableFlags] = useState<number>(NUM_OF_MINES);
  const [victory, setVictory] = useState<boolean>(false);
  const [defeat, setDefeat] = useState<boolean>(false);

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

  useEffect(() => {
    if (victory || defeat) {
      setLive(false);
    }

    if (victory) {
      setFace(Face.ALL_CLEAR);
    }

    if (defeat) {
      exposeAllMines();
      setFace(Face.DEAD);
    }
  }, [victory, defeat]);

  const startGame = () => {
    if (!live) {
      setLive(true);
    }
  };

  const handleCellClick = (rowParam: number, colParam: number) => () => {
    const currentCell = cells[rowParam][colParam];

    startGame();

    if ([CellState.FLAGGED, CellState.CLEARED].includes(currentCell.state)) {
      return;
    }

    if (currentCell.value === CellValue.MINE) {
      currentCell.fatal = true;
      setDefeat(true);
    } else if (currentCell.value === CellValue.NONE) {
      setCells(openMultipleCells(cells, rowParam, colParam));
    } else {
      currentCell.state = CellState.CLEARED;
    }

    if (!defeat) {
      checkForVictory();
    }
  };

  const handleFlag = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();

    startGame();

    const currentCell = cells[rowParam][colParam];
    if (currentCell.state === CellState.CLEARED) {
      return;
    }

    if (availableFlags > 0 && currentCell.state === CellState.UNKNOWN) {
      currentCell.state = CellState.FLAGGED;
      setAvailableFlags(availableFlags - 1);
    } else if (currentCell.state === CellState.FLAGGED) {
      currentCell.state = CellState.UNKNOWN;
      setAvailableFlags(availableFlags + 1);
    }

    checkForVictory();
  };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setCells(generateCells());
    setVictory(false);
    setDefeat(false);
    setAvailableFlags(NUM_OF_MINES);
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          fatal={cell.fatal}
          onClick={handleCellClick}
          onContextMenu={handleFlag}
          row={rowIndex}
          col={colIndex}
        />
      ))
    );
  };

  const exposeAllMines = (): void => {
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLUMNS; col++) {
        if (cells[row][col].value === CellValue.MINE) {
          cells[row][col].state = CellState.CLEARED;
        }
      }
    }
  };

  const checkForVictory = (): void => {
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLUMNS; col++) {
        if (cells[row][col].state === CellState.UNKNOWN) {
          if (cells[row][col].value === CellValue.MINE) {
            continue;
          }
          return;
        }
      }
    }

    setVictory(true);
    return;
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
