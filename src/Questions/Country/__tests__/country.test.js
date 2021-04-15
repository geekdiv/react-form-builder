import React from 'react'
import {
  cleanup,
  getByText,
  screen,
  render,
  fireEvent
} from '@testing-library/react'
import QuestionCountry from '../'
import selectEvent from 'react-select-event'

import MutationObserver from '@sheerun/mutationobserver-shim'
window.MutationObserver = MutationObserver

afterEach(cleanup)

const question = {
  name: 'country_of_residence',
  type: 'country',
  label: 'This is the label of the country select',
  placeholder: 'Please select an option ^^',
  priorityOptions: ['United Kingdom'],
  errorMessages: {
    required: 'This field is required'
  }
}

const customListCountries = [
  { countryName: 'MyOwnCountry1', countryShortCode: 'MC1' },
  { countryName: 'MyOwnCountry2', countryShortCode: 'MC2' },
  { countryName: 'MyOwnCountry3', countryShortCode: 'MC3' },
  { countryName: 'MyOwnCountry4', countryShortCode: 'MC4' }
]

const setup = (customListCountries) => {
  const renderComponent = render(
    <QuestionCountry
      question={question}
      countryAndRegionsData={customListCountries}
      useForm={{ errors: {}, register: () => {}, setValue: jest.fn() }}
    />
  )

  const countryComponent = renderComponent.getByTestId('question-country')
  const placeholderComponent = renderComponent.getByText(
    'Please select an option ^^'
  )

  return { countryComponent, placeholderComponent }
}

const selectCountriesByOrder = async (placeholderComponent) => {
  await selectEvent.openMenu(placeholderComponent)
  fireEvent.keyDown(placeholderComponent, { key: 'ArrowDown' })
  fireEvent.keyDown(placeholderComponent, { key: 'Enter', code: 13 })
}
test('check the placeholder text', () => {
  const { countryComponent } = setup()
  getByText(countryComponent, 'Please select an option ^^')
})

test('Country label', () => {
  const { countryComponent } = setup()
  getByText(countryComponent, 'This is the label of the country select')
})

test('change value of select', async () => {
  const { placeholderComponent } = setup()
  await selectEvent.select(placeholderComponent, ['China'])

  expect(screen.getByText('China'))
})

test('check the custom country sent is the first', async () => {
  const { placeholderComponent } = setup()
  await selectEvent.openMenu(placeholderComponent)
  fireEvent.keyDown(placeholderComponent, { key: 'ArrowDown' })
  fireEvent.keyDown(placeholderComponent, { key: 'Enter', code: 13 })

  expect(screen.getByText('United Kingdom'))
})

test('check the countries are ordered as they are sent', async () => {
  const { placeholderComponent } = setup(customListCountries)
  for (let i = 0; i < customListCountries.length; i++) {
    await selectCountriesByOrder(placeholderComponent)
    expect(screen.getByText('MyOwnCountry' + (i + 1)))
  }
})

test('label tag is not displayed when label value is null', () => {
  const questionNoLabel = { ...question }
  delete questionNoLabel.label
  render(
    <QuestionCountry
      question={questionNoLabel}
      useForm={{
        errors: {},
        register: () => {},
        setValue: jest.fn()
      }}
    />
  )

  expect(!screen.queryByTestId('country-label'))
})

test('show an error message', () => {
  const { getByText } = render(
    <QuestionCountry
      question={question}
      useForm={{
        errors: {
          [question.name]: {
            type: 'required'
          }
        },
        register: () => {},
        setValue: jest.fn()
      }}
    />
  )
  expect(getByText(question.errorMessages.required)).toBeTruthy()
})
