import React from 'react';
import Navbar from './common/Navbar';

var App = React.createClass({
  render() {
    return (
      <div>
        <Navbar />
        {this.props.children}
      </div>
    );
  }
});

export default App;
