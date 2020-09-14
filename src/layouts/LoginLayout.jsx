import React, { Component } from 'react';
import NotificationAlert from "react-notification-alert";
let { PrivateKey, key_utils } = require('voilk/lib/auth/ecc');
require('isomorphic-fetch');

class LoginLayout extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          username: localStorage.getItem('username'),
          pass: localStorage.getItem('password'),
          posting_pubkey: localStorage.getItem('password_pub'),
        };
        this.onDismiss = this.onDismiss.bind(this);
        this.notify = this.notify.bind(this);
	  }
	  state = {
        username: "",
        pass: "",
        msg: "",
        posting_pubkey: "",
        available: false
    }
    onDismiss() { }
    notify(place, msg) {
      var color = Math.floor(Math.random() * 5 + 1);
      var type;
      switch (color) {
        case 1:
          type = "primary";
          break;
        case 2:
          type = "success";
          break;
        case 3:
          type = "danger";
          break;
        case 4:
          type = "warning";
          break;
        case 5:
          type = "info";
          break;
        default:
          break;
      }
      type = "info";
      var options = {};
      options = {
        place: place,
        message: (
          <div>
            {msg}
          </div>
        ),
        type: type,
        icon: "now-ui-icons ui-1_bell-53",
        autoDismiss: 10
      };
      this.refs.notificationAlert.notificationAlert(options);
    }
    validate_account_name = (value) => {
      let i, label, len, length, ref;
  
      if (!value) {
        return "Account name Should not be empty";
      }
      length = value.length;
      if (length < 3) {
        return "Account name should be at least 3 characters";
      }
      if (length > 16) {
        return "Account name should be shorter than 16 characters";
      }
      ref = value.split('.');
      for (i = 0, len = ref.length; i < len; i++) {
        label = ref[i];
        if (!/^[a-z]/.test(label)) {
          return "Account name can only consist upon small letters, digits, and dashes!";
        }
        if (!/^[a-z0-9-]*$/.test(label)) {
          return "Account name can only consist upon letters, digits and dashes";
        }
        if (/--/.test(label)) {
          return "Account name can only have 1 dash in a row";
        }
        if (!/[a-z0-9]$/.test(label)) {
          return "Account name should end with a letter or digit";
        }
        if (!(label.length >= 3)) {
          return "each account segment should be longer";
        }
  
      }
      
      return null;
    }
    username_exists = (e) => {
      //this.notify("tr", (<div>Contacting blockchain <b> for verification</b> - of your account </div>))
      //this.validate_account_name(e);
      
      fetch('https://graphql.voilk.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ account(name: "' + e + '") { name posting {key_auths} json_metadata {about profile_image} user_followers user_ignored user_muted user_following} }' }),
      })
        .then(res => res.json())
        .then(res => {
          console.log(res.data);
          if (res.data.account !== null) {
            this.setState(
              {
                error: "Account exists on blockchain  ✅",
                available: true,
                username: res.data.account.name,
                posting_pubkey: res.data.account.posting.key_auths[0][0]
              }
            );
            this.notify("tr", (<div>Notification alert - {this.state.error} - <b>{this.state.username}</b></div>))
            this.verifykey(this.state.pass, res.data.account);
            return;
          }
          else {
            this.setState(
              {
                error: "Account does not exist ",
                availbtn: true,
                username: ""
              }
            );
            this.notify("tr", (<div>Notification alert - {this.state.error} - <b>{this.state.username}</b></div>))
  
            return;
          }
        });
    }
    handlechange = (e) => {
      console.log(e.target.value);
      let msg = this.validate_account_name(e.target.value);
      if (msg !== null) {
        this.setState(
          {
            username: "",
            error: msg
          }
        );
        return;
        //this.notify("tr", (<div>Notification alert - {this.state.error}</div>))
      }
      else {
        this.setState({
          username: e.target.value,
          error: "Username is Valid  ✅"
        });
        //this.notify("tr", (<div>Notification alert - {this.state.error}</div>))
      }
    }
    get_public_key(privWif) {
      var pubWif = PrivateKey.fromWif(privWif);
      pubWif = pubWif.toPublic().toString();
      return pubWif;
    };
    handlekey = (e) => {
      
      this.setState({
        pass: e.target.value
      });
      
    }
    verifykey = (e) => {
      let pub;
      try {
        pub = this.get_public_key(e);
      } catch (error) {
        this.setState({ error: "Invalid Key" })
      }
      if (pub === this.state.posting_pubkey) {
        this.setState({
          pass: e,
          error: "Your key is valid ✅"
        })
      }
      this.notify("tr", (<div>Notification Alert: {this.state.error}</div>))
      if (pub === this.state.posting_pubkey && this.state.available == true)
      {
        localStorage.setItem('username', this.state.username);
        localStorage.setItem('password', this.state.pass);
        localStorage.setItem('passwordpub', this.state.posting_pubkey);

        this.notify("tr", (<div>Logging you in with <b>{localStorage.getItem('username')} </b>  
        {localStorage.getItem('password')}
        </div>))
        this.notify("tr", (<div>We are redirecting you to <b>Dashboard</b> - in 5 seconds</div>))
        this.wait(5000);
        window.location.href = "/profile/@"+this.state.username
      }
      else {
        
        localStorage.setItem('username', null);
        localStorage.setItem('password', null);
        localStorage.setItem('passwordpub', null);
        this.notify("tr", (<div>Notification Alert: We Could not login {localStorage.getItem('username')} -
        {localStorage.getItem('password')}
        </div>))    
      }
    }
    wait = (ms) =>
    {
          var d = new Date();
          var d2 = null;
          do { d2 = new Date(); }
          while(d2-d < ms);
    }
    handleLogin = (e) => {
		e.preventDefault();
        const msg = (
          <div>
            <img
                    height={"30px"}
                    src={
                      "https://loading.io/spinners/pies/lg.pie-chart-loading-gif.gif"
                    }
                    alt={"Loading..."}
                  />
                  Hold on <b>We are contacting blockchain</b><br />- to verify your information.
          </div>
        );
        this.notify("tr", msg);
        this.username_exists(this.state.username);
        
    }
    componentDidMount() {

        if(!(this.state.username=="null"||this.state.username==undefined||this.state.username==null))
        {
          console.log(this.state)
          window.location.href = "/profile/@"+this.state.username;
        }
    }
    render() {
        return (
            <div class="wrapper">		
            <NotificationAlert ref="notificationAlert" />

            <div class="sign-in-page">
                <div class="signin-popup">
                    <div class="signin-pop">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="cmp-info">
                                    <div class="cm-logo">
                                        <img src={process.env.PUBLIC_URL+"/images/cm-logo.png"} alt="" />
                                        <p>Voilk is blockchain based social network, where you can earn digital tokens by creating and curating roars!</p>
                                    </div>	
                                    <img src={process.env.PUBLIC_URL+"/images/cm-main-img.png"} alt="" />			
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="login-sec">
                                    <ul class="sign-control">
                                        <li data-tab="tab-1" class="current"><a href="#" title="">Sign in</a></li>				
                                        <li data-tab="tab-2"><a href="https://landing.voilk.com/register" title="">Sign up</a></li>				
                                    </ul>			
                                    <div class="sign_in_sec current" id="tab-1">
                                        
                                        <h3>Sign in</h3>
                                        <form onSubmit={this.handleLogin.bind(this)}>
                                            <div class="row">
                                                <div class="col-lg-12 no-pdd">
                                                    <div class="sn-field">
                                                        <input name="username" id="username" placeholder="Insert username here" type="text" onChange={this.handlechange.bind(this)} required/>
                                                        <i class="la la-user"></i>
                                                    </div>
                                                </div>
                                                <div class="col-lg-12 no-pdd">
                                                    <div class="sn-field">
                                                        <input name="password" id="password" placeholder="Insert Posting Private key" type="password"  onChange={this.handlekey.bind(this)} required/>
                                                        <i class="la la-lock"></i>
                                                    </div>
                                                </div>
                                                <div class="col-lg-12 no-pdd">
                                                    <div class="checky-sec">
                                                        
                                                        <a href="/home" title="">Go to Home?</a>
                                                    </div>
                                                </div>
                                                <div class="col-lg-12 no-pdd">
                                                    <button type="submit" onClick={this.handleLogin.bind(this)}>Sign in</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                  </div>
                            </div>
                        </div>		
                    </div>
                </div>
                <div class="footy-sec">
                    <div class="container">
                        <ul>
                            <li><a href="/pages/help" title="">Help Center</a></li>
                            <li><a href="/pages/about" title="">About</a></li>
                            <li><a href="/pages/privacy" title="">Privacy Policy</a></li>
                            <li><a href="#" title="">Community Guidelines</a></li>
                            <li><a href="#" title="">Cookies Policy</a></li>
                            <li><a href="#" title="">Career</a></li>
                            <li><a href="forum.html" title="">Forum</a></li>
                            <li><a href="#" title="">Language</a></li>
                            <li><a href="#" title="">Copyright Policy</a></li>
                        </ul>
                        <p><img src={process.env.PUBLIC_URL+"/images/copy-icon.png"} alt="" />Copyright 2019</p>
                    </div>
                </div>
            </div>
    
    
        </div>
        )
    }
}

export default LoginLayout