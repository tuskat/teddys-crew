export class ObjectUtils {    
  // --------------------------------------------------------------------
  public static loadJson(fileName: string): Promise<any> {

      return new Promise(function (resolve, reject) {

          let request = new XMLHttpRequest();

          request.open('GET', fileName, true);
          request.responseType = 'json';

          request.onload = function () {
              if (request.status === 200) {
                  resolve(request.response);
              } else {
                  reject(new Error(`Error loading ${fileName}: ${request.statusText}`));
              }
          };

          request.onerror = function () {
              reject(new Error(`Network error while loading ${fileName}`));
          };

          request.send();
      });
  }

  // --------------------------------------------------------------------
  public static loadValuesIntoObject(jsonData: any, targetObject: any) {

      console.log(`----- loading values into ${targetObject.name} -----`);

      for (let property in jsonData) {
          console.log(`name = ${property}, value = ${jsonData[property]}`);
          targetObject[property] = jsonData[property];
      }

      console.log("------------------------------------------------");
  }

  public static paletteSwap(scene, color, index) {
    let entity = scene.add.shader('Palette').setVisible(false);
    entity.setRenderToTexture('entity_body_'+ index, true);
    entity.setChannel0('entity_body');
    let atlas = scene.cache.json.get('entity_body');
    let texture = scene.textures.list['entity_body_'+ index];
    Phaser.Textures.Parsers.JSONArray(texture, 0, atlas);
    entity.getUniform('color').value = color;
    entity.renderWebGL(entity.renderer, entity);

    entity.renderToTexture = false;
  }
}

