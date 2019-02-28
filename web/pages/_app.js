import { Layout, Menu } from 'antd'
import Link from 'next/link'
import App, { Container } from 'next/app'
import React from 'react'
import '../static/styles/application.less'

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Layout style={{ height: '100%' }}>
          <Layout.Header>
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ lineHeight: '64px' }}
              defaultSelectedKeys={['0']}
            >
              <Menu.Item key="0">
                <Link href="/index">Political Fantasy</Link>
              </Menu.Item>
              <Menu.Item key="1">
                <Link href="/congress">Congress</Link>
              </Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Layout.Header>
          <Layout.Content type="flex">
            <Component {...pageProps} />
          </Layout.Content>
          <Layout.Footer style={{ textAlign: 'center' }}>
            Political Fantasy ©2018 Created by Kristófer Másson
          </Layout.Footer>
        </Layout>
      </Container>
    )
  }
}
