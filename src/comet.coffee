class Comet

  constructor: (options) ->
    @stop = false
    @noerror = true
    @url = options.url
    @onMessage = options.onMessage
    @onError = if options.onError then options.onError else null
    @params = options.params
    @method = if options.method then options.method else 'get'

  connect: ->
    @stop = false
    @ajax = $.ajax
      method: @method
      url: @url
      data: @params
      type: 'json'
      error: (data, status) =>
        @disconnect()
        if @onError
          @onError data
      success: (data, status) =>
        if status == 'success'
          try
            @params = @onMessage data
            @noerror = true
          catch e
            @disconnect()
            throw e
      complete: =>
        if !@stop
          if !@noerror
            setTimeout (=>
              @connect()
              return
            ), 5000
          else
            @connect()
          @noerror = false

  doRequest: (params) ->
    if !@stop
      $.ajax
        url: @url
        method: @method
        data: params


  disconnect: ->
    @stop = true