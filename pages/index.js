import { Card, Row, Col, Button, Input, message } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import fetch from 'isomorphic-unfetch'

const handleJoinLeague = async value => {
  try {
    const response = await fetch('/api/joinLeague', {
      method: 'POST',
      body: JSON.stringify({ leagueID: value }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    if (json.error) message.error(json.error)
    else {
      message.success(`Sucesfully joined ${json.data.leagueName}`)
      Router.push(`/league/${json.data.leagueID}`)
    }
  } catch (error) {
    console.log(error)
  }
}

function Home() {
  return (
    <Row
      gutter={16}
      style={{ display: 'flex', alignItems: 'center', height: '100%' }}
    >
      <Col span={6} offset={6}>
        <Card
          cover={
            <img
              alt="example"
              src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Seal_of_the_United_States_House_of_Representatives.svg"
            />
          }
          actions={[
            <Link href="/createLeague">
              <Button type="primary" block>
                Start
              </Button>
            </Link>,
          ]}
        >
          <Card.Meta
            title="Create a League"
            description="Create a Political-Fantasy league to start playing with your friends"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card
          cover={
            <img
              alt="example"
              src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Seal_of_the_United_States_Senate.svg"
            />
          }
          actions={[
            <Input.Search
              type="primary"
              enterButton="Join"
              onSearch={handleJoinLeague}
            />,
          ]}
        >
          <Card.Meta
            title="Join a new league"
            description="Join a league created by a friend"
          />
        </Card>
      </Col>
    </Row>
  )
}

export default Home
