class Graveyard extends React.Component {
  render() {
    return (
      <div className="graveyard">
        <h4>Graveyard</h4>
        { this.props.pieces }
      </div>
    );
  }
}

export default Graveyard;
