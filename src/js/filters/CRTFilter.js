/* global Phaser */

const fragmentSrc = `
varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

uniform float distance;
uniform float outerStrength;
uniform float innerStrength;
uniform vec4 glowColor;
uniform vec4 filterArea;
uniform vec4 filterClamp;
const float PI = 3.14159265358979323846264;

void main(void) {
    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);
    vec4 ownColor = texture2D(uSampler, vTextureCoord);
    vec4 curColor;
    float totalAlpha = 0.0;
    float maxTotalAlpha = 0.0;
    float cosAngle;
    float sinAngle;
    vec2 displaced;
    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {
       cosAngle = cos(angle);
       sinAngle = sin(angle);
       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {
           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;
           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;
           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));
           totalAlpha += (distance - curDistance) * curColor.a;
           maxTotalAlpha += (distance - curDistance);
       }
    }
    maxTotalAlpha = max(maxTotalAlpha, 0.0001);

    ownColor.a = max(ownColor.a, 0.0001);
    ownColor.rgb = ownColor.rgb / ownColor.a;
    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);
    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;
    float resultAlpha = (ownColor.a + outerGlowAlpha);
    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);
}`;

/**
 * The CRTFilter applies a CRT effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/crt.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object} [options] - The optional parameters of CRT effect
 * @param {number} [options.curvature=1.0] - Bent of interlaced lines, higher value means more bend
 * @param {number} [options.lineWidth=1.0] - Width of the interlaced lines
 * @param {number} [options.lineContrast=0.25] - Contrast of interlaced lines
 * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
 * @param {number} [options.noiseSize=1.0] - The size of the noise particles
 * @param {number} [options.seed=0] - A seed value to apply to the random noise generation
 * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
 *        values produces a smaller vignette
 * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
 * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
 * @param {number} [options.time=0] - For animating interlaced lines
 */
export default class CRTFilter extends Phaser.Filter {
  constructor(game, options) {
    super(game);

    Object.assign(
      this,
      {
        curvature: { type: '1f', value: 0.0 },
        lineWidth: { type: '1f', value: 5.0 },
        lineContrast: { type: '1f', value: 0.43 },
        noise: { type: '1f', value: 0.74 },
        noiseSize: { type: '1f', value: 1.3 },
        seed: { type: '1f', value: 1.0 },
        vignetting: { type: '1f', value: 0.0 },
        vignettingAlpha: { type: '1f', value: 0.0 },
        vignettingBlur: { type: '1f', value: 0.0 },
      },
      options,
    );

    this.fragmentSrc = fragmentSrc;

    // this is usually done through this.game.add.filter method
    // but we'll call it manually as this filter uses ES6 module
    // import/export syntax and won't be shared through the Phaser
    // global scope
    this.init(options);
  }

  /**
   * Override existing init method in Phaser.Filter
   * @private
   */
  init(options = { width: 256, height: 256 }) {
    const { width, height } = options;
    this.setResolution(width, height);
  }

  /**
   * Bent of interlaced lines, higher value means more bend
   *
   * @member {number}
   * @default 1
   */
  set curvature(value) {
    this.uniforms.curvature = value;
  }
  get curvature() {
    return this.uniforms.curvature;
  }

  /**
   * Width of interlaced lines
   *
   * @member {number}
   * @default 1
   */
  set lineWidth(value) {
    this.uniforms.lineWidth = value;
  }
  get lineWidth() {
    return this.uniforms.lineWidth;
  }

  /**
   * Contrast of interlaced lines
   *
   * @member {number}
   * @default 0.25
   */
  set lineContrast(value) {
    this.uniforms.lineContrast = value;
  }
  get lineContrast() {
    return this.uniforms.lineContrast;
  }

  /**
   * Opacity/intensity of the noise effect between `0` and `1`
   *
   * @member {number}
   * @default 0
   */
  set noise(value) {
    this.uniforms.noise = value;
  }
  get noise() {
    return this.uniforms.noise;
  }

  /**
   * The size of the noise particles
   *
   * @member {number}
   * @default 0
   */
  set noiseSize(value) {
    this.uniforms.noiseSize = value;
  }
  get noiseSize() {
    return this.uniforms.noiseSize;
  }

  /**
   * The radius of the vignette effect, smaller
   * values produces a smaller vignette
   *
   * @member {number}
   * @default 0
   */
  set vignetting(value) {
    this.uniforms.vignetting = value;
  }
  get vignetting() {
    return this.uniforms.vignetting;
  }

  /**
   * Amount of opacity of vignette
   *
   * @member {number}
   * @default 0
   */
  set vignettingAlpha(value) {
    this.uniforms.vignettingAlpha = value;
  }
  get vignettingAlpha() {
    return this.uniforms.vignettingAlpha;
  }

  /**
   * Blur intensity of the vignette
   *
   * @member {number}
   * @default 0
   */
  set vignettingBlur(value) {
    this.uniforms.vignettingBlur = value;
  }
  get vignettingBlur() {
    return this.uniforms.vignettingBlur;
  }
}
