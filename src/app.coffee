React = require 'react'
Rx = require 'rx'
Body = require 'rxmarbles/views/body'
Streams = require 'rxmarbles/controllers/streams'

Rx.Observable.zip(Streams.s1, Streams.s2, Streams.s3, (x,y,z) -> [x,y,z])
  .subscribe((listSerializedStreams) ->
    React.renderComponent(
      Body({streams: listSerializedStreams}),
      document.getElementById('rxmarblesapp')
    )
  )
