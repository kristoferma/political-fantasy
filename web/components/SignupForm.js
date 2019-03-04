import { Button, Form, Icon, Input, message, Radio } from 'antd'
import Router from 'next/router'

class SignupForm extends React.Component {
  state = { isLogin: true }

  signUp = async e => {
    e.preventDefault()
    const { validateFields, setFields } = this.props.form
    validateFields(async (err, values) => {
      if (!err)
        try {
          const response = await fetch('http://localhost:3001/signup', {
            method: 'POST',
            body: JSON.stringify(values),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const json = await response.json()
          if (response.status === 409) {
            setFields({
              email: {
                value: values.email,
                errors: [new Error(json.error)],
              },
            })
          }
          if (response.ok) {
            this.props.onSuccesfullAuthentication(json.name)
            message.success(json.message, 10)
            Router.push(`/user?user=${json.name}`, `/user/${json.name}`)
          }
        } catch (error) {
          console.error(error)
        }
    })
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const { getFieldDecorator } = this.props.form
    const { isLogin } = this.state
    return (
      <Form onSubmit={this.signUp}>
        <Form.Item>
          <Radio.Group
            defaultValue="login"
            buttonStyle="solid"
            onChange={({ target }) => {
              this.setState({ isLogin: target.value === 'login' })
            }}
          >
            <Radio.Button value="login">Login</Radio.Button>
            <Radio.Button value="signup">Signup</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {isLogin ? null : (
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'What is your name?' }],
            })(<Input placeholder="Full Name" prefix={<Icon type="user" />} />)}
          </Form.Item>
        )}
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'What is your email?' }],
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
            rules: [{ required: true, message: 'Please enter a password' }],
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
            {isLogin ? 'Login!' : 'Sign up!'}
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'signupForm' })(SignupForm)
