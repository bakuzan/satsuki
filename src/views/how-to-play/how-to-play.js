import React, { Component } from 'react';
import SinglePageContentWrapper from '../../components/single-page-content-wrapper/single-page-content-wrapper';
import HowToPlayValues from '../../constants/views/how-to-play';

class HowToPlay extends Component {
  render() {
    return (
      <SinglePageContentWrapper title="How to play"
                                navItems={HowToPlayValues.menu}>
        <section id="introduction">
          <header className="single-page-section-header">
            <h2>Introduction</h2>
          </header>
          <div>
            <p>
              The aim here is to provide you with an explanation of all the rules within chess. 
              This will include the basics such as how the board is setup, and how each piece moves.
              It also includes more advanced moves such as castling and en passant.
            </p>
            <p>
              To skip directly to a section you want to learn about, use the navigation bar to the left.
            </p>
          </div>
        </section>
        <section id="setup">
          <header className="single-page-section-header">
            <h2>Setup</h2>
          </header>
          <div>
            <p>
              Chess is played on an 8x8 board using 32 pieces, 16 for each player, with the columns or "files" being denoted by letters a - h and rows or "ranks" being denoted 1 - 8 starting for white players bottom left square as a1.
            </p>
            <p>
              It is important to note that the bottom right square on a chess board from either players perspective should be white.
            </p>
            <p>
              Each players first rank is populated on each side with a rook, a knight, and a bishop respectively. The center two squares are for the king and queen.
              The queen is placed on a square of her our colour, which is file d.
              Each players second rank has 8 pawns, the remained of the pieces.
            </p>
          </div>
        </section>
        <section id="movement">
          <header className="single-page-section-header">
            <h2>Movement</h2>
          </header>
          <div>
            <section id="king">
              <header className="single-page-section-header">
                <h4>King</h4>
              </header>
              <div>
                <p>
                  The king can move 1 square in any direction, provided that the king does not move into <a href="#check">check</a>.
                  See <a href="#castling">castling</a> for the exception to this rule.
                </p>
              </div>
            </section>
            <section id="queen">
              <header className="single-page-section-header">
                <h4>Queen</h4>
              </header>
              <div>
                <p>
                  The queen can move any number of squares, in any, singlar direction.
                </p>
              </div>
            </section>
            <section id="bishop">
              <header className="single-page-section-header">
                <h4>Bishop</h4>
              </header>
              <div>
                <p>
                  Bishops can move any number of squares along a diagonal path. 
                  This means each bishop can only move on one colour, with each player having a bishop that can move on white, and one on black.
                </p>
              </div>
            </section>
            <section id="knight">
              <header className="single-page-section-header">
                <h4>Knight</h4>
              </header>
              <div>
                <p>
                  Knights move in "L"-shaped patterns. Either 2 files and 1 rank, or 2 ranks and 1 file can be moved by a knight in any direction from the square it is on. 
                </p>
                <p>
                  It is important to note that knights are special in that they are the only piece that can "jump" over other pieces.
                  If a piece is in a knights way, the knight can move as though the piece was not there, provided the square the knight will land on is not occupied by a piece of its own colour.
                </p>
              </div>
            </section>
            <section id="rook">
              <header className="single-page-section-header">
                <h4>Rook</h4>
              </header>
              <div>
                Rooks can move any number of squares in straight lines. Up or down on files, Left or right on ranks, but never both.
              </div>
            </section>
            <section id="pawn">
              <header className="single-page-section-header">
                <h4>Pawn</h4>
              </header>
              <div>
                <p>
                  Pawns can only move one square forward at a time, except on their first movement when they can move 2 squares.
                  They cannot move back like other pieces.
                </p>
                <p>
                  Pawns are the only piece that attacks differently to how it moves.
                  When attacking, pawns can take pieces one rank forward and to the left or right of the square it is on.
                </p>
              </div>
            </section>
          </div>
        </section>
        <section id="special-rules">
          <header className="single-page-section-header">
            <h2>Special rules</h2>
          </header>
          <div>
            <section id="castling">
              <header className="single-page-section-header">
                <h4>Castling</h4>
              </header>
              <div>
                <p>
                  In chess each king has a special move that can be performed once, castling. 
                  This involves the king moving 2 squares along the first file and placing the rook the king moved towards on the square the king crossed over.
                </p>
                <p>
                  Castling can take place provided the following criteria are met:
                </p>
                <ul>
                  <li>Niether the king, or chosen rook have moved previously</li>
                  <li>There are no pieces between the king and rook</li>
                  <li>The king cannot castle out of, through, or into check.</li>
                </ul>
              </div>
            </section>
            <section id="en-passant">
              <header className="single-page-section-header">
                <h4>En passant</h4>
              </header>
              <div>
                <p>
                  If a pawn advances 2 squares on its first move to a square on an adjacent file to an opposing pawn, the opposing pawn can take the pawn by moving to the square it passed over.
                  To reword it, the opposing pawn takes the pawn as thought it only moved one square. This is the only move in chess where the attacking piece do not end on the same square as the piece that was captured.
                  
                  This can only be done if the opposing pawn performs en passant in the turn immediatly following the pawns 2 square move, otherwise the ability to do so is forfeit.
                </p>
              </div>
            </section>
            <section id="promotion">
              <header className="single-page-section-header">
                <h4>Promotion</h4>
              </header>
              <div>
                <p>
                  When a pawn advances all the way to the opponents first rank, it must be promoted.
                  Pawns can be promoted to any other piece, except the king.
                  If the pawn is promoted to a piece other than the queen, this is called underpromotion.
                </p>
                <p>
                  There are no restrictions on the chosen promoted piece. Having more versions of a piece than you started with is legal, e.g. 2 Queens is valid.
                </p>
              </div>
            </section>
          </div>
        </section>
        <section id="check">
          <header className="single-page-section-header">
            <h2>Check</h2>
          </header>
          <div>
            <p>
              Check is when a king is under attack from 1 or more opposing pieces. Legal responses to check involve getting the king out of direct attack from enemy pieces by:
            </p>
            <ul>
              <li>Moving the king to a safe square</li>
              <li>Moving a piece between the king and his attacker</li>
              <li>Capturing the piece attacking the king</li>
            </ul>
            <p>
              If there is no way to get the king out of check, it is called checkmate.
              See <a href="#winning">winning</a>
            </p>
          </div>
        </section>
        <section id="winning">
          <header className="single-page-section-header">
            <h2>Winning</h2>
          </header>
          <div>
            <p>
              Chess can be won through any of the following:
            </p>
            <ul>
              <li>place your opponent in checkmate</li>
              <li>
                resigning - conceding the game. 
                This is considered normal in professional games when it is obvious who is going to win.
              </li>
              <li>loss on time - in games with time control, running out of time is a loss</li>
              <li>forfeit - for cheating, arriving late, refusing to shake hands with opponents.</li>
            </ul>
            <p>
              It should be noted that the only way to currently win the game in this application is to checkmate your opponent.
            </p>
          </div>
        </section>
      </SinglePageContentWrapper>
    );
  }
}

export default HowToPlay;
