import * as yup from 'yup'

const postCreateRequestSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
})

export { postCreateRequestSchema }
