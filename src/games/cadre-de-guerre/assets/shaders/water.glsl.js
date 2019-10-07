const float waterSpeed = 0.1;
const float waterHeight = 0.01;
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
	vec2 offsetUV = uv;
	offsetUV.x += (iTime) * waterSpeed;
	
	vec2 offset = (texture(iChannel1,offsetUV).ar);
	uv += offset * waterHeight;
	fragColor = texture(iChannel0,uv);
}