import { Card, Row, Col, Button } from 'antd'
import Link from 'next/link'

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
            <Link href="/createLeague">
              <Button type="primary" disabled>
                Join
              </Button>
            </Link>,
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
