import React from 'react';
import { Link } from 'react-router';

var Navbar = React.createClass({
  render() {
    return (
      <div className='navbar navbar-inverse navbar-static-top' role='navigation'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <button type='button'
              className='navbar-toggle collapsed'
              data-toggle='collapse'
              data-target='#client-navbar'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <Link className='navbar-brand' to='/'>Paycheck</Link>
          </div>
          <div className='collapse navbar-collapse' id='#client-navbar'>
            <ul className='nav navbar-nav navbar-right'>
              <li><Link to='/budget'>Budget</Link></li>
              <li><a href='/logout'>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

export default Navbar;
