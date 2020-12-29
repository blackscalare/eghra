import React from 'react'
import {Button, List, ListItem, Link, Avatar, TextField, Grid,
        Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'
import axios from 'axios'
import marked from 'marked'
import {Base64} from 'js-base64'

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
          repoName: '',
          readmeContent: ''
        }
        this.handleClick = this.handleClick.bind(this)
    }

    getRepoReadme = () => {
        const {username} = this.state
        const selectedRepoName = this.state.repos[this.state.selectedRepo].name
        axios.get(`${api}repos/${username}/${selectedRepoName}/readme`)
        .then(res => {
            // Decode the base64 encoded content and convert markdown to HTML
            const readmeContent = marked(Base64.decode(res.data.content))
            this.setState({
                readmeContent: readmeContent
            })
        })
        .catch((error) => {
            if(error.response) {
                this.setState({
                    readmeContent: ''
                })
            }
        })
    }
    // Updates the repo name in memory instead of fetching all the repos again which might not be correct
    updateRepoInMemory(newRepoName) {
        let repos = [...this.state.repos]
        let repoIndex = this.state.selectedRepo
        let repo = {
            ...repos[repoIndex],
            name: newRepoName    
        }
        repos[repoIndex] = repo
        this.setState({repos})
    }

    updateRepoName = (username, oldRepoName, newRepoName) => {
        axios.patch(`${api}repos/${username}/${oldRepoName}`,
        {
            name: newRepoName
        },{
            headers: headers
        })
        .then(res => {
            if(res.data.id) {
                alert(`Successfully updated name from ${oldRepoName} to ${newRepoName}`)
                this.updateRepoInMemory(newRepoName)
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
        }, () => this.getRepoReadme())
    }

    render() {
        const {user, repos, selectedRepo} = this.state
        const user_avatar = user.avatar_url
        let selectedRepoName = ''
        if(this.state.repos.length > 0) {
            selectedRepoName = this.state.repos[selectedRepo].name
        }
        // Creates a list of all the public repos of a profile
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
                    <DialogTitle>Repo details</DialogTitle>
                    <DialogContent>
                        <article dangerouslySetInnerHTML={{__html: this.state.readmeContent}} />
                        <DialogContentText>
                            Change repo details
                        </DialogContentText>
                        <TextField 
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Repo name"
                            fullWidth
                            defaultValue={selectedRepoName}
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