import AppKit
import Foundation
let size=1024
let args=Array(CommandLine.arguments.dropFirst())
guard args.count==2,let image=NSImage(contentsOfFile:args[0]) else { fatalError("Indica el logo y la imagen PNG de salida") }
let bitmap=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:size,pixelsHigh:size,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:0,bitsPerPixel:0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current=NSGraphicsContext(bitmapImageRep:bitmap)
NSGraphicsContext.current?.imageInterpolation = .high
NSColor.clear.setFill()
NSBezierPath(rect:NSRect(x:0,y:0,width:size,height:size)).fill()
NSColor.white.setFill()
NSBezierPath(roundedRect:NSRect(x:40,y:40,width:944,height:944),xRadius:180,yRadius:180).fill()
let scale=min(820/image.size.width,820/image.size.height)
let w=image.size.width*scale,h=image.size.height*scale
image.draw(in:NSRect(x:(1024-w)/2,y:(1024-h)/2,width:w,height:h),from:.zero,operation:.sourceOver,fraction:1)
NSGraphicsContext.restoreGraphicsState()
try bitmap.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:args[1]))
