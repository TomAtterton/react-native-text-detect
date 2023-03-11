
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNTextDetectSpec.h"

@interface TextDetect : NSObject <NativeTextDetectSpec>
#else
#import <React/RCTBridgeModule.h>

@interface TextDetect : NSObject <RCTBridgeModule>
#endif

@end
