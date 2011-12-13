function alertDismissed() {
    //simple function to handle alert box upon success
    return false;
}

function win(photo) {
    
    //major win, we got a photo, lets "load"
    $('body').html('<div class="load"></div>');
    
    //again, we delay to allow the interfaces to close and open (yep, timing issues)
    window.setTimeout(function () {
        $('body').html('');
        window.plugins.twitter.sendTweet(
            //if successful, we just go back!
            function(s){
                //lets put an alert here
                navigator.notification.alert(
                    'Tweet sent successfully!',  // success message
                    alertDismissed,         // callback (won't work without)
                    'Success!',            // alert title
                    'Okay!'                  // button name
                );
                //and be nice to the user
                $('body').html('<a href="javascript:snap()"></a>'); 
            }, 
            function(e){ 
                if(e != "Cancelled"){
                //seems we got an external error :(
                    $('body').html('<h3>Errorz! D;</h3>');
                }else{
                //again, be nice to the user
                    $('body').html('<a href="javascript:snap()"></a>');
                }
            },
            photo);
        },1333);
    
}

function fail(err) {
    
    //damn, we failed to get a picture, but why?
    if(err != "no image selected"){
        //there doesn't seem to be a camera (iPad 1?)
        $('body').html('<h3>Cannoe find camera D;</h3>');
    }else{
        //they probably just clicked cancel here so let's just be nice
        $('body').html('<a href="javascript:snap()"></a>'); 
    }
    
}

function showcam(){

    //set options, 50 quality to stop memory problems
    var opts = { 
        quality: 50,
        //allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300, 
        targetHeight: 300, 
        destinationType : Camera.DestinationType.FILE_URI 
    }
    
    //lets roll
    navigator.camera.getPicture(win, fail, opts);
    
}

function snap() {
    
    //lets show the user we are working
    $('body').html('<div class="load"></div>');
    
    //delay the interface a little (yes, delay!)
    window.setTimeout("showcam()",666);

}

$.fn.preload = function() {
    
    //obligatory jquery preload function
    this.each(function(){
        $('<img/>')[0].src = this;
    });
    
}

function onBodyLoad(){	
	
    //lets load some images
    $(['images/ajax_loader.gif','images/ajax_loader_retina.gif', 'images/setup.png', 'images/setup_retina.png', 'images/snap.png', 'images/snap_retina.png']).preload();
    
    //send the fact we are ready to go go
	document.addEventListener("deviceready", onDeviceReady, false);
    
}

function onDeviceReady(){
    
    //check if twitter is avaliable (i.e. are we on iOS5?  (we should be!))
    window.plugins.twitter.isTwitterAvailable(function(f){
        if(f == 1){
            //awesome, we are, so lets check if there are twitter accounts
            window.plugins.twitter.isTwitterSetup(function(f){
                if(f == 1){
                    //yay!  we have twitter accounts, so lets get an image
                    snap();
                }else{
                    //no twitter account, so lets inform the user they need to set one up
                    $('body').html('<h3 class="notsetup">Cannoe find Twitter accounts D;</h3><a class="setup" href="prefs:root=TWITTER"></a>');
                }
            });
        }else{
            //self explantory, no ability for twitter sdk == no iOS5
            $('body').html('<h3>Cannoe find iOS5 D;</h3>');
        }
    });
    
}