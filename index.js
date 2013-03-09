require('mkstream')(JsonChunkReader)

//TODO: modularize this
//breaks up a stream of newline-separated JSON text into JS objects as data
module.exports = JsonChunkReader

function JsonChunkReader(){
  this.readable=true
  this.writable=true
  this.string = ''
  this.cursor = 0
}

JsonChunkReader.prototype.write = function(data){
  this.string += data
  var substring = this.string.substring(this.cursor)

  var slices = substring.split(/\n/g)

  try{
    for(var i = 0,l=slices.length-1;i<l;i++){
      var slice = slices[i]
      this.cursor += slice.length + 1
      var data = JSON.parse(slice)
      this.emit('data', data)
    }
  } catch(err){
    this.emit('error', err)
  }
}

JsonChunkReader.prototype.end = function(){
  this.emit('end')
}
