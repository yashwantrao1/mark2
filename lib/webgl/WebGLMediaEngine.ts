import * as THREE from "three";

import effectFragment from "@/lib/webgl/effectFragment";
import effectVertex from "@/lib/webgl/effectVertex";
import flowmapFragment from "@/lib/webgl/flowmapFragment";
import flowmapVertex from "@/lib/webgl/flowmapVertex";
import { calcFov, debounce, lerp, resizeThreeCanvas } from "@/lib/webgl/utils";

const CAMERA_POS = 500;

function getOffWhiteLinear(): THREE.Vector3 {
  const css =
    getComputedStyle(document.documentElement).getPropertyValue("--offWhite").trim() ||
    "#F4F8FF";
  const color = new THREE.Color(css);
  color.convertSRGBToLinear();
  return new THREE.Vector3(color.r, color.g, color.b);
}

const DISTORTION_SETTINGS = {
  falloff: 0.2,
  alpha: 0.09,
  dissipation: 0.965,
  distortionStrength: 0.1,
  velocityScale: 0.6,
  velocityDamping: 0.5,
};

type DistortionState = {
  flowmapA: THREE.WebGLRenderTarget;
  flowmapB: THREE.WebGLRenderTarget;
  mouse: {
    current: THREE.Vector2;
    target: THREE.Vector2;
    velocity: THREE.Vector2;
    lastPosition: THREE.Vector2;
    smoothVelocity: THREE.Vector2;
  };
};

export type WebGLMediaHandle = {
  id: string;
  mouseEnter: number;
  mouseOverPos: {
    current: { x: number; y: number };
    target: { x: number; y: number };
  };
};

type MediaEntry = WebGLMediaHandle & {
  media: HTMLImageElement | HTMLVideoElement;
  container: HTMLElement;
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  texture: THREE.Texture | null;
  isVideo: boolean;
  isInView: boolean;
  distortion: DistortionState | null;
  observer: IntersectionObserver;
};

class WebGLMediaEngine {
  private canvas: HTMLCanvasElement | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private geometry: THREE.PlaneGeometry | null = null;
  private baseMaterial: THREE.ShaderMaterial | null = null;
  private flowmapScene: THREE.Scene | null = null;
  private flowmapCamera: THREE.OrthographicCamera | null = null;
  private flowmapMaterial: THREE.ShaderMaterial | null = null;
  private flowmapQuad: THREE.Mesh | null = null;
  private dummyFlowmap: THREE.DataTexture | null = null;
  private entries = new Map<string, MediaEntry>();
  private pending: Array<{
    container: HTMLElement;
    media: HTMLImageElement | HTMLVideoElement;
    video: boolean;
    distortion: boolean;
  }> = [];
  private raf = 0;
  private mounted = false;
  private scrollVelocity = 0;
  private cursor = { current: { x: 0.5, y: 0.5 }, target: { x: 0.5, y: 0.5 } };

  mount(canvas: HTMLCanvasElement) {
    if (this.mounted) return () => undefined;

    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
    this.baseMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTime: { value: 0 },
        uCursor: { value: new THREE.Vector2(0.5, 0.5) },
        uScrollVelocity: { value: 0 },
        uTexture: { value: null as THREE.Texture | null },
        uFlowmap: { value: null as THREE.Texture | null },
        uTextureSize: { value: new THREE.Vector2(100, 100) },
        uQuadSize: { value: new THREE.Vector2(100, 100) },
        uBorderRadius: { value: 0 },
        uMouseEnter: { value: 0 },
        uMouseOverPos: { value: new THREE.Vector2(0.5, 0.5) },
        uDistortionStrength: { value: DISTORTION_SETTINGS.distortionStrength },
        uDistortionEnabled: { value: 0 },
        uBackgroundColor: { value: getOffWhiteLinear() },
      },
      vertexShader: effectVertex,
      fragmentShader: effectFragment,
      glslVersion: THREE.GLSL3,
      toneMapped: false,
    });

    this.dummyFlowmap = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
    this.dummyFlowmap.needsUpdate = true;
    this.baseMaterial.uniforms.uFlowmap.value = this.dummyFlowmap;

    this.camera = new THREE.PerspectiveCamera(
      calcFov(CAMERA_POS),
      window.innerWidth / window.innerHeight,
      10,
      1000
    );
    this.camera.position.z = CAMERA_POS;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.flowmapScene = new THREE.Scene();
    this.flowmapCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.flowmapMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uMouse: { value: new THREE.Vector2(-1, -1) },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uFalloff: { value: DISTORTION_SETTINGS.falloff },
        uAlpha: { value: DISTORTION_SETTINGS.alpha },
        uDissipation: { value: DISTORTION_SETTINGS.dissipation },
        uAspect: { value: 1 },
        uTexture: { value: null as THREE.Texture | null },
      },
      vertexShader: flowmapVertex,
      fragmentShader: flowmapFragment,
      glslVersion: THREE.GLSL3,
      toneMapped: false,
    });
    this.flowmapQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.flowmapMaterial);
    this.flowmapScene.add(this.flowmapQuad);

    const onResize = debounce(() => {
      if (!this.camera || !this.renderer) return;
      const fov = calcFov(CAMERA_POS);
      resizeThreeCanvas({ camera: this.camera, fov, renderer: this.renderer });
      this.syncAllSizes();
    }, 100);

    window.addEventListener("resize", onResize);
    this.mounted = true;
    this.raf = requestAnimationFrame(this.render);

    const pending = [...this.pending];
    this.pending = [];
    pending.forEach(({ container, media, video, distortion }) => {
      this.register(container, media, video, distortion);
    });

    return () => {
      this.unmount();
      window.removeEventListener("resize", onResize);
    };
  }

  setScrollVelocity(velocity: number) {
    this.scrollVelocity = velocity;
  }

  setCursorTarget(x: number, y: number) {
    this.cursor.target.x = x;
    this.cursor.target.y = y;
  }

  setDistortionMouse(id: string, x: number, y: number) {
    const entry = this.entries.get(id);
    if (!entry?.distortion) return;
    entry.distortion.mouse.target.set(x, 1 - y);
  }

  setDistortionMouseImmediate(id: string, x: number, y: number) {
    const entry = this.entries.get(id);
    if (!entry?.distortion) return;
    const uvY = 1 - y;
    entry.distortion.mouse.current.set(x, uvY);
    entry.distortion.mouse.target.set(x, uvY);
    entry.distortion.mouse.lastPosition.set(x, uvY);
  }

  setDistortionMouseLeave(id: string) {
    const entry = this.entries.get(id);
    if (!entry?.distortion) return;
    entry.distortion.mouse.target.set(-1, -1);
  }

  register(
    container: HTMLElement,
    media: HTMLImageElement | HTMLVideoElement,
    video: boolean,
    distortion = false
  ): WebGLMediaHandle | null {
    for (const entry of this.entries.values()) {
      if (entry.container === container) return entry;
    }

    if (!this.scene || !this.geometry || !this.baseMaterial) {
      const alreadyPending = this.pending.some((item) => item.container === container);
      if (!alreadyPending) this.pending.push({ container, media, video, distortion });
      return null;
    }

    const id = crypto.randomUUID();
    const material = this.baseMaterial.clone();
    const mesh = new THREE.Mesh(this.geometry, material);
    mesh.position.y = window.innerHeight * 2;
    this.scene.add(mesh);

    let distortionState: DistortionState | null = null;
    if (distortion && this.renderer) {
      const rtType = this.renderer.capabilities.isWebGL2
        ? THREE.HalfFloatType
        : THREE.UnsignedByteType;
      const rtOptions = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: rtType,
      };
      distortionState = {
        flowmapA: new THREE.WebGLRenderTarget(128, 128, rtOptions),
        flowmapB: new THREE.WebGLRenderTarget(128, 128, rtOptions),
        mouse: {
          current: new THREE.Vector2(-1, -1),
          target: new THREE.Vector2(-1, -1),
          velocity: new THREE.Vector2(0, 0),
          lastPosition: new THREE.Vector2(-1, -1),
          smoothVelocity: new THREE.Vector2(0, 0),
        },
      };
      material.uniforms.uFlowmap.value = distortionState.flowmapA.texture;
      material.uniforms.uDistortionEnabled.value = 1;
    }

    const entry: MediaEntry = {
      id,
      mouseEnter: 0,
      mouseOverPos: {
        current: { x: 0.5, y: 0.5 },
        target: { x: 0.5, y: 0.5 },
      },
      media,
      container,
      mesh,
      material,
      texture: null,
      isVideo: video,
      isInView: true,
      distortion: distortionState,
      observer: new IntersectionObserver(
        ([observed]) => {
          entry.isInView = observed.isIntersecting;
        },
        { rootMargin: "500px 0px 500px 0px" }
      ),
    };

    entry.observer.observe(container);
    this.entries.set(id, entry);
    this.bindTexture(entry);
    this.syncEntrySize(entry);

    requestAnimationFrame(() => {
      this.syncEntrySize(entry);
      this.bindTexture(entry);
    });

    return entry;
  }

  unregister(id: string) {
    const entry = this.entries.get(id);
    if (!entry || !this.scene) return;

    entry.observer.disconnect();
    entry.texture?.dispose();
    entry.material.dispose();
    entry.distortion?.flowmapA.dispose();
    entry.distortion?.flowmapB.dispose();
    this.scene.remove(entry.mesh);
    this.entries.delete(id);
  }

  private bindTexture(entry: MediaEntry) {
    const { media, material, isVideo } = entry;

    const applyTexture = () => {
      const bounds = entry.container.getBoundingClientRect();
      let texW = bounds.width || 512;
      let texH = bounds.height || 512;

      if (isVideo && media instanceof HTMLVideoElement) {
        texW = media.videoWidth || texW;
        texH = media.videoHeight || texH;
        entry.texture = new THREE.VideoTexture(media);
        entry.texture.colorSpace = THREE.SRGBColorSpace;
      } else if (media instanceof HTMLImageElement && media.naturalWidth > 0) {
        texW = media.naturalWidth;
        texH = media.naturalHeight;
        entry.texture = new THREE.Texture(media);
        entry.texture.colorSpace = THREE.SRGBColorSpace;
      } else {
        return;
      }

      entry.texture.needsUpdate = true;
      material.uniforms.uTexture.value = entry.texture;
      material.uniforms.uTextureSize.value.set(texW, texH);
      this.syncEntrySize(entry);
    };

    if (isVideo && media instanceof HTMLVideoElement) {
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
      if (media.readyState >= 2) applyTexture();
      else media.addEventListener("loadedmetadata", applyTexture, { once: true });
      void media.play().catch(() => undefined);
      return;
    }

    if (media instanceof HTMLImageElement) {
      const ready = () => {
        if (media.naturalWidth > 0) applyTexture();
      };
      if (media.complete) {
        if (media.decode) void media.decode().then(ready).catch(ready);
        else ready();
      } else {
        media.addEventListener("load", ready, { once: true });
      }
    }
  }

  private syncEntrySize(entry: MediaEntry) {
    const bounds = entry.container.getBoundingClientRect();
    const w = Math.max(bounds.width, 1);
    const h = Math.max(bounds.height, 1);

    entry.mesh.scale.set(w, h, 1);
    entry.material.uniforms.uQuadSize.value.set(w, h);
    entry.material.uniforms.uBorderRadius.value =
      parseFloat(getComputedStyle(entry.container).borderRadius) || 0;

    if (entry.media instanceof HTMLImageElement && entry.media.naturalWidth) {
      entry.material.uniforms.uTextureSize.value.set(
        entry.media.naturalWidth,
        entry.media.naturalHeight
      );
    }
    if (entry.media instanceof HTMLVideoElement && entry.media.videoWidth) {
      entry.material.uniforms.uTextureSize.value.set(
        entry.media.videoWidth,
        entry.media.videoHeight
      );
    }
  }

  private syncAllSizes() {
    this.entries.forEach((entry) => this.syncEntrySize(entry));
  }

  private setPositions(entry: MediaEntry) {
    const bounds = entry.container.getBoundingClientRect();
    entry.mesh.position.x = bounds.left - window.innerWidth / 2 + bounds.width / 2;
    entry.mesh.position.y = -bounds.top + window.innerHeight / 2 - bounds.height / 2;
    entry.mesh.scale.set(Math.max(bounds.width, 1), Math.max(bounds.height, 1), 1);
    entry.material.uniforms.uQuadSize.value.set(
      Math.max(bounds.width, 1),
      Math.max(bounds.height, 1)
    );
  }

  private updateFlowmap(entry: MediaEntry) {
    const distortion = entry.distortion;
    if (
      !distortion ||
      !this.renderer ||
      !this.flowmapMaterial ||
      !this.flowmapScene ||
      !this.flowmapCamera ||
      !this.flowmapQuad
    ) {
      return;
    }

    const mouse = distortion.mouse;
    mouse.lastPosition.copy(mouse.current);
    mouse.current.lerp(mouse.target, 0.7);

    const deltaX = mouse.current.x - mouse.lastPosition.x;
    const deltaY = mouse.current.y - mouse.lastPosition.y;
    mouse.velocity.lerp(new THREE.Vector2(deltaX * 80, deltaY * 80), 0.6);
    mouse.smoothVelocity.lerp(mouse.velocity, 0.3);
    mouse.velocity.multiplyScalar(DISTORTION_SETTINGS.velocityDamping);

    const bounds = entry.container.getBoundingClientRect();
    const aspect = bounds.width / Math.max(bounds.height, 1);

    this.flowmapMaterial.uniforms.uMouse.value.copy(mouse.current);
    this.flowmapMaterial.uniforms.uVelocity.value
      .copy(mouse.smoothVelocity)
      .multiplyScalar(DISTORTION_SETTINGS.velocityScale);
    this.flowmapMaterial.uniforms.uResolution.value.set(bounds.width, bounds.height);
    this.flowmapMaterial.uniforms.uAspect.value = aspect;
    this.flowmapMaterial.uniforms.uTexture.value = distortion.flowmapB.texture;

    this.flowmapQuad.material = this.flowmapMaterial;
    this.renderer.setRenderTarget(distortion.flowmapA);
    this.renderer.render(this.flowmapScene, this.flowmapCamera);

    const temp = distortion.flowmapA;
    distortion.flowmapA = distortion.flowmapB;
    distortion.flowmapB = temp;

    entry.material.uniforms.uFlowmap.value = distortion.flowmapA.texture;
  }

  private render = (time = 0) => {
    if (!this.renderer || !this.scene || !this.camera) return;
    this.raf = requestAnimationFrame(this.render);

    time /= 1000;

    this.cursor.current.x = lerp(this.cursor.current.x, this.cursor.target.x, 0.05);
    this.cursor.current.y = lerp(this.cursor.current.y, this.cursor.target.y, 0.05);

    this.entries.forEach((entry) => {
      if (!entry.isInView || !entry.material.uniforms.uTexture.value) {
        entry.mesh.position.y = window.innerHeight * 2;
        return;
      }

      entry.mouseOverPos.current.x = lerp(
        entry.mouseOverPos.current.x,
        entry.mouseOverPos.target.x,
        0.05
      );
      entry.mouseOverPos.current.y = lerp(
        entry.mouseOverPos.current.y,
        entry.mouseOverPos.target.y,
        0.05
      );

      if (entry.texture instanceof THREE.VideoTexture) {
        entry.texture.needsUpdate = true;
      }

      this.setPositions(entry);
      if (entry.distortion) this.updateFlowmap(entry);

      entry.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      entry.material.uniforms.uTime.value = time;
      entry.material.uniforms.uCursor.value.set(this.cursor.current.x, this.cursor.current.y);
      entry.material.uniforms.uScrollVelocity.value = this.scrollVelocity;
      entry.material.uniforms.uMouseOverPos.value.set(
        entry.mouseOverPos.current.x,
        entry.mouseOverPos.current.y
      );
      entry.material.uniforms.uMouseEnter.value = entry.mouseEnter;
    });

    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  };

  private unmount() {
    cancelAnimationFrame(this.raf);
    [...this.entries.keys()].forEach((id) => this.unregister(id));
    this.geometry?.dispose();
    this.baseMaterial?.dispose();
    this.flowmapMaterial?.dispose();
    this.flowmapQuad?.geometry.dispose();
    this.dummyFlowmap?.dispose();
    this.renderer?.dispose();
    this.entries.clear();
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.geometry = null;
    this.baseMaterial = null;
    this.flowmapScene = null;
    this.flowmapCamera = null;
    this.flowmapMaterial = null;
    this.flowmapQuad = null;
    this.dummyFlowmap = null;
    this.mounted = false;
  }
}

let engine: WebGLMediaEngine | null = null;

export function getWebGLMediaEngine() {
  if (!engine) engine = new WebGLMediaEngine();
  return engine;
}
