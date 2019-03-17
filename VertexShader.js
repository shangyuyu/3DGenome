var vertexShaderSource = " \
precision mediump float;\
\
attribute vec3 vertPosition;\
attribute vec3 vertColor;\
uniform mat4 mWorld;\
uniform mat4 mView;\
uniform mat4 mProj;\
varying vec4 v_vertColor;\
\
void main(){\
    v_vertColor = vec4(vertColor, 1.0);\
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);\
}\
";