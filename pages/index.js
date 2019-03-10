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
      <Col span={8} offset={4}>
        <Card
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
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
      <Col span={8}>
        <Card
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
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
