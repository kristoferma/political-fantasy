/* eslint-disable camelcase */
import { Table } from 'antd'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  { title: 'Birthday', dataIndex: 'date_of_birth', key: 'birthday' },
  { title: 'Political Party', dataIndex: 'party', key: 'party' },
  { title: 'Seniority', dataIndex: 'seniority', key: 'seniority' },
  { title: 'State', dataIndex: 'state', key: 'state' },
]

export default class SignupForm extends React.Component {
  state = { data: [] }

  componentDidMount = async () => {
    const houseData = await import('../static/house.json')
    const congressMembers = houseData.results[0].members.map(
      ({
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        party,
        seniority,
        state,
      }) => ({
        name: middle_name
          ? `${first_name} ${middle_name} ${last_name}`
          : `${first_name} ${last_name}`,
        date_of_birth,
        party,
        seniority,
        state,
      })
    )
    this.setState({ data: congressMembers })
  }

  render() {
    const { data } = this.state
    return <Table columns={columns} dataSource={data} />
  }
}
