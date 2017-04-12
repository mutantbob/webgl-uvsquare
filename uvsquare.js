function UVSquareShader(gl)
{
    this.program = simpleSetup(gl, "vshader", "fshader",
			       [], [0,0,0.5, 1], 10000)
    this.AL = webglAttributeMap(gl, this.program)
    this.UL = webglUniformMap(gl, this.program)
    
    gl.enableVertexAttribArray(this.AL.vTexCoord)
    gl.enableVertexAttribArray(this.AL.vPosition)

    console.log(this)
}

function UVSquareDrawable(gl)
{
    var vertices = [-1, -1,
		    1,-1,
		    -1,1,
		    1,1]
    var uvs = [-1,-1,
	       1,-1,
	       -1,1,
	       1,1]
    var triangles = [0,1,3,
		     0,3,2]
    
    this.vertBuffer = setGLBuffer(gl, gl.ARRAY_BUFFER, gl.createBuffer(), new Float32Array(vertices), gl.STATIC_DRAW)
    this.uvBuffer = setGLBuffer(gl, gl.ARRAY_BUFFER, gl.createBuffer(), new Float32Array(uvs), gl.STATIC_DRAW)

    this.indexBuffer = setGLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer(), new Uint8Array(triangles), gl.STATIC_DRAW)
    this.numIndices = triangles.length
}

UVSquareDrawable.prototype.bindBuffers = function(gl, shader)
{
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertBuffer)
    gl.vertexAttribPointer(shader.AL.vPosition, 2, gl.FLOAT, false, 0,0)
    gl.bindBuffer( gl.ARRAY_BUFFER, this.uvBuffer)
    gl.vertexAttribPointer(shader.AL.vTexCoord, 2, gl.FLOAT, false, 0,0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
}

UVSquareDrawable.prototype.drawElements = function(gl)
{
    gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_BYTE, 0)
}


function UVSquare(gl, elt)
{
    this.element =elt
    this.gl = gl
    
    this.shader = new UVSquareShader(gl)

    this.square = new UVSquareDrawable(gl)

    this.square.bindBuffers(gl, this.shader)
}

UVSquare.prototype.drawPicture = function()
{
    var gl = this.gl
    if (triggerSnapshot) {
	gl = WebGLUtils.setupWebGL(this.element, {'preserveDrawingBuffer':true} )
    }

    var aspect = this.element.clientWidth/ this.element.clientHeight
    gl.viewport(0, 0, this.element.clientWidth, this.element.clientHeight);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1f(this.shader.UL.aspect_ratio, aspect);

    this.square.drawElements(gl)

    if (triggerSnapshot) {
	triggerSnapshot = 0

	var url = this.element.toDataURL()
	console.log(url)
	var link = document.getElementById("snapshot")
	link.href = url
    }
}

//

triggerSnapshot = 0

function take_snapshot()
{
    triggerSnapshot = 1
}

function start()
{
    var c = document.getElementById("example")

    c.addEventListener('webglcontextlost', handleContextLost, false)
    c.addEventListener('webglcontextrestored', handleContextRestored, false)

    var gl = WebGLUtils.setupWebGL(c)
    
    // this will be a global
    uvSquare = new UVSquare(gl, c)

    function refreshIter() {
        uvSquare.drawPicture(gl)
        uvSquare.requestId = window.requestAnimFrame(refreshIter, c)
    }
    refreshIter()

    
    function handleContextLost(e) {
        e.preventDefault()
        clearLoadingImages()
        if (helixMaze.requestId !== undefined) {
            window.cancelAnimFrame(helixMaze.requestId)
            helixMaze.requestId = undefined
        }
    }

    function handleContextRestored() {
        init()
        refreshIter()
    }

}
