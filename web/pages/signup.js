import { Button, Col, Form, Icon, Input, Layout, Row } from 'antd'

export default class Signup extends React.Component {
  render() {
    return (
      <Layout style={{ height: '100%' }}>
        <Layout.Header>Header</Layout.Header>
        <Layout.Content type="flex">
          <Row
            type="flex"
            justify="center"
            align="middle"
            style={{ height: '100%' }}
          >
            <Col span={8}>
              <WrappedNormalSignupForm />
            </Col>
          </Row>
        </Layout.Content>
        <Layout.Footer />
      </Layout>
    )
  }
}

class SignupForm extends React.Component {
  signUp = async e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err)
        try {
          const response = await fetch('http://localhost:3001/signup', {
            method: 'POST',
            body: JSON.stringify(values),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          const json = await response.json()
          if (response.status === 409) {
            this.props.form.setFields({
              email: {
                value: values.email,
                errors: [new Error(json.error)]
              }
            })
          }
          if (response.ok) {
            console.log(json)
          }
        } catch (error) {
          console.error(error)
        }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.signUp}>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input
              prefix={<Icon type="user" />}
              type="email"
              placeholder="Email"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please enter a password' }]
          })(
            <Input
              prefix={<Icon type="lock" />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Sign up!
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedNormalSignupForm = Form.create({ name: 'signupForm' })(SignupForm)