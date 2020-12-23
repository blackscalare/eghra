import React from 'react'
import {Button, List, ListItem, Link, Avatar, TextField, Input, Grid,
        Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'
import axios from 'axios';

const api = 'https://api.github.com/'
const token = '0xDEADBEEF'
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `token ${token}`
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
    handleApply = (name, e) => {
        const selectedRepo = this.state.selectedRepo
        const currentRepo = this.state.repos[selectedRepo].name
        const owner = this.state.username
        this.updateRepoName(owner, currentRepo, this.state.repoName)
    }

    handleClick(id) {
        console.log('test')
        console.log(id)
        this.setState({
            open: true,
            selectedRepo: id
        })
    }

    render() {
        const {user, username, repos, selectedRepo} = this.state
        console.log(repos)
        const user_avatar = user.avatar_url
        const repoList = repos.map((repo, index) => {
            return(
                <ListItem key={repo.id} button={true} value={index} onClick={() => this.handleClick(index)}>
                    {repo.name}
                </ListItem>
            )
        })
        if(user.login) {
          return(
            <div>
                <Grid container justify="center">
                    <Avatar src={user_avatar} alt='user_avatar'></Avatar>
                    <Link href={user.html_url}>{user.login}</Link>
                </Grid>
                <Grid container justify="center">
                    <List>
                        <h2>Repos</h2>
                        {repoList}
                    </List>
                </Grid>
                <Dialog open={this.state.open} onClose={this.handleClose} >
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
                                <Button onClick={this.handleClose}>
                                    Cancel
                                </Button>
                                <Button onClick={(e) => this.handleApply('xD', e)} >
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