class Post extends React.Component {
  static async getInitialProps({ query }) {
    console.log('USER', query.user)
    return {}
  }

  render() {
    return <h1>My blog post</h1>
  }
}

export default Post
