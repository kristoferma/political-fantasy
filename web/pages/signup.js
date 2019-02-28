import { Col, Row } from 'antd'
import SignupForm from '../components/SignupForm'

export default () => (
  <Row type="flex" justify="center" align="middle" style={{ height: '100%' }}>
    <Col span={8}>
      <SignupForm />
    </Col>
  </Row>
)
