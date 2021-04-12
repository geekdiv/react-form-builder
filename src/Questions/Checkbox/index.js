/** @jsx jsx */
/** @jsxRuntime classic */
import { Link, jsx } from 'theme-ui'

import Checkbox from '../../Fields/Checkbox'
import ErrorMessage from '../../Fields/Error'
import Label from '../../Fields/Label'

import ReactMarkdown from 'react-markdown'

const styles = {
  fullWidth: {
    gridColumnStart: '1',
    gridColumnEnd: '3'
  },
  selectOption: {
    background: 'bg',
    color: 'black'
  },
  markDown: {
    fontFamily: 'regular',
    width: ['90%', '95%', '95%'],
    p: {
      margin: 0
    }
  }
}

const QuestionCheckbox = ({
  component,
  variant,
  question,
  useForm,
  onLinkOpen
}) => {
  const { errors, register } = useForm
  const CustomComponent = ({ component }) => component(question, useForm)

  const MarkDownLink = ({ href, children }) =>
    href.startsWith('#') ? (
      <Link
        href={`${href}`}
        target='_self'
        onClick={() => onLinkOpen(href.toString().substr(1))}
      >
        {children}
      </Link>
    ) : (
      <Link href={`${href}`} target='_blank'>
        {children}
      </Link>
    )
  return component ? (
    <CustomComponent component={component} />
  ) : (
    <div
      sx={{
        ...(question.isFullWidth && styles.fullWidth)
      }}
    >
      <div
        sx={{
          variant: 'forms.checkbox.' + variant
        }}
      >
        <div sx={styles.centerStyle} key={question.name}>
          <Label sx={styles.centerStyle}>
            <Checkbox
              sx={styles.checkboxMinWidth}
              name={question.name}
              defaultChecked={question?.defaultChecked}
              ref={register({
                ...question.registerConfig
              })}
              data-testid='question-checkbox'
            />
            <ReactMarkdown
              sx={styles.markDown}
              source={question.label}
              renderers={{
                link: MarkDownLink
              }}
            />
          </Label>
          {errors[question.name] &&
            errors[question.name].type === 'required' && (
              <ErrorMessage
                message={
                  question.errorMessages && question.errorMessages.required
                }
              />
            )}
        </div>
      </div>
    </div>
  )
}

export default QuestionCheckbox
