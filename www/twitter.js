var Twitter = function(){

    this.onopen = 0;
	this.onmessage = null;

};

Twitter.prototype.isTwitterAvailable = function(response){
    PhoneGap.exec(response, null, "com.phonegap.twitter", "isTwitterAvailable", []);
};

Twitter.prototype.isTwitterSetup = function(response){
    PhoneGap.exec(response, null, "com.phonegap.twitter", "isTwitterSetup", []);
};

Twitter.prototype.sendTweet = function(success, failure, imageAttach){
    if(typeof imageAttach === "undefined") imageAttach = "";
    
    PhoneGap.exec(success, failure, "com.phonegap.twitter", "sendTweet", [imageAttach]);
};

PhoneGap.addConstructor(function() {
    if(!window.plugins) window.plugins = {};
    window.plugins.twitter = new Twitter();
});
