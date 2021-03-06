import './App.css';
import React from 'react'
import axios from 'axios';
import {Button, Grid} from '@material-ui/core'
import ProfileView from './ProfileView'

const api = 'https://api.github.com/'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
    this.input = React.createRef()
    this.state = {
      user: [],
      username: '',
      repos: []
    }
  }
  
  /*componentDidMount() {}*/
  
  // debug: log all repos
  getRepoInfo() {
    const repos = this.state.repos
    repos.forEach(repo => {
      console.log(repo.name)
    });
  }

  // Fetches all public repos from the user
  getAllUserRepos() {
    const username = this.state.username
    axios.get(`${api}users/${username}/repos`)
    .then(res => {
      const repos = res.data
      this.setState({
        repos: repos
      }, () => this.getRepoInfo())
    })
  }

  // Fetches the user data from the REST api
  getUserInfo() {
    const username = this.state.username
    axios.get(`${api}users/${username}`)
    .then(res => {
      const user = res.data
      this.setState({user})
    }).catch( function(error) {
      if(error.response)  
        alert(`Could not find user "${username}"\nPlease try again`)
    }
      
    )
    this.getAllUserRepos()
  }


  onChange(event) {
    console.log(event)
  }

  handleSubmit(event){
    event.preventDefault()
    this.setState({
      username: this.input.current.value
    }, () => 
    this.getUserInfo()
    )
    
  }

  render() {
    const {user, username, repos} = this.state
    // Checks if the user is logged in and if there are any repos
    // currently only works with accounts that have at least one public repo
    if(user.login && repos[0]) {
      return(
        <ProfileView user={user} username={username} repos={repos} />
      )
    } else {
      return(
        <div>
          <Grid container justify="center">
            <h1>Enter GitHub username to see profile and repos</h1>
          </Grid>
          <Grid container justify="center">
            <form onSubmit={this.handleSubmit}>
              <label>
                Username <br />
              </label>
              <input type="text" ref={this.input} />
              <br /><br/>
              <Button type="submit" variant="contained" value="Submit" color="primary">Submit</Button>
            </form>
          </Grid>
        </div>
        
      )
    }
  }
}

export default App;
