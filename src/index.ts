import { Animator, AvatarModifierArea, AvatarModifierType, CameraMode, CameraModeArea, CameraType, engine, Entity, executeTask, GltfContainer, InputAction, inputSystem, Material, MeshCollider, MeshRenderer, PBAvatarModifierArea, pointerEventsSystem, Transform, VisibilityComponent } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'


import { openInput, setupUi } from './ui'
import { createGLB } from './factory'
import { Globals, Keys } from './globals';
import { createImageEntity, drawImage, drawImages, ImageCubeEntity, restartMintImage } from './image'
import { mintImage, playInit } from './network';

let globals = Globals.getInstance();
//Create entity and assign shape
export function main() {

  /*   const meshEntity = engine.addEntity()
    Transform.create(meshEntity, {
      position: Vector3.create(16, 4, 16)
    })
    MeshRenderer.setPlane(meshEntity)
    
    //Create material and configure its fields
    Material.setBasicMaterial(meshEntity, {
      texture: Material.Texture.Common({
        src: "images/scene-thumbnail.png"
      })
    }) */
  let entityGround = engine.addEntity()
  let entitySky = engine.addEntity()

  let entityBack = engine.addEntity()
  let entityRight = engine.addEntity()
  let entityLeft = engine.addEntity()
  let entityAhead = engine.addEntity()

  // const iBack: ImageCubeEntity = createImageEntity(entityBack, Vector3.create(16, 10, 4.5), Vector3.create(24, 20, 0.1), Quaternion.fromEulerDegrees(0, 180, 0), 0)
  createGroundAndSky(entityGround, entitySky)
  /* drawpoltrait("A dream world based on metaverse, sleep room, landscape (((by moebius)))")
  drawhorizont("A big ((tall sky)) in a a dream world based on metaverse, sleep room, poltrait (((by moebius)))")
  */


  const entity = engine.addEntity()

  CameraModeArea.create(entity, {
    area: Vector3.create(63, 63, 63),
    mode: CameraType.CT_FIRST_PERSON,
  })
  // draw UI
  createGLB(17, 0.3, 16, 0.40, 0.40, 0.40, "assets/objects/capsula3.glb")




  const cama = createGLB(16, 0, 16, 0.5, 0.5, 0.5, "assets/objects/cama_dcl.glb")
  // fetch cube from Inspector 
  pointerEventsSystem.onPointerDown(
    { entity: cama, opts: { button: InputAction.IA_POINTER, hoverText: "Select lang & sleep..." } },
    () => {
      if (Globals.getInstance().isMenu1Visible)
        return;
      const escaleras = createGLB(8, 0, 7, 0.7, 1, 0.7, "assets/objects/escaleras2.glb")
      playInit(Globals.getInstance().get(Keys.lang), false)
      //const ojos = createGLB(17,3.3,16,0.40,0.40,0.40,"assets/objects/ojos2.glb",entity) 


      let response = ""
      console.log("ask for image")
      //const token = await getToken();
      //     ask()
      Globals.getInstance().isMenu2Visible = true
      console.log("ask for image after token")
      try {
        Transform.getMutable(entityBack).position.y = -50
        Transform.getMutable(entitySky).position.y = -50
        Transform.getMutable(entityRight).position.y = -50
        Transform.getMutable(entityLeft).position.y = -50
        Transform.getMutable(entityAhead).position.y = -50
      } catch { }
      engine.removeEntity(entityBack)
      engine.removeEntity(entitySky)
      engine.removeEntity(entityRight)
      engine.removeEntity(entityLeft)
      engine.removeEntity(entityAhead)

      entityBack = engine.addEntity()
      entitySky = engine.addEntity()
      entityRight = engine.addEntity()
      entityLeft = engine.addEntity()
      entityAhead = engine.addEntity()

      /*       const iBack: ImageCubeEntity = createImageEntity(entityBack, Vector3.create(16, 10, 4.5), Vector3.create(24, 20, 0.1), Quaternion.fromEulerDegrees(0, 180, 0), 0)
            const iRight: ImageCubeEntity = createImageEntity(entityRight, Vector3.create(25, 10, 15), Vector3.create(24, 20, 0.1), Quaternion.fromEulerDegrees(0, 90, 0), 1)
            const iAhead: ImageCubeEntity = createImageEntity(entityAhead, Vector3.create(15, 10, 27), Vector3.create(24, 20, 0.1), Quaternion.fromEulerDegrees(0, 0, 0), 2)
            const iLeft: ImageCubeEntity = createImageEntity(entityLeft, Vector3.create(5, 10, 15), Vector3.create(24, 20, 0.1), Quaternion.fromEulerDegrees(0, 90, 0), 3) */

      createGroundAndSky(entityGround, entitySky)

      const iRight: ImageCubeEntity = createImageEntity(entityRight, Vector3.create(25, 10, 15), Vector3.create(20, 20, 0.1), Quaternion.fromEulerDegrees(0, 90, 0), 2)
      const iAhead: ImageCubeEntity = createImageEntity(entityAhead, Vector3.create(15, 10, 25), Vector3.create(20, 20, 0.1), Quaternion.fromEulerDegrees(0, 0, 0), 1)
      const iLeft: ImageCubeEntity = createImageEntity(entityLeft, Vector3.create(5, 10, 15), Vector3.create(20, 20, 0.1), Quaternion.fromEulerDegrees(0, -90, 0), 0)

      const iBack: ImageCubeEntity = createImageEntity(entityBack, Vector3.create(15, 10, 5), Vector3.create(20, 20, 0.1), Quaternion.fromEulerDegrees(0, 180, 0), 3)

      let cubeImages2: ImageCubeEntity[] = [
        //iBack,
        iRight, iAhead, iLeft, iBack
      ]
      Globals.getInstance().set(Keys.images, cubeImages2)
      //drawpoltrait(Globals.getInstance().get(Keys.promptImagePoltrait))
      drawhorizont(Globals.getInstance().get(Keys.promptImageLandscape))
      /*       let cubeImages: ImageCubeEntity[] = [
              iBack,iRight,iAhead,iLeft
            ]
            drawImages(cubeImages, "2022 bioluminiscent metaverse landscape hyperbeast by brock hofer digital art, artstation gta cover comics style by (((Moebius)))", true)
            drawImage(entitySky, "a digital paint of the sky, masterpiece, with some aliens flying in its ovnis, ink style", Vector3.create(15, 20, 15), Vector3.create(24, 25, 0.1), Quaternion.fromEulerDegrees(90, 0, 0))
            drawImage(entityBack, "a fantasy door", Vector3.create(16, 10, 4.5), Vector3.create(24, 20, 0.1), Quaternion.fromEulerDegrees(0, 180, 0)) */

      VisibilityComponent.createOrReplace(cama, { visible: false })
      Transform.getMutable(cama).position.y = -50

      const cama2 = createGLB(16, 0, 16, 0.5, 0.5, 0.5, "assets/objects/cama2.glb")
      openInput()
      // pointerEventsSystem.removeOnPointerDown(cama)

      //callImage("A draw of a castle with a river, by van gogh")
    }
  )


  function drawpoltrait(prompt: string) {

    //const iGround: ImageCubeEntity = createImageEntity(entityGround, Vector3.create(16, 0.1, 16), Vector3.create(31, 31, 0.1), Quaternion.fromEulerDegrees(90, 0, 0), 2)
    const iBack: ImageCubeEntity = createImageEntity(entityBack, Vector3.create(15, 10, 5), Vector3.create(20, 20, 0.1), Quaternion.fromEulerDegrees(0, 180, 0), 1)
    const iSky: ImageCubeEntity = createImageEntity(entitySky, Vector3.create(15, 20, 15), Vector3.create(20, 20, 0.1), Quaternion.fromEulerDegrees(-90, 0, 180), 0)
    let cubePoltraitImages: ImageCubeEntity[] = [
      //iBack,
      iBack, iSky
    ]

    drawImages(cubePoltraitImages, prompt, false)
  }
}

export function drawhorizont(prompt: string) {


  let cubeImages: ImageCubeEntity[] = Globals.getInstance().get(Keys.images)

  engine.removeEntity(cubeImages[0].entity)
  engine.removeEntity(cubeImages[1].entity)
  engine.removeEntity(cubeImages[2].entity)
  engine.removeEntity(cubeImages[3].entity)

  let entityBack = engine.addEntity()
  let entityRight = engine.addEntity()
  let entityLeft = engine.addEntity()
  let entityAhead = engine.addEntity()
  const iRight: ImageCubeEntity = createImageEntity(entityRight, Vector3.create(25, 10, 15), Vector3.create(20, 20, 0.1), Quaternion.fromEulerDegrees(0, 90, 0), 2)
  const iAhead: ImageCubeEntity = createImageEntity(entityAhead, Vector3.create(15, 10, 25), Vector3.create(20, 20, 0.1), Quaternion.fromEulerDegrees(0, 0, 0), 1)
  const iLeft: ImageCubeEntity = createImageEntity(entityLeft, Vector3.create(5, 10, 15), Vector3.create(20, 20, 0.1), Quaternion.fromEulerDegrees(0, -90, 0), 0)
  const iBack: ImageCubeEntity = createImageEntity(entityBack, Vector3.create(15, 10, 5), Vector3.create(20, 20, 0.1), Quaternion.fromEulerDegrees(0, 180, 0), 3)

  let cubeImages2: ImageCubeEntity[] = [
    //iBack,
    iRight, iAhead, iLeft, iBack
  ]
  Globals.getInstance().set(Keys.images, cubeImages2)
  drawImages(cubeImages2, prompt, true)
  return cubeImages2
}
setupUi()

function createGroundAndSky(entityGround: Entity, entitySky: Entity) {
  drawImage(entityGround, Globals.getInstance().get(Keys.promptImageGround), Vector3.create(16, 0.1, 16), Vector3.create(32, 32, 0.1), Quaternion.fromEulerDegrees(90, 0, 0), "suelo.png")
  drawImage(entitySky, Globals.getInstance().get(Keys.promptImageGround), Vector3.create(15, 20, 16), Vector3.create(23, 24, 0.1), Quaternion.fromEulerDegrees(-90, 0, 180), "techo.png")

}

export function createMintCube(entity: Entity, path: string) {

  Transform.createOrReplace(entity, {
    position: Vector3.create(20, 2, 25),
    scale: Vector3.create(2, 2, 2),
  })

  if(path == "images/mint/mintonmatic.png"){
    
  pointerEventsSystem.onPointerDown(
    { entity: entity, opts: { button: InputAction.IA_POINTER, hoverText: Globals.getInstance().get(Keys.lang) == "es"? "Mintear imagen":"Mint Image" } },
    () => {
      let mintEntity = restartMintImage("images/mint/minting.png")
      mintImage()
      Globals.getInstance().set(Keys.mintEntity, mintEntity)
    })

  }

  // Fetch a mutable version of the transform

  MeshRenderer.setBox(entity)
  MeshCollider.setBox(entity)
  Material.setPbrMaterial(
    entity, {
    texture: Material.Texture.Common({
      src: path
    })
  })
}
 