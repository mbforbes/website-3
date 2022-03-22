uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;
// attribute vec2 aTexCoord;
// attribute vec4 aVertexColor;  // we don't care about this

// varying vec2 vTextureCoord;

void main(void) {
    // copy vertex's assigned texture coordinate (& auto interpolate) -> fragment shader
    // vTextureCoord = aTexCoord;

    // add a 1 yey
    vec4 positionVec4 = vec4(aPosition, 1.0);

    // this I think this is to translate box from starting at middle to top left. feels
    // weird to do in vertex shader but hey why not.
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    // gl_Position = positionVec4;

    // standard transform for vertex -> pixel position
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
}
