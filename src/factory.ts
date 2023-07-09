import {
  Entity,
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  PointerEvents,
  PointerEventType,
  InputAction,
  Material,
  GltfContainer,
  VisibilityComponent
} from '@dcl/sdk/ecs'
import { Cube, Spinner } from './components'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { getRandomHexColor } from './utils'

export function createGLB(x:number, y:number, z:number, scalex:number, scaley:number, scalez:number, glb_path:string, fromEntity?:Entity){
  
  const entity = (fromEntity)?fromEntity:engine.addEntity()
  GltfContainer.create(entity, {
    src: glb_path,
  })
  Transform.create(entity, {
    position: Vector3.create(x, y, z),
    scale: Vector3.create(scalex,scaley,scalez)
  }) 

  
  VisibilityComponent.create(entity, { visible: true })
  return entity
  
}

// Cube factory
export function createCube(x: number, y: number, z: number, spawner = true): Entity {
  const entity = engine.addEntity()

  // Used to track the cubes
  Cube.create(entity)

  Transform.create(entity, { position: { x, y, z } })

  // set how the cube looks and collides
  MeshRenderer.setPlane(entity)
  MeshCollider.setBox(entity)
  Material.setPbrMaterial(entity, { albedoColor: Color4.fromHexString(getRandomHexColor()) })

  // Make the cube spin, with the circularSystem
  Spinner.create(entity, { speed: 10 * Math.random() })

  // if it is a spawner, then we set the pointer hover feedback
  if (spawner) {
    PointerEvents.create(entity, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_PRIMARY,
            hoverText: 'Press E to spawn',
            maxDistance: 100,
            showFeedback: true
          }
        }
      ]
    })
  }

  return entity
}

