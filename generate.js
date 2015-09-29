var minstache  = require('minstache').compile
var dateformat = require('dateformat')
var fs         = require('fs')

module.exports = generate

var template = minstache(fs.readFileSync(
  __dirname + '/index.html'
, 'utf8'))

function generate(invoice) {
  var total = 0

  invoice.items = invoice.items.map(function(item) {
    item.amount = parseFloat(item.amount || 0)
    total += item.amount
    item.amount = item.amount.toFixed(2)
    return item
  })

  invoice.categories = invoice.categories !== false
  invoice.summary    = (invoice.summary || '').trim()
  invoice.total      = total.toFixed(2)

  invoice.issued = invoice.issued || new Date
  invoice.due    = invoice.due || new Date(+invoice.issued + 1000*60*60*24*30)
  invoice.issued = format(invoice.issued)
  invoice.due    = format(invoice.due)

  if (invoice.tax) {
    var tax = invoice.tax
    tax.taxed = (parseFloat(invoice.total) * tax.amount).toFixed(2)
    tax.total = (
      parseFloat(invoice.total) * (1 + tax.amount)
    ).toFixed(2)

    var length = Math.max(
        tax.taxed.length
      , tax.total.length
      , invoice.total.length
    )

    tax.taxed = pad(tax.taxed, length)
    tax.total = pad(tax.total, length)
    invoice.total = pad(invoice.total, length)
  }

  return template(invoice)
}

function format(date) {
  return dateformat(new Date(date), 'dd-mmm-yy')
}

function pad(str, length) {
  str = String(str)
  while (str.length < length) {
    str = ' ' + str
  }
  return str
}
