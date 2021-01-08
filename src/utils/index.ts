import { MAX_COLUMNS, MAX_ROWS, NUM_OF_MINES } from "../constants";
import { CellState, Cell, CellValue } from "../types";

const getAdjacentCells = (
  cells: Cell[][],
  rowIndex: number,
  colIndex: number
): Cell[] => {
  let adjacentCells: Cell[] = [];

  if (rowIndex > 0) {
    if (colIndex > 0) {
      adjacentCells.push(cells[rowIndex - 1][colIndex - 1]);
    }
    if (colIndex < MAX_COLUMNS - 1) {
      adjacentCells.push(cells[rowIndex - 1][colIndex + 1]);
    }
    adjacentCells.push(cells[rowIndex - 1][colIndex]);
  }

  if (rowIndex < MAX_ROWS - 1) {
    if (colIndex > 0) {
      adjacentCells.push(cells[rowIndex + 1][colIndex - 1]);
    }
    if (colIndex < MAX_COLUMNS - 1) {
      adjacentCells.push(cells[rowIndex + 1][colIndex + 1]);
    }
    adjacentCells.push(cells[rowIndex + 1][colIndex]);
  }

  if (colIndex > 0) {
    adjacentCells.push(cells[rowIndex][colIndex - 1]);
  }

  if (colIndex < MAX_COLUMNS - 1) {
    adjacentCells.push(cells[rowIndex][colIndex + 1]);
  }

  return adjacentCells;
};

const initCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLUMNS; col++) {
      cells[row].push({
        value: CellValue.NONE,
        state: CellState.UNKNOWN,
        fatal: false,
      });
    }
  }

  return cells;
};

const randomlyPlaceMines = (cells: Cell[][]): void => {
  let minesPlaced = 0;

  while (minesPlaced < NUM_OF_MINES) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLUMNS);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.MINE) {
      currentCell.value = CellValue.MINE;
      minesPlaced++;
    }
  }
};

const populateHints = (cells: Cell[][]): void => {
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLUMNS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.MINE) {
        continue;
      }

      let numberOfMines = 0;

      const adjacentCells = getAdjacentCells(cells, rowIndex, colIndex);
      adjacentCells.forEach((cell) => {
        if (cell.value === CellValue.MINE) {
          numberOfMines++;
        }
      });

      if (numberOfMines > 0) {
        currentCell.value = numberOfMines;
      }
    }
  }
};

const outOfBounds = (row: number, col: number): boolean => {
  return row < 0 || row >= MAX_ROWS || col < 0 || col >= MAX_COLUMNS;
};

export const generateCells = (): Cell[][] => {
  const cells = initCells();
  randomlyPlaceMines(cells);
  populateHints(cells);

  return cells;
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): Cell[][] => {
  if (outOfBounds(rowParam, colParam)) {
    return cells;
  }

  const currentCell = cells[rowParam][colParam];

  if (currentCell.value === CellValue.MINE) {
    return cells;
  } else if (currentCell.state === CellState.UNKNOWN) {
    currentCell.state = CellState.CLEARED;

    if (currentCell.value !== CellValue.NONE) {
      return cells;
    }

    const rowMinusOne = rowParam - 1;
    const rowPlusOne = rowParam + 1;
    const colMinusOne = colParam - 1;
    const colPlusOne = colParam + 1;

    openMultipleCells(cells, rowMinusOne, colMinusOne);
    openMultipleCells(cells, rowMinusOne, colParam);
    openMultipleCells(cells, rowMinusOne, colPlusOne);
    openMultipleCells(cells, rowParam, colMinusOne);
    openMultipleCells(cells, rowParam, colPlusOne);
    openMultipleCells(cells, rowPlusOne, colMinusOne);
    openMultipleCells(cells, rowPlusOne, colParam);
    openMultipleCells(cells, rowPlusOne, colPlusOne);
  }

  return cells;
};
