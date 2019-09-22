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
    ObjectUtils.JSONArray(texture, 0, atlas);
    entity.getUniform('color').value = color;
    entity.renderWebGL(entity.renderer, entity);

    entity.renderToTexture = false;
  }

  public static Clone (obj)
{
    var clone = {};

    for (var key in obj)
    {
        if (Array.isArray(obj[key]))
        {
            clone[key] = obj[key].slice(0);
        }
        else
        {
            clone[key] = obj[key];
        }
    }

    return clone;
};
  public static JSONArray(texture, sourceIndex, json)
    {
        //  Malformed?
        if (!json['frames'] && !json['textures'])
        {
            console.warn('Invalid Texture Atlas JSON Array');
            return;
        }
    
        //  Add in a __BASE entry (for the entire atlas)
        var source = texture.source[sourceIndex];
    
        texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);
    
        //  By this stage frames is a fully parsed array
        var frames = (Array.isArray(json.textures)) ? json.textures[sourceIndex].frames : json.frames;
    
        var newFrame;
    
        for (var i = 0; i < frames.length; i++)
        {
            var src = frames[i];
    
            //  The frame values are the exact coordinates to cut the frame out of the atlas from
            newFrame = texture.add(src.filename, sourceIndex, src.frame.x, src.frame.y, src.frame.w, src.frame.h);
    
            //  These are the original (non-trimmed) sprite values
            if (src.trimmed)
            {
                newFrame.setTrim(
                    src.sourceSize.w,
                    src.sourceSize.h,
                    src.spriteSourceSize.x,
                    src.spriteSourceSize.y,
                    src.spriteSourceSize.w,
                    src.spriteSourceSize.h
                );
            }
    
            if (src.rotated)
            {
                newFrame.rotated = true;
                newFrame.updateUVsInverted();
            }
    
            if (src.anchor)
            {
                newFrame.customPivot = true;
                newFrame.pivotX = src.anchor.x;
                newFrame.pivotY = src.anchor.y;
            }
    
            //  Copy over any extra data
            newFrame.customData = ObjectUtils.Clone(src);
        }
    
        //  Copy over any additional data that was in the JSON to Texture.customData
        for (var dataKey in json)
        {
            if (dataKey === 'frames')
            {
                continue;
            }
    
            if (Array.isArray(json[dataKey]))
            {
                texture.customData[dataKey] = json[dataKey].slice(0);
            }
            else
            {
                texture.customData[dataKey] = json[dataKey];
            }
        }    
        return texture;
    };
}

