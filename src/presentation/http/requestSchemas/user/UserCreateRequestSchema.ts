import * as yup from 'yup'

const createUserRequestSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  password_confirmation: yup.string().required().oneOf([yup.ref('password'), ''], 'Passwords must match'),
})

export { createUserRequestSchema }
