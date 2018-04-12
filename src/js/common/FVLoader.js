/* global Phaser */
import FontFaceObserver from 'font-face-observer';

// We create our own custom loader class extending Phaser.Loader.
// This new loader will support web fonts
function FVLoader(game) {
  Phaser.Loader.call(this, game);
}

FVLoader.prototype = Object.create(Phaser.Loader.prototype);
FVLoader.prototype.constructor = FVLoader;

// new method to load web fonts
// this follows the structure of all of the file assets loading methods
FVLoader.prototype.webfont = function webfont(key, fontName) {
  // here fontName will be stored in file's `url` property
  // after being added to the file list
  this.addToFileList('webfont', key, fontName);
  return this;
};

FVLoader.prototype.loadFile = function loadFile(file) {
  Phaser.Loader.prototype.loadFile.call(this, file);

  // we need to call asyncComplete once the file has loaded
  if (file.type === 'webfont') {
    const ctx = this;
    // note: file.url contains font name
    const font = new FontFaceObserver(file.url);
    font.check().then(
      () => {
        ctx.asyncComplete(file);
      },
      () => {
        ctx.asyncComplete(file, `Error loading font ${file.url}`);
      },
    );
  }
};

export default FVLoader;
