export enum CellValue {
  NONE,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  MINE,
}

export enum CellState {
  UNKNOWN,
  CLEARED,
  FLAGGED,
}

export type Cell = {
  value: CellValue;
  state: CellState;
};
