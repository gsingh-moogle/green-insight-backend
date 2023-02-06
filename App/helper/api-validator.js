const { validationResult, check } = require('express-validator')

exports.resultsValidator = (req) => {
  const messages = []
  if (!validationResult(req).isEmpty()) {
    const errors = validationResult(req).array()
    for (const i of errors) {
      messages.push(i)
    }
  }
  return messages
}

exports.projectRegisterValidator = () => {
  return [
    check('region_id')
      .notEmpty()
      .withMessage('Region is required'),
    check('project_name')
      .notEmpty()
      .withMessage('Project name is required'),
    check('description')
      .notEmpty()
      .withMessage('Description is required'),
    check('start_date')
      .notEmpty()
      .withMessage('Start date is required'),
    check('end_date')
      .notEmpty()
      .withMessage('End date is required'),
    check('manager_name')
      .notEmpty()
      .withMessage('Manager name is required'),
    check('manager_email')
      .notEmpty()
      .withMessage('Manager email is required')
      .isEmail()
      .withMessage('Manager email is not valid'),
    check('type')
      .notEmpty()
      .withMessage('Project type is required'),
  ]
}

exports.projectRatingValidator = () => {
  return [
    check('project_id')
      .notEmpty()
      .withMessage('Project id is required'),
    check('rating')
      .notEmpty()
      .withMessage('Rating is required'),
  ]
}

exports.loginValidator = () => {
  return [
    check('username').notEmpty().withMessage('username or email is required'),
    check('password').notEmpty().withMessage('password is required')
  ]
}

// how to use express validator in controller for results message
// const errors = resultsValidator(req)
//   if (errors.length > 0) {
//     return res.status(400).json({
//       method: req.method,
//       status: res.statusCode,
//       error: errors
//     })
//   }