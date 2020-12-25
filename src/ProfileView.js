import React from 'react'
import {Button, List, ListItem, Link, Avatar, TextField, Input, Grid,
        Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'
import axios from 'axios';

const api = 'https://api.github.com/'
const API_KEY = process.env.REACT_APP_API_TOKEN
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `token ${API_KEY}`
}


export default class ProfileView extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
          user: this.props.user,
          username: this.props.username,
          repos: this.props.repos,
          open: false,
          selectedRepo: 0,
          repoName: ''
        }
        this.handleClick = this.handleClick.bind(this)
    }

    getAllUserRepos() {
        const username = this.state.username
        axios.get(`${api}users/${username}/repos`)
        .then(res => {
          const repos = res.data
          this.setState({
            repos: repos
          })
          console.log(repos)
        })
      }

    updateRepoName = (username, oldRepoName, newRepoName) => {
        console.log(username, oldRepoName, newRepoName)
        axios.patch(`${api}repos/${username}/${oldRepoName}`,
        {
            name: newRepoName
        },{
            headers: headers
        })
        .then(res => {
            console.log(res.data)
            if(res.data.id) {
                alert(`Successfully updated name from ${oldRepoName} to ${newRepoName}`)
                this.getAllUserRepos()
                this.handleClose()
            } else {
                alert(`Failed to update ${oldRepoName} to ${newRepoName}`)
            }
        })
    }

    handleClose = e => {
        this.setState({
            open: false
        })
    }
    handleChange = e => {
        console.log(e.target.value)
        this.setState({
            repoName: e.target.value
        })
    }
    handleApply = () => {
        const selectedRepo = this.state.selectedRepo
        const currentRepo = this.state.repos[selectedRepo].name
        const owner = this.state.username
        this.updateRepoName(owner, currentRepo, this.state.repoName)
    }

    handleClick(id) {
        this.setState({
            open: true,
            selectedRepo: id
        })
    }

    render() {
        const {user, username, repos, selectedRepo} = this.state
        const user_avatar = user.avatar_url
        const repoList = repos.map((repo, index) => {
            return(
                <ListItem className="repo-button" key={repo.id} button={true} value={index} onClick={() => this.handleClick(index)}>
                    {repo.name}
                </ListItem>
            )
        })
        if(user.login) {
          return(
            <div className="profile-view">
                <Grid container justify="center">
                    <Avatar src={user_avatar} alt='user_avatar'></Avatar>
                </Grid>
                <Grid container justify="center">
                    <h1>
                        <Link href={user.html_url}>{user.login}</Link>
                    </h1>
                    
                </Grid>
                <Grid container justify="center">
                    <List>
                        <h2>Repos</h2>
                        <b>Click to edit</b>
                        {repoList}
                    </List>
                </Grid>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>Edit repo</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Change repo details
                        </DialogContentText>
                        <TextField 
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Repo name"
                            fullWidth
                            defaultValue={this.state.repos[selectedRepo].name}
                            onChange={this.handleChange}
                            />
                            <DialogActions>
                                <Button color="secondary" onClick={this.handleClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onClick={(e) => this.handleApply()} >
                                    Apply
                                </Button>
                            </DialogActions>
                    </DialogContent>
                </Dialog>
            </div>
          )
        }
    }
}