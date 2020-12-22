import './App.css';
import React from 'react'
import axios from 'axios';
import {Button, List, ListItem, Link, Avatar, TextField, Input, Grid} from '@material-ui/core'

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


  
  /*componentDidMount() {
    axios.get(`https://api.github.com/users/blackscalare`)
    .then(res => {
      const users = res.data
      console.log(users)
      this.setState({users})
    })
  }*/

  getRepoInfo() {
    const repos = this.state.repos
    repos.forEach(repo => {
      console.log(repo.name)
    });
  }

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

  getUserInfo() {
    const username = this.state.username
    axios.get(`${api}users/${username}`)
    .then(res => {
      const user = res.data
      console.log(user)
      this.setState({user})
    })
    this.getAllUserRepos()
  }


  onChange(event) {
    console.log(event)
  }

  handleSubmit(event){
    event.preventDefault()
    console.log(this.input)
    this.setState({
      username: this.input.current.value
    }, () => 
    this.getUserInfo()
    //console.log(this.input.current.value)
    )
    
  }

  render() {
    const {user, username, repos} = this.state
    console.log(repos)
    const user_avatar = user.avatar_url
    if(user.login) {
      return(
        <List>
          <Avatar src={user_avatar} alt='user_avatar'></Avatar>
          <Link href={user.html_url}>{user.login}</Link>
          <h2>Repos</h2>
          {repos.map(function(repo, idx) {
            return(
              <ListItem key={idx}>
                <Link href={repo.html_url}>{repo.name}</Link>
              </ListItem>
            )
          })}
        </List>
      )
    } else {
      /*return (
        <div>
          <Grid container justify="center">
            <h1>Enter GitHub username to see profile and repos</h1>
          </Grid>
          <Grid container justify="center">
            <form onSubmit={this.handleSubmit}>
              <TextField value={username || ''}
              onChange={this.onChange}/>
              <Button onClick={this.handleSubmit.bind(this)}>Search</Button>
            </form>
          </Grid>    
        </div>    
      )*/
      return(
        <div>
          <Grid container justify="center">
            <h1>Enter GitHub username to see profile and repos</h1>
          </Grid>
          <Grid container justify="center">
            <form onSubmit={this.handleSubmit}>
              <label>
                Username: 
                <input type="text" ref={this.input} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </Grid>
        </div>
        
      )
    }
  }
}

export default App;
