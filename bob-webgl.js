
/**
   @param target gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER
   @param buf from gl.createBuffer()
   @param array from new Float32Array() or new Int16Array() or the like.
   @param usage gl.STATIC_DRAW or gl.DYNAMIC_DRAW or gl.STREAM_DRAW
   @return buf
 */
function setGLBuffer(gl, target, buf, array, usage)
{
    gl.bindBuffer(target, buf)
    gl.bufferData(target, array, usage)
    return buf
}

function getNumericStyleProperty(style, prop){
    return parseInt(style.getPropertyValue(prop),10) ;
}

function element_position(e) {
    var x = 0, y = 0;
    var inner = true ;
    do {
        x += e.offsetLeft;
        y += e.offsetTop;
        var style = getComputedStyle(e,null) ;
        var borderTop = getNumericStyleProperty(style,"border-top-width") ;
        var borderLeft = getNumericStyleProperty(style,"border-left-width") ;
        y += borderTop ;
        x += borderLeft ;
        if (inner){
          var paddingTop = getNumericStyleProperty(style,"padding-top") ;
          var paddingLeft = getNumericStyleProperty(style,"padding-left") ;
          y += paddingTop ;
          x += paddingLeft ;
        }
        inner = false ;
    } while (e = e.offsetParent);
    return { x: x, y: y };
}


function webglAttributeMap(gl, program)
{
    var n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)

    rval = {}
    for (var i=0; i<n; i++) {
	var name = gl.getActiveAttrib(program, i).name
	rval[name] = gl.getAttribLocation(program, name)
    }

    return rval
}

function webglUniformMap(gl, program)
{
    var n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

    rval = {}
    for (var i=0; i<n; i++) {
	var name = gl.getActiveUniform(program, i).name
	rval[name] = gl.getUniformLocation(program, name)
    }

    return rval
}


/*
 * Bob-upgraded versions of the Khronos loadImageTexture() function
 */

//
// loadImageTexture
//
// Load the image at the passed url, place it in a new WebGLTexture object and return the WebGLTexture.
//
function loadImageTexture(ctx, url, postprocess)
{
    if (null==postprocess) {
	var postprocess = function(ctx, image, texture) {
	    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
	    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
	    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
	    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
	    //ctx.generateMipmap(ctx.TEXTURE_2D)
	}
    }

    var texture = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, 1, 1, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);
    var image = new Image();
    g_loadingImages.push(image);
    image.onload = function() { doLoadImageTexture(ctx, image, texture, postprocess) }
    image.src = url;
    return texture;
}

function doLoadImageTexture(ctx, image, texture, postprocess)
{
    g_loadingImages.splice(g_loadingImages.indexOf(image), 1);
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texImage2D(
        ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    postprocess(ctx, image, texture)
    ctx.bindTexture(ctx.TEXTURE_2D, null);
}
