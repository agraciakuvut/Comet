var Comet;

Comet = (function() {
    function Comet(options) {
        this.stop = false;
        this.noerror = true;
        this.url = options.url;
        this.onMessage = options.onMessage;
        this.params = options.params;
    }

    Comet.prototype.connect = function() {
        this.stop = false;
        return this.ajax = $.ajax({
            method: 'get',
            url: this.url,
            data: this.params,
            type: 'json',
            success: (function(_this) {
                return function(data, status) {
                    var e;
                    if (status === 'success') {
                        try {
                            _this.params = _this.onMessage(data);
                            return _this.noerror = true;
                        } catch (_error) {
                            e = _error;
                            _this.disconnect();
                            throw e;
                        }
                    }
                };
            })(this),
            complete: (function(_this) {
                return function() {
                    if (!_this.stop) {
                        if (!_this.noerror) {
                            setTimeout((function() {
                                _this.connect();
                            }), 5000);
                        } else {
                            _this.connect();
                        }
                        return _this.noerror = false;
                    }
                };
            })(this)
        });
    };

    Comet.prototype.doRequest = function(params) {
        if (!this.stop) {
            return $.ajax({
                url: this.url,
                method: 'get',
                data: params
            });
        }
    };

    Comet.prototype.disconnect = function() {
        return this.stop = true;
    };

    return Comet;

})();