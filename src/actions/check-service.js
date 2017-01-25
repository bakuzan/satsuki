class CheckService {
  discoverSquaresUnderThreat(movementService, squares) {
    console.log('discover', movementService, squares);
    /* 1) Loop through squares
     * 2) If contains:
     * 3) Use piece attackPatterns from square.
     *    - This will require canMove/canTake checks for each move.
     * 4) If a King is target, 'In Check' flag.
     *    - If that colour King was moved there, 'Cancel Move' flag
     * 
     */
  }
}

export default new CheckService();
