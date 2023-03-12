#import "TextDetect.h"
#import <React/RCTLog.h>
#import <Vision/Vision.h>


@implementation TextDetect
RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(detectText:(NSDictionary *)points
                  imageUri:(NSString *)imageUri
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *parsedImageUri = [[imageUri stringByReplacingOccurrencesOfString:@"file://" withString:@""] stringByRemovingPercentEncoding];
  
    NSURL *fileURL = [NSURL fileURLWithPath:parsedImageUri];
  
    // Load the image data from the URL
    NSData *imageData = [NSData dataWithContentsOfURL:fileURL];
    UIImage *image = [UIImage imageWithData:imageData];
    
    // Check the image orientation
    if (image.imageOrientation != UIImageOrientationUp) {
        // Create a new UIImage object with the correct orientation
        UIGraphicsBeginImageContextWithOptions(image.size, NO, image.scale);
        [image drawInRect:(CGRect){0, 0, image.size}];
        UIImage *normalizedImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        image = normalizedImage;
    }
    
    // Calculate the crop rectangle based on the provided x positions
    
    CGFloat tlx =  [points[@"topLeft"][@"x"] floatValue];
    CGFloat trx =  [points[@"topRight"][@"x"] floatValue];
    CGFloat blx =  [points[@"bottomLeft"][@"x"] floatValue];
    CGFloat brx =  [points[@"bottomRight"][@"x"] floatValue];
    
    CGFloat tly =  [points[@"topLeft"][@"y"] floatValue];
    CGFloat tryV =  [points[@"topRight"][@"y"] floatValue];
    CGFloat bly =  [points[@"bottomLeft"][@"y"] floatValue];
    CGFloat bry =  [points[@"bottomRight"][@"y"] floatValue];
      
      // TODO
    CGFloat originalHeight = [points[@"height"] floatValue];
    CGFloat originalWidth =  [points[@"width"] floatValue];
      
    CGSize originalSize = CGSizeMake(originalWidth, originalHeight); // Replace with the actual size of the original image
    
    // Create a path using the provided points
    UIBezierPath *path = [UIBezierPath bezierPath];
    [path moveToPoint:CGPointMake(tlx * image.size.width / originalSize.width, tly * image.size.height / originalSize.height)];
    [path addLineToPoint:CGPointMake(trx * image.size.width / originalSize.width, tryV * image.size.height / originalSize.height)];
    [path addLineToPoint:CGPointMake(brx * image.size.width / originalSize.width, bry * image.size.height / originalSize.height)];
    [path addLineToPoint:CGPointMake(blx * image.size.width / originalSize.width, bly * image.size.height / originalSize.height)];
    [path closePath];
    
    // Create a mask using the path
    CAShapeLayer *maskLayer = [CAShapeLayer layer];
    maskLayer.path = path.CGPath;
    maskLayer.fillColor = [UIColor whiteColor].CGColor;
    maskLayer.strokeColor = [UIColor blackColor].CGColor;
    maskLayer.lineWidth = 0;
    maskLayer.frame = CGRectMake(0, 0, image.size.width, image.size.height);
    
    // Create a masked image by applying the mask to the original image
    UIImage *maskedImage = [UIImage imageWithCGImage:image.CGImage scale:image.scale orientation:UIImageOrientationUp];
    CALayer *imageLayer = [CALayer layer];
    imageLayer.frame = CGRectMake(0, 0, image.size.width, image.size.height);
    imageLayer.contents = (__bridge id)image.CGImage;
    imageLayer.mask = maskLayer;
    UIGraphicsBeginImageContextWithOptions(image.size, NO, image.scale);
    CGContextRef context = UIGraphicsGetCurrentContext();
    [imageLayer renderInContext:context];
    maskedImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    

    VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCGImage:maskedImage.CGImage options:@{}];
        VNRecognizeTextRequest *request = [[VNRecognizeTextRequest alloc] initWithCompletionHandler:^(VNRequest * _Nonnull request, NSError * _Nullable error) {
            if (error) {
                reject(@"event_failure", @"Something went wrong", error);
                NSLog(@"Error recognizing text: %@", error.localizedDescription);
            } else {
                NSArray *results = request.results;
                if (results.count > 0) {
                    NSMutableString *recognizedText = [NSMutableString string];
                        for (VNRecognizedTextObservation *observation in results) {
                            for (VNRecognizedText *text in [observation topCandidates:1]) {
                                [recognizedText appendString:text.string];
                                [recognizedText appendString:@"\n"];
                            }
                        }
                    resolve(@{@"text":recognizedText});
                } else {
                    reject(@"event_failure", @"No text found in image", nil);
                }
            }
        }];
        request.recognitionLevel = VNRequestTextRecognitionLevelAccurate;
        [handler performRequests:@[request] error:nil];
}




// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeTextDetectSpecJSI>(params);
}
#endif

@end
