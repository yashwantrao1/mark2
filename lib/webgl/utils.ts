import { PerspectiveCamera, WebGLRenderer } from "three";

export const resizeThreeCanvas = ({
  camera,
  fov = null,
  renderer,
  effectComposer = null,
}: {
  camera: PerspectiveCamera;
  fov?: number | null;
  renderer: WebGLRenderer;
  effectComposer?: { setSize: (w: number, h: number) => void } | null;
}) => {
  camera.aspect = window.innerWidth / window.innerHeight;

  if (fov) {
    camera.fov = fov;
  }

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  if (effectComposer) {
    effectComposer.setSize(window.innerWidth, window.innerHeight);
  }
};

export const calcFov = (cameraPos: number, height = window.innerHeight) =>
  (2 * Math.atan(height / 2 / cameraPos) * 180) / Math.PI;

export const debounce = <T extends (...args: never[]) => void>(func: T, timeout = 300) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};

export const lerp = (start: number, end: number, damping: number) =>
  start * (1 - damping) + end * damping;
