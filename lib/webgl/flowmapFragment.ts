const shader = `precision highp float;

uniform vec2 uMouse;
uniform vec2 uVelocity;
uniform vec2 uResolution;
uniform float uFalloff;
uniform float uAlpha;
uniform float uDissipation;
uniform float uAspect;
uniform sampler2D uTexture;

in vec2 vUv;
out vec4 outColor;

void main() {
  vec2 uv = vUv;
  vec4 color = texture(uTexture, uv);
  color.rgb *= uDissipation;

  vec2 cursor = uMouse;
  vec2 aspectUv = uv;
  aspectUv.x *= uAspect;
  cursor.x *= uAspect;

  float dist = distance(aspectUv, cursor);
  float influence = 1.0 - smoothstep(0.0, uFalloff, dist);

  vec2 velocityContribution = vec2(uVelocity.x, -uVelocity.y) * influence * uAlpha;
  color.rg += velocityContribution;
  color.b = length(color.rg) * 2.0;

  outColor = color;
}`;

export default shader;
