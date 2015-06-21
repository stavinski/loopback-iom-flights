var parser = new require('xml2js').Parser({ normalizeTags: true, explicitArray: false });

module.exports = function(Flight) {

  // remove from public rest api
  Flight.disableRemoteMethod('find', true);
  Flight.disableRemoteMethod('invoke', true);

  function parseResult(cb, err, result) {
    if (err) {
      cb(err, null);
      return;
    }

    parser.parseString(result, function (err, json) {
      if (err) {
        cb(err, null);
        return;
      }

      cb(null, json.flights);
    });
  }

  Flight.arrivals = function (cb) {
    Flight.find('arrivals', parseResult.bind(this, cb));
  };

  Flight.departures = function (cb) {
    Flight.find('departures', parseResult.bind(this, cb));
  };

  // expose to public rest api
  ['arrivals', 'departures'].forEach(function (mth) {
    Flight.remoteMethod(mth, {
      http: { verb: 'get' },
      description: 'retrieve flight: ' + mth,
      returns: { arg: 'flights', type: 'array' }
    });
  });

};