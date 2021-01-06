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
  BOMB,
}

export enum CellState {
  OPEN,
  VISIBLE,
  FLAGGED,
}

export type Cell = {
  value: CellValue;
  state: CellState;
};
