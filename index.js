'use strict'

var mkstream = require('mkstream')
var jzon = require('jzon')

mkstream(JsonChunkReader)

//breaks up a stream of newline-separated JSON text into JS objects as data
module.exports = JsonChunkReader

function JsonChunkReader(options){
  mkstream.Stream.call(this, options)
  this.writable = true
  this.readable = true
  this.string = ''
  this.cursor = 0
}

JsonChunkReader.prototype.write = function(chunk){
  this.string += ''+chunk
  var substring = this.string.substring(this.cursor)

  var slices = substring.split(/[\n\r]+/g)

  for(var i = 0,l=slices.length-1;i<l;i++){
    var slice = slices[i]
    this.cursor += slice.length + 1
    var data = jzon.parse(slice)
    if(data instanceof Error)
      this.emit('error', data)
    else
      this.emit('data', data)
  }
}

JsonChunkReader.prototype.end = function(){
  this.emit('end')
}
