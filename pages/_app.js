/* eslint-disable jsx-a11y/anchor-is-valid */
import { Layout, Menu, message } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import App, { Container } from 'next/app'
import React from 'react'
import fetch from 'isomorphic-unfetch'
import '../static/styles/application.less'

export default class MyApp extends App {
  state = {
    name: false,
    selectedMenuItem: '',
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return { pageProps }
  }

  componentDidMount = async () => {
    await this.verifyLogin()
    if (window)
      this.setState({
        selectedMenuItem: window.location.pathname.split('/')[1],
      })
    Router.events.on('routeChangeStart', url =>
      this.setState({ selectedMenuItem: url.split('/')[1] })
    )
  }

  onSuccesfullAuthentication = name => {
    this.setState({ name })
  }

  verifyLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/verifyLogin', {
        method: 'GET',
      })
      if (response.ok) {
        const { name } = await response.json()
        this.setState({ name })
      }
    } catch (error) {
      console.error(error)
    }
  }

  logout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
      })
      const json = await response.json()
      if (response.ok) {
        message.success(json.message)
        this.setState({ name: false })
        Router.push('/')
      } else {
        message.error(json.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { Component, pageProps } = this.props
    pageProps.onSuccesfullAuthentication = this.onSuccesfullAuthentication
    pageProps.isAuthenticated = this.state.name !== false
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
              selectedKeys={[this.state.selectedMenuItem]}
            >
              <Menu.Item key="index">
                <Link href="/index">
                  <a>Political Fantasy</a>
                </Link>
              </Menu.Item>
              {this.state.name ? (
                <Menu.Item key="leagues">
                  <Link href="/leagues">
                    <a>Leagues</a>
                  </Link>
                </Menu.Item>
              ) : null}
              <Menu.Item key="congress">
                <Link href="/congress">
                  <a>Congress</a>
                </Link>
              </Menu.Item>
              <Menu.Item key="2" onClick={this.verifyLogin}>
                Verify Login
              </Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
              {this.state.name ? (
                <Menu.SubMenu
                  title={this.state.name}
                  style={{ marginLeft: 'auto' }}
                >
                  <Menu.Item key="signup" onClick={this.logout}>
                    Log out
                  </Menu.Item>
                </Menu.SubMenu>
              ) : (
                <Menu.Item key="4" style={{ marginLeft: 'auto' }}>
                  <Link href="/signup">
                    <a>Login / Signup</a>
                  </Link>
                </Menu.Item>
              )}
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
