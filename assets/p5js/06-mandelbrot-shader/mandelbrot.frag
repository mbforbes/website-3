//
// Alex wrote this to demonstrate reading the passed `varying` value from the vertex
// shader ("maxColor") and using it directly. The vertex shader has already interpolated
// the values between the vertices, so if we just assign it to the output color here, we
// get gradients along the shape.
//

// These are necessary definitions that let your graphics card know how to render the
// shader
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_x_world;
uniform vec2 u_y_world;

// varying vec2 vTextureCoord;

// HSL2RGB code MIT license from Jam3:
// The MIT License (MIT) Copyright (c) 2015 Jam3
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

float hue2rgb(float f1, float f2, float hue) {
    if (hue < 0.0)
        hue += 1.0;
    else if (hue > 1.0)
        hue -= 1.0;
    float res;
    if ((6.0 * hue) < 1.0)
        res = f1 + (f2 - f1) * 6.0 * hue;
    else if ((2.0 * hue) < 1.0)
        res = f2;
    else if ((3.0 * hue) < 2.0)
        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else
        res = f1;
    return res;
}

vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb;

    if (hsl.y == 0.0) {
        rgb = vec3(hsl.z); // Luminance
    } else {
        float f2;

        if (hsl.z < 0.5)
            f2 = hsl.z * (1.0 + hsl.y);
        else
            f2 = hsl.z + hsl.y - hsl.y * hsl.z;

        float f1 = 2.0 * hsl.z - f2;

        rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
        rgb.g = hue2rgb(f1, f2, hsl.x);
        rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
    }
    return rgb;
}

vec3 hsl2rgb(float h, float s, float l) {
    return hsl2rgb(vec3(h, s, l));
}

// (end of Jam3's code)

// this is the mbrot function
float getDivergentT(vec2 c) {
    const int maxT = 512;
    int lastT = 0;
    vec2 v = vec2(0,0);
    for (int t = 0; t < maxT; t++) {
        vec2 vSq = vec2(v.x * v.x - v.y * v.y, v.x * v.y + v.y * v.x);
        v = vSq + c;
        if (v.x * v.x + v.y * v.y > 4.0) {
            break;
        }
        lastT = t;
    }
    return float(lastT) / float(maxT);
}


void main() {
    // gl_FragColor = maxColor;
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;

    float x_world = u_x_world.x + uv.x * (u_x_world.y - u_x_world.x);
    float y_world = u_y_world.x + uv.y * (u_y_world.y - u_y_world.x);

    float divergence = getDivergentT(vec2(x_world, y_world));
    // float bright = divergence > 0.9 ? 1.0 : 0.0;
    float b = 1.0 - divergence;
    // float b = divergence;
    // if (b < 0.001) b = 0.45;

    // vec3 baseColor = vec3(0.5361, 0.52, b);  // blue hsl
    vec3 baseColor = vec3(0.9806, 0.91, b);  // red hsl
    vec3 color = hsl2rgb(baseColor);
    // vec3 color = vec3(b, b, b);

    // TODO: clamp at first, then use whatever shader functions there are to do the
    // nice mapping.
    gl_FragColor = vec4(color, 1.0);
}
