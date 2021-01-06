import { MAX_COLUMNS, MAX_ROWS, NUM_OF_MINES } from "../constants";
import { CellState, Cell, CellValue } from "../types";

export const generateCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLUMNS; col++) {
      cells[row].push({
        value: CellValue.NONE,
        state: CellState.UNKNOWN,
      });
    }
  }

  let minesPlaced = 0;

  while (minesPlaced < NUM_OF_MINES) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLUMNS);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.MINE) {
      cells[randomRow][randomCol] = {
        ...currentCell,
        value: CellValue.MINE,
      };
      minesPlaced++;
    }
  }

  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLUMNS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.MINE) {
        continue;
      }

      let numberOfMines = 0;
      const topLeftCell =
        rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
      const topCell = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
      const topRightCell =
        rowIndex > 0 && colIndex < MAX_COLUMNS - 1
          ? cells[rowIndex - 1][colIndex + 1]
          : null;
      const leftCell = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
      const rightCell =
        colIndex < MAX_COLUMNS - 1 ? cells[rowIndex][colIndex + 1] : null;
      const bottomLeftCell =
        rowIndex < MAX_ROWS - 1 && colIndex > 0
          ? cells[rowIndex + 1][colIndex - 1]
          : null;
      const bottomCell =
        rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
      const bottomRightCell =
        rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLUMNS - 1
          ? cells[rowIndex + 1][colIndex + 1]
          : null;

      if (topLeftCell?.value === CellValue.MINE) {
        numberOfMines++;
      }
      if (topCell?.value === CellValue.MINE) {
        numberOfMines++;
      }
      if (topRightCell?.value === CellValue.MINE) {
        numberOfMines++;
      }
      if (leftCell?.value === CellValue.MINE) {
        numberOfMines++;
      }
      if (rightCell?.value === CellValue.MINE) {
        numberOfMines++;
      }
      if (bottomLeftCell?.value === CellValue.MINE) {
        numberOfMines++;
      }
      if (bottomCell?.value === CellValue.MINE) {
        numberOfMines++;
      }
      if (bottomRightCell?.value === CellValue.MINE) {
        numberOfMines++;
      }

      if (numberOfMines > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfMines,
        };
      }
    }
  }

  return cells;
};
