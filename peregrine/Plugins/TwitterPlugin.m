//
//  TwitterPlugin.m
//  TwitterPlugin
//
//  Created by Antonelli Brian on 10/13/11.
//

#import "TwitterPlugin.h"
#ifdef PHONEGAP_FRAMEWORK
    #import <PhoneGap/JSONKit.h>
#else
    #import "JSONKit.h"
#endif

#define TWITTER_URL @"http://api.twitter.com/1/"

@implementation TwitterPlugin

- (void) isTwitterAvailable:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSString *callbackId = [arguments objectAtIndex:0];
    TWTweetComposeViewController *tweetViewController = [[TWTweetComposeViewController alloc] init];
    BOOL twitterSDKAvailable = tweetViewController != nil;

    // http://brianistech.wordpress.com/2011/10/13/ios-5-twitter-integration/
    if(tweetViewController != nil){
        [tweetViewController release];
    }
    
    [super writeJavascript:[[PluginResult resultWithStatus:PGCommandStatus_OK messageAsInt:twitterSDKAvailable ? 1 : 0] toSuccessCallbackString:callbackId]];
}

- (void) isTwitterSetup:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSString *callbackId = [arguments objectAtIndex:0];
    BOOL canTweet = [TWTweetComposeViewController canSendTweet];
    
    [super writeJavascript:[[PluginResult resultWithStatus:PGCommandStatus_OK messageAsInt:canTweet ? 1 : 0] toSuccessCallbackString:callbackId]];
}

- (void) sendTweet:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    // arguments: callback, image attachment
    NSString *callbackId = [arguments objectAtIndex:0];
    NSString *imageAttach = [arguments objectAtIndex:1];

    TWTweetComposeViewController *tweetViewController = [[TWTweetComposeViewController alloc] init];
    
    BOOL ok = YES;
    NSString *errorMessage;
    
    if(imageAttach != nil){
        // Note that the image is loaded syncronously
        UIImage *img = [[UIImage alloc] initWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:imageAttach]]];
        ok = [tweetViewController addImage:img];
        if(!ok){
            errorMessage = @"Image could not be added!";
        }
    }
    
    if(!ok){        
        [super writeJavascript:[[PluginResult resultWithStatus:PGCommandStatus_ERROR 
                                               messageAsString:errorMessage] toErrorCallbackString:callbackId]];
    }
    else{
        [tweetViewController setCompletionHandler:^(TWTweetComposeViewControllerResult result) {
            switch (result) {
                case TWTweetComposeViewControllerResultDone:
                    [super writeJavascript:[[PluginResult resultWithStatus:PGCommandStatus_OK] toSuccessCallbackString:callbackId]];
                    break;
                case TWTweetComposeViewControllerResultCancelled:
                default:
                    [super writeJavascript:[[PluginResult resultWithStatus:PGCommandStatus_ERROR 
                                                           messageAsString:@"Cancelled"] toErrorCallbackString:callbackId]];
                    break;
            }
            
            [super.appViewController dismissModalViewControllerAnimated:YES];
            
        }];
        
        [super.appViewController presentModalViewController:tweetViewController animated:YES];
        
    }
    
    [tweetViewController release];
    
}

// The JS must run on the main thread because you can't make a uikit call (uiwebview) from another thread (what twitter does for calls)
- (void) performCallbackOnMainThreadforJS:(NSString*)javascript{
    
    [super performSelectorOnMainThread:@selector(writeJavascript:) 
                            withObject:javascript
                         waitUntilDone:YES];
    
}

@end
