/* eslint-disable camelcase */
import React, { Component } from 'react'
import { Row, Col, Button, Card } from 'antd'
import CongressMembers from '../components/CongressMembersTable'
import LeagueScoreByPlayers from '../components/LeagueScoreByPlayers'
import LeagueScoreByCongressPerson from '../components/LeagueScoreByCongressPerson'

const PickedPersonCard = ({ data, leagueHasStarted }) => {
  if (data.pickData.pickedCongressPerson) {
    const {
      first_name,
      middle_name,
      last_name,
      party,
      state,
    } = data.pickData.pickedCongressPerson[0]
    const { mentionCount } = data.pickData.pickedCongressPerson[0][
      '~mentionedCongressPerson'
    ][0]
    return (
      <Card
        title={`${first_name} ${
          middle_name ? `${middle_name} ` : ''
        }${last_name}`}
      >
        <p>State: {state[0].name}</p>
        <p>Party: {party[0].name}</p>
        <p>
          Score: {leagueHasStarted ? mentionCount : 'League has not started'}
        </p>
      </Card>
    )
  }
  return (
    <Card title="Missed pick deadline">
      <p>The league started before you made your pick</p>
      <p>Please start a new league if you want to participate</p>
    </Card>
  )
}

class League extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedCongressPerson: undefined, data: this.props.data }
  }

  static async getInitialProps(props) {
    // Check if rendered on server
    if (props.query && props.query.data) return props.query
    return this.getNewState()
  }

  getNewState = async () => {
    try {
      const leagueID = window.location.pathname.split('/')[2]
      const response = await fetch(`/league/${leagueID}`, {
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
    const response = await fetch('/api/pick', {
      method: 'POST',
      body: JSON.stringify({ pickID, leagueID }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.ok) {
      const data = await this.getNewState()
      this.setState({ data: data.data })
    }
  }

  render() {
    const { data, selectedCongressPerson } = this.state
    const { leagueName, leagueDate } = data.leagueData
    const leagueHasStarted = new Date() > new Date(leagueDate)
    if (
      data.pickData &&
      data.pickData.pickedCongressPerson &&
      data.pickData.pickedCongressPerson.length > 0
    ) {
      return [
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ width: '100%', marginTop: '1%' }}
          key="upper row"
        >
          <Col span={23}>
            <h1>{leagueName}</h1>
            <h2>Starting Date: {new Date(leagueDate).toLocaleString()}</h2>
          </Col>
        </Row>,
        <Row
          type="flex"
          justify="space-around"
          style={{ width: '100%', marginTop: '1%' }}
          key="lower row"
        >
          <Col span={7}>
            <h1>Your pick</h1>
            <PickedPersonCard data={data} leagueHasStarted={leagueHasStarted} />
          </Col>
          <Col span={7}>
            <h1>Score by players</h1>
            <LeagueScoreByPlayers leagueHasStarted={leagueHasStarted} />
          </Col>
          <Col span={7}>
            <h1>Score by congress people</h1>
            <LeagueScoreByCongressPerson leagueHasStarted={leagueHasStarted} />
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

export default League
