---
name: Palette
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

// here's my shader for the palette swap, it takes in a 3-dimensional vector with the RGB (or in this case, xyz) info
// since I know the exact colors of my sprites I just hard coded in the checks for the color
// since the base sprite that will be palette swapped is white, I check that the RGB adds up to 3 (minus .01 epsilon)
// for the shadow, the color is 0.8 across the board so I check total is > 2.39
// now, beware of using this exactly
// I am using it since I know my sprite palette and potential colors
// but it will flag a color to swap if I were to have something like (1.0, 1.0, 0.4)
// so in your own implementation you may want to define a swappable color as something you don't use anywhere else, and then check for the exact x, y, and z values
// now, to use this shader I declare it in my loader scene and save out a bunch of textures

let chicken = this.add.shader('Palette').setVisible(false);
for(let i = 0;i<colors.length;i++){
    chicken.setRenderToTexture('chicken_body_'+i, true);
    chicken.setChannel0('chicken_body');
    let atlas = this.cache.json.get('chicken_body');
    let texture = this.textures.list['chicken_body_'+i];
    Phaser.Textures.Parsers.JSONArray(texture, 0, atlas);
    chicken.getUniform('color').value = colors[i];
    chicken.renderWebGL(chicken.renderer, chicken);

    chicken.renderToTexture = false;
}

// this is a loop that generates as many textures as I define colors in an array
// so I have currently an array of 5 pre-determined colors, and then I pad the rest with randomly generated values
// it uses the atlas from the original texture, and re-applies it to the new textures using the Parsers.JSONArray call
// since every texture has the frames in the same place, and the only change is the color
// what I now need to do is clean up the extra textures once the player has chosen one
// alternatively, I could make it generate no textures until the player has chosen a color, but I prefer the wheel select