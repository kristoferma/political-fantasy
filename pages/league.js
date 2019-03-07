import React, { Component } from 'react'
import { Row, Col } from 'antd'

class Leagues extends Component {
  static async getInitialProps(props) {
    // Check if rendered on server
    if (props.query && props.query.data) return props.query
    try {
      console.log(props.url)
      const response = await fetch('http://localhost:3000/league/', {
        headers: {
          Accept: 'application/json',
        },
      })
      const json = await response.json()
      return { data: json }
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  render() {
    const { leagueName, leagueDate } = this.props.data
    return (
      <Row
        type="flex"
        justify="center"
        style={{ height: '100%', width: '100%', marginTop: '1%' }}
      >
        <Col span={20}>
          <h1>{leagueName}</h1>
          <h2>{new Date(leagueDate).toLocaleString()}</h2>
        </Col>
      </Row>
    )
  }
}

export default Leagues
