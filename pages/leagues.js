import React, { Component } from 'react'
import { Row, Col, Table } from 'antd'
import Router from 'next/router'

class Leagues extends Component {
  static async getInitialProps(props) {
    // Check if rendered on server
    if (props.query && props.query.data) {
      return props.query
    }

    try {
      const response = await fetch('http://localhost:3000/leagues', {
        headers: {
          Accept: 'application/json',
        },
      })
      const { data } = await response.json()
      return { data }
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  render() {
    const { data } = this.props
    return (
      <Row
        type="flex"
        justify="center"
        style={{ height: '100%', width: '100%', marginTop: '1%' }}
      >
        <Col span={20}>
          <Table
            dataSource={data}
            pagination={false}
            columns={[
              { title: 'Name', dataIndex: 'leagueName' },
              {
                title: 'Start Date',
                dataIndex: 'leagueDate',
                render: date => new Date(date).toLocaleString(),
              },
            ]}
            onRow={record => ({
              onClick: () => Router.push(`/league/${record.uid}`),
            })}
            rowKey="uid"
          />
        </Col>
      </Row>
    )
  }
}

export default Leagues
