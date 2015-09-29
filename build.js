var inline   = require('inline-styles')
var generate = require('./generate')
var m        = require('multiline')
var mkdirp   = require('mkdirp')
var path     = require('path')
var fs       = require('fs')

mkdirp.sync(__dirname + '/invoices')

function build (id, invoice) {
  var dest = path.resolve(__dirname + '/invoices', id + '.html')

  invoice.id = id

  fs.writeFile(dest, inline(generate(invoice), __dirname))
}

build('invoice-id-here', {
  currency: 'USD',
  items: [
    { category: 'Services', description: 'Software Development and Design Services', amount: 99999 }
  ],
  summary: m(function () {/*
    Invoice description here
  */})
})
