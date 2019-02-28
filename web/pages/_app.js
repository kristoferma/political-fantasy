import { Layout } from 'antd'
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
          <Layout.Header>Header</Layout.Header>
          <Layout.Content type="flex">
            <Component {...pageProps} />
          </Layout.Content>
        </Layout>
      </Container>
    )
  }
}
