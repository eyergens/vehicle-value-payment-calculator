import {expect, test} from 'vitest'
import {isInvalid} from './validation.ts'

test.for([
  {val: 20, min: 0, max: 10, expected: true},
  {val: -10, min: 0, max: 10, expected: true},
  {val: 5, min: 0, max: 10, expected: false},
  {val: 0, min: 0, max: 10, expected: false},
  {val: 10, min: 0, max: 10, expected: false}
])('isInvalid($val, $min, $max) -> $expected', ({val, min, max, expected}) => {
  expect(isInvalid(val, min, max)).toBe(expected)
})