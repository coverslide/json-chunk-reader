'use strict'

var test = require('tape')
var JSONChunkReader = require('./index.js')
var fs = require('fs')

test('basic functionality', function(t){
  var reader = new JSONChunkReader()
  var stream = fs.createReadStream('./fixture-test-data.txt')

  var offset = 0

  t.plan(12)
  
  reader.on('data', function(obj){
    offset += 1

    t.equal(obj.a, offset,'a offset ' + offset)
    t.equal(obj.b, offset+1,'b offset ' + offset)
    t.equal(obj.c, offset+2,'c offset ' + offset)
  })

  stream.on('end', function(){
    t.end()
  })

  
  stream.pipe(reader)
})
