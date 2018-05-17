/* global Phaser */
class FilterGray extends Phaser.Filter {
  constructor(game) {
    super(game);
    this.uniforms.gray = { type: '1f', value: 1.0 };
    this.fragmentSrc = [
      'precision mediump float;',

      'varying vec2       vTextureCoord;',
      'varying vec4       vColor;',
      'uniform sampler2D  uSampler;',
      'uniform float      gray;',

      'void main(void) {',
      'gl_FragColor = texture2D(uSampler, vTextureCoord);',
      'gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), gray);',
      '}',
    ];
  }

  set gray(value) {
    this.uniforms.gray.value = value;
  }

  get gray() {
    return this.uniforms.gray.value;
  }
}

export default FilterGray;
