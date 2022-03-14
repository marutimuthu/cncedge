var snap7 = require('node-snap7');

// CNC
// const ip = '192.168.0.251' 
// const rack = 0
// const slot = 1

// PLC
const ip = '192.168.1.111' // CNC
const rack = 0
const slot = 1

var s7client = new snap7.S7Client();

s7client.ConnectTo(ip, rack, slot, function(err) {
    if(err)
        return console.log(' >> Connection failed. Code #' + err + ' - ' + s7client.ErrorText(err));
});

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

setInterval(() => {

    /* 
    * Read PLC Inputs
    * Address: %I0.0 - %I0.4
    * Type: Boolean
    */
    s7client.EBRead(0, 4, function(err, res) {
        if(err)
            return console.error(' >> ABRead failed. Code #' + err + ' - ' + s7client.ErrorText(err));
        
        var data = res.readUInt8(0)
        var result = dec2bin(data)
        // console.log("Input " + result)
    });

    /* 
    * Read PLC Output
    * Address: %Q0.0 - %Q0.1
    * Type: Boolean
    */
    s7client.ABRead(0, 3, function(err, res) {
        if(err)
            return console.log(' >> ABRead failed. Code #' + err + ' - ' + s7client.ErrorText(err));
        
        var data = res.readUInt8(0)
        // console.log(data)
        var result = dec2bin(data)
        console.log("Output " + result)
    });

    /* 
    * Read PLC Merker
    * Address: %MW52
    * Type: Int
    */
    s7client.MBRead(52, 2, function(err, res) {
        if(err)
            return console.log(' >> ABRead failed. Code #' + err + ' - ' + s7client.ErrorText(err));
        var data = res.readUInt16BE(0)
        console.log("Merker "+ data)
    });
    
    
    /* 
    * Read PLC Merker
    * Address: %MD4
    * Type: Real
    */
    s7client.MBRead(4, 4, function(err, res) {
        if(err)
            return console.log(' >> ABRead failed. Code #' + err + ' - ' + s7client.ErrorText(err));
        
        var data = res.readFloatBE(0)
        console.log("Analog: ", data)
    });
    
    /* 
    * Read PLC Merker
    * Address: %IW64
    * Type: Int
    * Untested ****
    */
    s7client.MBRead(112, 4, function(err, res) {
        if(err)
            return console.log(' >> ABRead failed. Code #' + err + ' - ' + s7client.ErrorText(err));
        
        var data = res.readUInt16BE(0)
        console.log("Raw: ", data)
    });

}, 2000);
