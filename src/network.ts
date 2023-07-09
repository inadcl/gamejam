import { AudioSource, AudioStream, Entity, Material, MeshRenderer, Transform, VideoPlayer, executeTask } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { engine } from '@dcl/sdk/ecs'
import { Globals, Keys, Languages } from "./globals";
import { updatetimeinmin } from "./ui";
import { onSceneReadyObservable} from '@dcl/sdk/observables'
import { restartMintImage } from "./image";
const url='https://inadcl.ddns.net/'
export async function getToken() {
  const response = await fetch(url+'token.php', { timeout: 10000 })
  const data = await response.text();
  Globals.getInstance().minutesServerWait = JSON.parse(await data)["time"]
  updatetimeinmin(await Globals.getInstance().minutesServerWait )
  return JSON.parse(await data)["token"];
}

onSceneReadyObservable.add(() => {
  playInit(Globals.getInstance().get(Keys.lang), true)
})

const screen1 = engine.addEntity()

export async function playInit(lang:Languages, intro:boolean) {

  MeshRenderer.setPlane(screen1)
  Transform.createOrReplace(screen1, { position: { x: 4, y: -11, z: 4 } })
  if (intro){
  VideoPlayer.createOrReplace(screen1, {
    src: lang==Languages.eng?'https://inadcl.ddns.net/videos/introeng.mp4':"https://inadcl.ddns.net/videos/introesp.mp4",
    playing: true,
  })
}else{
  VideoPlayer.createOrReplace(screen1, {
    src: lang==Languages.eng?'https://inadcl.ddns.net/videos/instruccionesen.mp4':"https://inadcl.ddns.net/videos/instruccionesesp.mp4",
    playing: true,
  })
}
  
  const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen1 })
  
  // #4
  Material.setPbrMaterial(screen1, {
    texture: videoTexture,
    emissiveTexture: videoTexture,
    emissiveIntensity: 0.6,
    roughness: 1.0,
  })
}

export async function playAudioRequest() {
  try{
  Globals.getInstance().set(Keys.waitingforai, true)
  const audiorequest = await fetch(url +'audiorequest.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        token: "token",
        character: Globals.getInstance().get(Keys.character),
        promptChat: Globals.getInstance().get(Keys.promptChat),
        lang: Globals.getInstance().get(Keys.lang),
    }), timeout: 100000
})

  const mp3src = url+ "videos/"+ await audiorequest.text();

/*   AudioStream.create(streamEntity,{
    url: "https://inadcl.ddns.net/audios/1688512581.mp3",
    playing: true,
    volume: 0.8
  }) */
  
/*   AudioSource.create(sourceEntity, {
    audioClipUrl: "https://inadcl.ddns.net/audios/1688512581.mp3",
    loop: false,
    playing: true,
    volume: 0.8
  }) */

  VideoPlayer.createOrReplace(screen1, {
    src: mp3src+'.mp4',
    playing: true,
    loop: false,
  })
  
  const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen1 })
  
  // #4
  Material.setPbrMaterial(screen1, {
    texture: videoTexture,
    emissiveTexture: videoTexture,
    emissiveIntensity: 0.6,
    roughness: 1.0,
  })
}catch{}
finally{
  Globals.getInstance().set(Keys.waitingforai, false)
}
}
/* 
export function ask(){

} */
/*     await makeRequest().then( (response)=>{
    
      const meshEntity = engine.addEntity()
      Transform.create(meshEntity, {
        position: Vector3.create(4, 4, 4)
      })
      MeshRenderer.setPlane(meshEntity)
      
      //Create material and configure its fields
      Material.setPbrMaterial(meshEntity, {
        texture: Material.Texture.Common({
          src: response
        })
      })

    }) */
    
// export async function makeRequest() {
//     console.log("ask for image2")
//     debugger
//     console.log("makerequest to "+url+ 'request.php')
//         //const token = await getToken();
        
//         //console.log(token)
//         const response = await fetch(url + 'request.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 token: "token",
//                 prompt: "A gigant elephant, by picasso"
//                 // Otros datos van aquí...
//             })
//         ).then( (res) =>{
//             let json = JSON.passsdaarse(res)});
//         return urlimage
//         console.log(urlimage)
        
    // Procesa la respuesta...


    export function mintImage() {
      let prompt = Globals.getInstance().get(Keys.promptImageLandscape)
      let userWallet = Globals.getInstance().get(Keys.userWallet)
      let entity = Globals.getInstance().get(Keys.mintEntity)
      const url = 'https://inadcl.ddns.net/'
      executeTask(async () => {
          if (Globals.getInstance().get(Keys.userWallet) == undefined || Globals.getInstance().get(Keys.minting) || Globals.getInstance().get(Keys.waitingforimagelandscape) || userWallet =="" || prompt=="" || Globals.getInstance().get(Keys.activeImage)=="") {
              return;
          }
          try {
              Globals.getInstance().set(Keys.minting, true)
               
              let path = ""
              let imagesufix = ""
              path = 'publishimage.php'
              imagesufix = ""
              const userWallet = Globals.getInstance().get(Keys.userWallet)
              let imageFile = Globals.getInstance().get(Keys.activeImage).replace(".png","").replace("https://inadcl.ddns.net/","").replace(" ","")
              const imagerequest = await fetch(url + path, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      time: imageFile,
                  }), timeout: 100000
              })
              const tokenuri = await imagerequest.text()
              if (tokenuri == "Error"){
                throw "ERROR"
              }
              const tokenfixed = tokenuri.split("<br>")[0]
              path = 'mint.php'
              const mintrequest = await fetch(url + path, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      uri: tokenfixed,
                      wallet: userWallet,
                  }), timeout: 100000
              })
  
              const imagesrc = await mintrequest.text();
              console.log(imagesrc)
              let mintEntity = restartMintImage("images/mint/minted.png")
          } catch (e){
            console.log(e)
            let mintEntity = restartMintImage("images/mint/mintederror.png")
          } finally {
              Globals.getInstance().set(Keys.minting, false)
          }
      })
  }