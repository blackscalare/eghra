import './App.css';
import React from 'react'
import axios from 'axios';

class App extends React.Component {
  state = {
    users: []
  }
  componentDidMount() {
    axios.get(`https://api.github.com/users/blackscalare`)
    .then(res => {
      const users = res.data
      console.log(users)
      this.setState({users})
    })
  }

  render() {
    const {users} = this.state
    const user_avatar = users.avatar_url
    return(
      <ul>
        <img src={user_avatar} alt='user_avatar' id='user_image'></img>
        <a href={users.html_url}>{users.login}</a>
      </ul>
    )
  }
}

export default App;
