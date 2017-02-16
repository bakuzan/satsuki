import React, { Component } from 'react';
import SinglePageNav from '../../components/single-page-nav/single-page-nav';
import SinglePageContentWrapper from '../../components/single-page-content-wrapper/single-page-content-wrapper';
import HowToPlayValues from '../../constants/views/how-to-play';

class HowToPlay extends Component {
  render() {
    return (
      <div>
        <SinglePageNav items={HowToPlayValues.menu} />
        <SinglePageContentWrapper>
          <section id="introduction">
            <header>
              <h2>Introduction</h2>
            </header>
            <div>
            
            </div>
          </section>
          <section id="setup">
            <header>
              <h2>Setup</h2>
            </header>
            <div>
            
            </div>
          </section>
          <section id="movement">
            <header>
              <h2>Movement</h2>
            </header>
            <div>
              <section id="king">
                <header>
                  <h4>King</h4>
                </header>
                <div>
                </div>
              </section>
              <section id="queen">
                <header>
                  <h4>Queen</h4>
                </header>
                <div>
                </div>
              </section>
              <section id="bishop">
                <header>
                  <h4>Bishop</h4>
                </header>
                <div>
                </div>
              </section>
              <section id="knight">
                <header>
                  <h4>Knight</h4>
                </header>
                <div>
                </div>
              </section>
              <section id="rook">
                <header>
                  <h4>rook</h4>
                </header>
                <div>
                </div>
              </section>
              <section id="pawn">
                <header>
                  <h4>Pawn</h4>
                </header>
                <div>
                </div>
              </section>
            </div>
          </section>
          <section id="special-rules">
            <header>
              <h2>Special rules</h2>
            </header>
            <div>
            
            </div>
          </section>
        </SinglePageContentWrapper>
      </div>
    );
  }
}

export default HowToPlay;
