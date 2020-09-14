import React, { Component } from 'react';
import Cookies from 'universal-cookie';
class LogoutView extends Component {
    logout = () => {

      localStorage.setItem('username', null);
      localStorage.setItem('password', null);
      localStorage.setItem('passwordpub', null);
        window.location.href = "/user/login" 
    }
    componentDidMount() {
      this.logout()
    }
    render() { 
        return ( 
            <div className="content">
              <a className="btn btn-primary" onClick={this.logout}> Click here </a>
              to logout
            </div>
         );
    }
}
 
export default LogoutView;
