import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'
import CongressMembers from '../components/CongressMembersTable'

class Leagues extends Component {
  state = { selectedCongressPerson: undefined }

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

  handleSelect = value => {
    this.setState({ selectedCongressPerson: value })
  }

  render() {
    const { leagueName, leagueDate } = this.props.data
    const { selectedCongressPerson } = this.state
    const hasLeagueStarted = new Date() > new Date(leagueDate)
    const hasSelectedCongressPerson = false
    return [
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ width: '100%', marginTop: '1%' }}
      >
        <Col span={8}>
          <h1>{leagueName}</h1>
          <h2>Starting Date: {new Date(leagueDate).toLocaleString()}</h2>
        </Col>
        <Col span={8}>
          <h1>1st Pick:</h1>
          <h1>
            {selectedCongressPerson
              ? `${selectedCongressPerson.title} ${selectedCongressPerson.name}`
              : 'Please select from the list below'}
          </h1>
        </Col>
        <Col span={4}>
          <Button type="primary" block disabled={!selectedCongressPerson}>
            Confirm
          </Button>
        </Col>
      </Row>,
      <Row
        type="flex"
        justify="center"
        style={{ width: '100%', marginTop: '1%' }}
      >
        <Col span={20}>
          {hasLeagueStarted ? (
            'started'
          ) : (
            <CongressMembers onSelect={this.handleSelect} />
          )}
        </Col>
      </Row>,
    ]
  }
}

export default Leagues
