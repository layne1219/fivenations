/* function to save JSON to file from browser
* adapted from http://bgrins.github.io/devtools-snippets/#console-save
* @param {Object} data -- json object to save
* @param {String} file -- file name to save to
*/
function saveJSON(data, filename) {
  if (!data) {
    console.error('No data');
    return;
  }

  if (!filename) filename = 'console.json';

  if (typeof data === 'object') {
    data = JSON.stringify(data, undefined, 4);
  }

  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  const evt = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ['application/json', a.download, a.href].join(':');
  a.dispatchEvent(evt);
}

/**
 * DataEditor object that represents an editorial block with all
 * the requried functionality
 * @param {string} id
 * @param {tring} editorParentElmId
 */
function DataEditor(id, editorParentElmId) {
  const parent = document.getElementById(editorParentElmId);
  const div = document.createElement('div');

  this.textArea = document.createElement('textarea');
  this.textArea.setAttribute('id', id);

  const button = document.createElement('button');
  button.innerHTML = 'Save';
  button.addEventListener('click', () => {
    if (!this.key || !this.textArea.value) return;
    saveJSON(this.textArea.value, this.key);
  });

  div.appendChild(this.textArea);
  div.appendChild(button);
  parent.appendChild(div);

  window.editor = true;
}

DataEditor.prototype = {
  edit(key, data) {
    this.setData(key, data);
    this.persist();
    this.setOnChangeListener();
  },

  setData(key, data) {
    this.key = key;
    this.textArea.value = data;
  },

  clear() {
    this.textArea.value = '';
  },

  setOnChangeListener() {
    if (this.keyUpListener) { this.textArea.removeEventListener('keyup', this.keyUpListener); }
    this.keyUpListener = this.textArea.addEventListener('keyup', () => {
      this.persist();
    });
  },

  persist() {
    localStorage.setItem(this.key, this.textArea.value);
  },
};

function getDataEditorManager(parentElmId) {
  const editors = ['entity', 'weapon', 'projectile'].reduce((obj, key) => {
    obj[key] = new DataEditor(key, parentElmId);
    return obj;
  }, {});

  return {
    get(key) {
      return editors[key];
    },

    clearAll() {
      Object.keys(editors).forEach(key => editors[key].clear());
    },

    onEntitySelect(game) {
      let dataSource;
      const entities = game.entityManager.entities(':selected');
      if (!entities || entities.length === 0 || entities.length > 1) {
        this.clearAll();
        return;
      }

      const dataObject = entities[0].getDataObject();
      const id = dataObject.getId();
      let json;

      if (localStorage.getItem(id)) {
        json = localStorage.getItem(id);
      } else {
        json = dataObject.toJSON();
      }

      this.get('entity').edit(id, json);
    },

    onWeaponSelect(game, weapon) {
      const id = weapon.getId();
      let json;
      let projectileId;

      if (!id) return;

      if (localStorage.getItem(id)) {
        json = localStorage.getItem(id);
      } else {
        json = weapon.toJSON();
      }

      this.get('weapon').edit(id, json);

      projectileId = weapon.getEffect();

      if (!projectileId) return;

      if (localStorage.getItem(projectileId)) {
        json = localStorage.getItem(projectileId);
      } else {
        json = JSON.stringify(
          game.game.cache.getJSON(projectileId),
          null,
          '  ',
        );
      }

      if (!json) return;

      this.get('projectile').edit(projectileId, json);
    },
  };
}
