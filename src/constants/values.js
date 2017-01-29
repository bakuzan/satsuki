export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
export const getPlayerColour = (isWhiteTurn) => {
  return isWhiteTurn ? 'white' : 'black';
}
export const getAutoReverseBoard = (autoReverseBoard) => {
  return autoReverseBoard ? 'ON' : 'OFF';
}
