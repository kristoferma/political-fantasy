import { Form, Input, Icon, DatePicker, Button } from 'antd'

class CreateNewLeague extends React.Component {
  onSubmit = async e => {
    e.preventDefault()
    const { validateFields } = this.props.form
    validateFields(async (err, values) => {
      const { name, date } = values
      if (!err) {
        const response = await fetch(
          'http://localhost:3000/api/createNewLeague',
          {
            method: 'POST',
            body: JSON.stringify({ name, date: date.toISOString() }),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
    })
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const { getFieldDecorator } = this.props.form
    const { isAuthenticated } = this.props
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Item label="League Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please name your league?' }],
          })(
            <Input
              prefix={<Icon type="profile" />}
              type="name"
              placeholder="Name"
              disabled={!isAuthenticated}
            />
          )}
        </Form.Item>
        <Form.Item label="Starting Date">
          {getFieldDecorator('date', {
            rules: [
              {
                required: true,
                message: 'Please select a starting date for the league',
              },
            ],
          })(<DatePicker disabled={!isAuthenticated} showTime />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Create a new League
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'createNewLeagueForm' })(CreateNewLeague)
