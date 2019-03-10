/* eslint-disable camelcase */
import React, { Component } from 'react'
import { Row, Col, Button, Card, Table } from 'antd'
import CongressMembers from '../components/CongressMembersTable'

class Leagues extends Component {
  state = { selectedCongressPerson: undefined }

  static async getInitialProps(props) {
    // Check if rendered on server
    if (props.query && props.query.data) return props.query
    try {
      const leagueID = window.location.pathname.split('/')[2]
      const response = await fetch(`http://localhost:3000/league/${leagueID}`, {
        headers: {
          Accept: 'application/json',
        },
      })
      const json = await response.json()
      return json
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  handleSelect = value => {
    this.setState({ selectedCongressPerson: value })
  }

  handleConfirmPick = async () => {
    const pickID = this.state.selectedCongressPerson.uid
    const leagueID = window.location.pathname.split('/')[2]
    const response = await fetch('http://localhost:3000/api/pick', {
      method: 'POST',
      body: JSON.stringify({ pickID, leagueID }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    console.log(json)
  }

  render() {
    const { data } = this.props
    const { leagueName, leagueDate } = data.leagueData
    const { selectedCongressPerson } = this.state
    const leagueHasStarted = new Date() > new Date(leagueDate)
    if (data.pickData.length > 0) {
      const {
        title,
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        party,
        seniority,
        state,
      } = data.pickData.pickedCongressPerson[0]
      return [
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ width: '100%', marginTop: '1%' }}
        >
          <Col span={10}>
            <h1>{leagueName}</h1>
          </Col>
          <Col span={10}>
            <h2>Starting Date: {new Date(leagueDate).toLocaleString()}</h2>
          </Col>
        </Row>,
        <Row
          type="flex"
          justify="space-around"
          style={{ width: '100%', marginTop: '1%' }}
        >
          <Col span={4}>
            <h1>Your pick</h1>
            <Card
              title={`${title} ${first_name} ${
                middle_name ? `${middle_name} ` : ''
              }${last_name}`}
            >
              <p>State: {state[0].name}</p>
              <p>Party: {party[0].name}</p>
              <p>Score: League has not started</p>
            </Card>
          </Col>
          <Col span={4}>
            <h1>Score by players</h1>
            <Table
              dataSource={[{ key: 1, name: 'Kristófer Másson', score: 1 }]}
              columns={[
                { title: 'Name', dataIndex: 'name' },
                { title: 'Score', dataIndex: 'score' },
              ]}
              pagination={false}
            />
          </Col>
          <Col span={4}>
            <h1>Score by congress people</h1>
            <Table
              dataSource={[{ key: 1, name: 'Kristófer Másson', score: 1 }]}
              columns={[
                { title: 'Name', dataIndex: 'name' },
                { title: 'Score', dataIndex: 'score' },
              ]}
              pagination={false}
            />
          </Col>
        </Row>,
      ]
    }
    return [
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ width: '100%', marginTop: '1%' }}
        key="topRow"
      >
        <Col span={8}>
          <h1>{leagueName}</h1>
          <h2>Starting Date: {new Date(leagueDate).toLocaleString()}</h2>
        </Col>
        {leagueHasStarted ? (
          <Col span={8} />
        ) : (
          <Col span={8}>
            <h1>1st Pick:</h1>
            <h1>
              {selectedCongressPerson
                ? `${selectedCongressPerson.title} ${
                    selectedCongressPerson.name
                  }`
                : 'Please select from the list below'}
            </h1>
          </Col>
        )}
        <Col span={4}>
          {leagueHasStarted ? null : (
            <Button
              type="primary"
              block
              disabled={!selectedCongressPerson}
              onClick={this.handleConfirmPick}
            >
              Confirm
            </Button>
          )}
        </Col>
      </Row>,
      <Row
        type="flex"
        justify="center"
        style={{ width: '100%', marginTop: '1%' }}
        key="bottomRow"
      >
        <Col span={20}>
          {leagueHasStarted ? null : (
            <CongressMembers onSelect={this.handleSelect} />
          )}
        </Col>
      </Row>,
    ]
  }
}

export default Leagues
