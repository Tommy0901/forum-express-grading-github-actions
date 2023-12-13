const methodOverride = require('method-override')

module.exports = {
  methodOverrideHandler: methodOverride('_method')
}
