import * as yup from 'yup'

const loginRequestSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
})

export { loginRequestSchema }
