uniform float time;
// uniform float dummy;

void main() {
    gl_FragColor = vec4(${r}, ${g}, 1.0 + sin(time/1000.0) * 0.5, 1 );
}
