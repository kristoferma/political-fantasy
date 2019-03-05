import { Col, Row } from 'antd'
import CreateNewLeagueForm from '../components/CreateNewLeagueForm'

export default ({ isAuthenticated }) => (
  <Row type="flex" justify="center" align="middle" style={{ height: '100%' }}>
    <Col span={8}>
      <CreateNewLeagueForm isAuthenticated={isAuthenticated} />
    </Col>
  </Row>
)
