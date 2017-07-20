var PORT = 843;  
var POLICY_XML =  
'<cross-domain-policy>' +  
    '<site-control permitted-cross-domain-policies="master-only"/>'+  
    '<allow-access-from domain="*" to-ports="*" />' +  
'</cross-domain-policy>';  
  
  
var net = require('net');  
net.createServer(function(flashSocketPolicyServer) {  
    flashSocketPolicyServer.setTimeout(1500, function() {  
        console.log(flashSocketPolicyServer.remoteAddress + ' timeout');  
        flashSocketPolicyServer.destroy();  
    });  
    flashSocketPolicyServer.on('data', function(data) {  
        if(data.toString() == '<policy-file-request/>\0') {  
            console.log(flashSocketPolicyServer.remoteAddress + ' crossed');  
            flashSocketPolicyServer.end(POLICY_XML);     
        } else {  
            console.log(flashSocketPolicyServer.remoteAddress + ' refused');  
            console.log("not a policy request");  
            flashSocketPolicyServer.destroy();  
        }  
    });  
}).listen(PORT, function() {  
    console.log('policy service established');  
});  