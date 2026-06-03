const utilsGlsl = `float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 getContainUvFrag(vec2 uv, vec2 textureSize, vec2 quadSize) {
  vec2 tempUv = uv - vec2(0.5);

  float quadAspect = quadSize.x / quadSize.y;
  float textureAspect = textureSize.x / textureSize.y;

  if (quadAspect > textureAspect) {
    tempUv *= vec2(quadAspect / textureAspect, 1.0);
  } else {
    tempUv *= vec2(1.0, textureAspect / quadAspect);
  }

  tempUv += vec2(0.5);

  return tempUv;
}

vec2 getCoverUvVert(vec2 uv, vec2 textureSize, vec2 quadSize) {
  vec2 ratio = vec2(
    min((quadSize.x / quadSize.y) / (textureSize.x / textureSize.y), 1.0),
    min((quadSize.y / quadSize.x) / (textureSize.y / textureSize.x), 1.0)
  );

  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

vec2 getCoverUvFrag(vec2 uv, vec2 textureSize, vec2 quadSize) {
  vec2 tempUv = uv - vec2(0.5);

  float quadAspect = quadSize.x / quadSize.y;
  float textureAspect = textureSize.x / textureSize.y;

  if (quadAspect < textureAspect) {
    tempUv *= vec2(quadAspect / textureAspect, 1.0);
  } else {
    tempUv *= vec2(1.0, textureAspect / quadAspect);
  }

  tempUv += vec2(0.5);

  return tempUv;
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}`;

const shader = `float PI = 3.141592653589793;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uCursor;
uniform float uScrollVelocity;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform vec2 uQuadSize;
uniform float uBorderRadius;
uniform float uMouseEnter;
uniform vec2 uMouseOverPos;

${utilsGlsl}

out vec2 vUv;
out vec2 vUvCover;

vec3 deformationCurve(vec3 position, vec2 uv) {
  position.y = position.y - (sin(uv.x * PI) * min(abs(uScrollVelocity), 5.0) * sign(uScrollVelocity) * -0.01);
  return position;
}

void main() {
  vUv = uv;
  vUvCover = getCoverUvVert(uv, uTextureSize, uQuadSize);

  vec3 deformedPosition = deformationCurve(position, vUvCover);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(deformedPosition, 1.0);
}`;

export default shader;
