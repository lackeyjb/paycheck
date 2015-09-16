import React from 'react';
import { Link } from 'react-router';

var Home = React.createClass({
  render() {
    return (
      <div className='container'>
        <div className='jumbotron'>
          <div className='container'>
            <h1>Paycheck</h1>
            <p>The easy way to keep up with a budget.</p>
            <p><Link to='/budget'
                className='btn btn-info btn-lg'
                role='button'>See your budget!</Link></p>
          </div>
        </div>
      </div>
    );
  }
});

export default Home;
