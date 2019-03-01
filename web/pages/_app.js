/* eslint-disable jsx-a11y/anchor-is-valid */
import { Layout, Menu, Avatar } from 'antd'
import Link from 'next/link'
import App, { Container } from 'next/app'
import React from 'react'
import '../static/styles/application.less'

export default class MyApp extends App {
  state = {
    name: false,
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  onSuccesfullAuthentication = name => {
    this.setState({ name })
  }

  render() {
    const { Component, pageProps } = this.props
    pageProps.onSuccesfullAuthentication = this.onSuccesfullAuthentication
    return (
      <Container>
        <Layout
          style={{
            height: '100%',
          }}
        >
          <Layout.Header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Menu
              theme="dark"
              mode="horizontal"
              style={{
                lineHeight: '64px',
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
              defaultSelectedKeys={['0']}
            >
              <Menu.Item key="0">
                <Link href="/index">
                  <a>Political Fantasy</a>
                </Link>
              </Menu.Item>
              <Menu.Item key="1">
                <Link href="/congress">
                  <a>Congress</a>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
              <Menu.Item key="4" style={{ marginLeft: 'auto' }}>
                {this.state.name ? (
                  <Link
                    href={`/user?user=${this.state.name}`}
                    as={`/user/${this.state.name}`}
                  >
                    <a>{this.state.name}</a>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <a>Login / Signup</a>
                  </Link>
                )}
              </Menu.Item>
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
