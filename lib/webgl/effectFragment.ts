const shader = `precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uCursor;
uniform float uScrollVelocity;
uniform sampler2D uTexture;
uniform sampler2D uFlowmap;
uniform vec2 uTextureSize;
uniform vec2 uQuadSize;
uniform float uBorderRadius;
uniform float uMouseEnter;
uniform vec2 uMouseOverPos;
uniform float uDistortionStrength;
uniform float uDistortionEnabled;
uniform vec3 uBackgroundColor;

in vec2 vUv;
in vec2 vUvCover;

out vec4 outColor;

vec4 sampleTexture(vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    return vec4(uBackgroundColor, 1.0);
  }
  return texture(uTexture, uv);
}

void main() {
  vec2 baseUv = vUvCover;
  vec3 color;

  if (uDistortionEnabled > 0.5) {
    vec3 flow = texture(uFlowmap, vUv).rgb;
    vec2 distortedUv = baseUv + flow.rg * uDistortionStrength;
    color = sampleTexture(distortedUv).rgb;
  } else {
    color = sampleTexture(baseUv).rgb;
  }

  outColor = linearToOutputTexel(vec4(color, 1.0));
}`;

export default shader;
