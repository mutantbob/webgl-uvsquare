This is a skeleton project for a 2D WebGL art piece.

We borrow a few bits of the Khronos WebGL git repository
(https://github.com/KhronosGroup/WebGL.git)

The uvsquare.js program sets up a single rectangle (composed of two
triangles) that cover the entire WebGL canvas.

You can then modify the fragment shader inside uvsquare.html to
calculate an RGB value based on the texture coordinate.

While WebGL is fully capable of doing advanced 3D graphics with
perspective and textures, this project instead focuses on procedural
2D art.
