import * as yup from 'yup'

const postUpdateRequestSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
})

export { postUpdateRequestSchema }
