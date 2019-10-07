---
name: palette
type: fragment
author: Kyle
uniform.color: { "type": "3f", "value": {"x": 0, "y": 0, "z": 0} }
---

precision mediump float;
uniform vec2 resolution;
uniform vec3 color;
uniform sampler2D iChannel0;
varying vec2 fragCoord;

void main( void ) {

    //convert pixel resolution into [0,1]
    vec2 c = (floor(fragCoord.xy)+0.5) / resolution.xy;
    //flip Y
    //c.y = 1.-c.y;
    vec4 col = texture2D(iChannel0, c);

    vec3 identity = vec3(1.,1.,1.);
    // but it will flag a color to swap if I were to have something like (1.0, 1.0, 0.4)
    float total = dot(col.xyz, identity);

    vec3 shadow = color-normalize(color)*color*color;

    if(total > 2.99){
        gl_FragColor = vec4(color, 1.);
    }else if(total>2.39){
        gl_FragColor = vec4(color-abs(shadow)/2., 1.);
    }else{
        gl_FragColor = col;
    }
}