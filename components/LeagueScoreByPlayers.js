import { Table } from 'antd'
import fetch from 'isomorphic-unfetch'

export default class LeagueScoreByPlayers extends React.Component {
  state = { data: [], message: 'No data' }

  componentDidMount = async () => {
    if (this.props.leagueHasStarted)
      try {
        const leagueID = window.location.pathname.split('/')[2]
        const response = await fetch(`/api/leagueScore/${leagueID}`)
        const json = await response.json()
        this.setState({ data: json.data })
      } catch (error) {
        console.error(error)
      }
    else this.setState({ message: 'League has not started' })
  }

  render = () => (
    <Table
      dataSource={this.state.data}
      columns={[
        { title: 'Name', dataIndex: 'picker[0].name' },
        {
          title: 'Score',
          dataIndex:
            'pickedCongressPerson[0]["~mentionedCongressPerson"][0].mentionCount',
          defaultSortOrder: 'ascend',
          sorter: (a, b) =>
            b.pickedCongressPerson[0]['~mentionedCongressPerson'][0]
              .mentionCount -
            a.pickedCongressPerson[0]['~mentionedCongressPerson'][0]
              .mentionCount,
        },
      ]}
      locale={{ emptyText: this.state.message }}
      pagination={false}
    />
  )
}
