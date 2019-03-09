/* eslint-disable camelcase */
import { Table, Input } from 'antd'
import Fuse from 'fuse.js'

import states from '../constants/states'

const calculateAge = date => {
  const today = new Date()
  const birthday = new Date(date)
  const difference = today - birthday
  const age = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25))
  return age
}

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    filters: [
      { text: 'Representative', value: 'Representative' },
      { text: 'Senator', value: 'Senator' },
      { text: 'Delegate', value: 'Delegate' },
    ],
    onFilter: (value, record) => record.title.includes(value),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => b.name.localeCompare(a.name),
    defaultSortOrder: 'descend',
  },
  {
    title: 'Age',
    dataIndex: 'date_of_birth',
    sorter: (a, b) => new Date(a.date_of_birth) - new Date(b.date_of_birth),
    render: date => <span>{calculateAge(date)}</span>,
  },
  {
    title: 'Political Party',
    dataIndex: 'party',
    filters: [
      {
        text: 'Democratic Party',
        value: 'Democratic Party',
      },
      {
        text: 'Republican Party',
        value: 'Republican Party',
      },
      {
        text: 'Other',
        value: 'other',
      },
    ],
    onFilter: (value, record) =>
      value === 'other'
        ? record.party !== 'Democratic Party' &&
          record.party !== 'Republican Party'
        : value === record.party,
    filterMultiple: false,
  },
  {
    title: 'Seniority',
    dataIndex: 'seniority',
    sorter: (a, b) => b.seniority - a.seniority,
  },
  {
    title: 'State',
    dataIndex: 'state',
    filters: states.map(state => ({ text: state, value: state })),
    onFilter: (value, record) => value === record.state,
  },
]

export default class CongressMembersTable extends React.Component {
  state = { data: [], filteredData: [] }

  componentDidMount = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/congress', {
        headers: {
          Accept: 'application/json',
        },
      })
      const { data } = await response.json()
      const congressMembers = data.map(
        ({
          title,
          first_name,
          middle_name,
          last_name,
          date_of_birth,
          party,
          seniority,
          state,
          uid,
        }) => ({
          title,
          name: middle_name
            ? `${last_name}, ${first_name} ${middle_name}`
            : `${last_name}, ${first_name}`,
          date_of_birth,
          party: party[0].name,
          seniority,
          state: state[0].name,
          uid,
        })
      )

      this.setState({ data: congressMembers, filteredData: congressMembers })
    } catch (error) {
      console.error(error)
    }
  }

  handleSearch = e => {
    if (e.target.value.length < 1)
      return this.setState(state => ({
        filteredData: state.data,
      }))
    const fuse = new Fuse(this.state.data, {
      shouldSort: true,
      threshold: 0.2,
      minMatchCharLength: 1,
      keys: ['name'],
    })
    const results = fuse.search(e.target.value)
    return this.setState({ filteredData: results })
  }

  render() {
    const { filteredData } = this.state
    const { onSelect } = this.props
    return [
      <Input.Search
        placeholder="Search for a congress person"
        onChange={this.handleSearch}
      />,
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="date_of_birth"
        onRow={
          onSelect ? record => ({ onClick: () => onSelect(record) }) : null
        }
      />,
    ]
  }
}
