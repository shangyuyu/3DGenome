var fragmentShaderSource = "\
precision mediump float;\
\
varying vec4 v_vertColor;\
\
void main(){\
   gl_FragColor = v_vertColor;\
}\
";