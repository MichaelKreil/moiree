"use strict"

var fs = require('fs');
var Canvas = require('canvas');

var name = 'curie';
var lineWidth = 20;

loadImage(name+'.png', img0 => {
	var width = img0.width;
	var height = img0.height;

	var img1 = createImage(width, height);
	var img2 = createImage(width, height);

	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			var index = (y*width+x)*4;
			var v0 = img0.data[index];
			var phase = (1-v0/255)*Math.PI;
			var a = Math.sqrt(Math.pow(x-width/2, 2) + Math.pow(y-height/2, 2))*2*Math.PI/lineWidth;
			var v1 = (Math.cos(a+0*phase) > 0) ? 255 : 0;
			var v2 = (Math.cos(a+1*phase) > 0) ? 255 : 0;

			img1.data[index+0] = v1;
			img1.data[index+1] = v1;
			img1.data[index+2] = v1;
			img1.data[index+3] = 255;

			img2.data[index+0] = v2;
			img2.data[index+1] = v2;
			img2.data[index+2] = v2;
			img2.data[index+3] = 255;
		}
	}

	saveImage(img1, name+'_1');
	saveImage(img2, name+'_2');
})


function loadImage(name, cb) {
	console.log('load');
	Canvas.loadImage(name).then(image => {
		var canvas = Canvas.createCanvas(image.width, image.height);
		var ctx = canvas.getContext('2d');
		console.log('draw');
		ctx.drawImage(image, 0, 0);
		console.log('get');
		var data = ctx.getImageData(0, 0, image.width, image.height);
		console.log('return');
		cb(data);
	})
}
function saveImage(image, name) {
	var canvas = Canvas.createCanvas(image.width, image.height);
	var ctx = canvas.getContext('2d');
	ctx.putImageData(image, 0, 0);
	fs.writeFileSync(name+'.png', canvas.toBuffer());
}

function createImage(width, height) {
	return Canvas.createImageData(width, height);
}
