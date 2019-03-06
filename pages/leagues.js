import React, { Component } from 'react'
import { List, Card, Row, Col, Table } from 'antd'
import Router from 'next/router'

export default class extends Component {
  static async getInitialProps(props) {
    // Check if rendered on server
    if (props.query && props.query.myLeagues) return props.query

    try {
      const response = await fetch('http://localhost:3000/leagues', {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      })
      const json = await response.json()
      return json
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  render() {
    return (
      <Row
        type="flex"
        justify="center"
        style={{ height: '100%', width: '100%', marginTop: '1%' }}
      >
        <Col span={20}>
          <Table
            dataSource={this.props.myLeagues}
            pagination={false}
            columns={[
              { title: 'Name', dataIndex: 'leagueName' },
              {
                title: 'Start Date',
                dataIndex: 'leagueDate',
                render: date => new Date(date).toLocaleString(),
              },
            ]}
            onRowClick={record => Router.push(`/leagues/${record.uid}`)}
          />
        </Col>
      </Row>
    )
  }
}
