import { Form, Input, Icon, DatePicker, TimePicker, Button } from 'antd'

class CreateNewLeague extends React.Component {
  signUp = async e => {
    e.preventDefault()
    const { validateFields } = this.props.form
    validateFields(async (err, values) => {
      console.log(values)
    })
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const { getFieldDecorator } = this.props.form
    const { isAuthenticated } = this.props
    return (
      <Form onSubmit={this.signUp}>
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
          })(<DatePicker disabled={!isAuthenticated} />)}
        </Form.Item>
        <Form.Item label="Starting Time">
          {getFieldDecorator('time', {
            rules: [
              {
                required: true,
                message: 'Please select a starting time for the league',
              },
            ],
          })(<TimePicker disabled={!isAuthenticated} />)}
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
