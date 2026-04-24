import * as yup from 'yup'

const passwordResetRequestSchema = yup.object().shape({
  email: yup.string().required(),
})

export { passwordResetRequestSchema }
