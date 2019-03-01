import { Col, Row } from 'antd'
import SignupForm from '../components/SignupForm'

export default ({ onSuccesfullAuthentication }) => (
  <Row type="flex" justify="center" align="middle" style={{ height: '100%' }}>
    <Col span={8}>
      <SignupForm onSuccesfullAuthentication={onSuccesfullAuthentication} />
    </Col>
  </Row>
)
