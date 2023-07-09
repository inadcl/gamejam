import { Entity, Material, MeshCollider, MeshRenderer, Transform, engine, executeTask } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { Globals, Keys } from "./globals"
import { updatetimeinmin } from "./ui"
import { getToken } from "./network"
import { createMintCube } from "."


export class ImageCubeEntity {
    entity: Entity
    pos: number
    constructor(pos: number, entity: Entity) {
        this.entity = entity
        this.pos = pos
    }

    getPos() {
        return this.pos
    }
    getEntity() {
        return this.entity
    }
}


export function askForImage(entity: Entity, prompt: string) {
    const url = 'https://inadcl.ddns.net/'
    executeTask(async () => {
        if (Globals.getInstance().get(Keys.waitingforimage)) {
            return;
        }
        try {
            Material.setPbrMaterial(
                entity, {
                texture: Material.Texture.Common({
                    src: "images/loading/2.png"
                })
            })
            Globals.getInstance().set(Keys.waitingforimage, true)
            let path = ""
            let imagesufix = ""
            path = 'request.php'
            imagesufix = ""


            const imagerequest = await fetch(url + path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: "token",
                    prompt: prompt
                    // Otros datos van aquí...
                }), timeout: 100000
            })

            const imagesrc = await imagerequest.text();

            Material.setPbrMaterial(
                entity, {
                texture: Material.Texture.Common({
                    src: url + imagesrc
                })
            })
        } catch {
            Material.setPbrMaterial(
                entity, {
                texture: Material.Texture.Common({
                    src: "images/error.png"
                })
            })
        } finally {
            Globals.getInstance().set(Keys.waitingforimage, false)
        }
    })
}

export function askForImages(imageEntities: ImageCubeEntity[], prompt: string, landscape: boolean) {
    const url = 'https://inadcl.ddns.net/'
    executeTask(async () => {
        if (Globals.getInstance().get(Keys.waitingforimagelandscape)) {
            return;
        }
        try {
            Material.setPbrMaterial(
                imageEntities[0].entity, {
                texture: Material.Texture.Common({
                    src: "images/loading/0.png"
                })
            })

            Material.setPbrMaterial(
                imageEntities[1].entity, {
                texture: Material.Texture.Common({
                    src: "images/loading/1.png"
                })
            })

            Material.setPbrMaterial(
                imageEntities[2].entity, {
                texture: Material.Texture.Common({
                    src: "images/loading/2.png"
                })
            })

            Material.setPbrMaterial(
                imageEntities[3].entity, {
                texture: Material.Texture.Common({
                    src: "images/loading/3.png"
                })
            })
            Globals.getInstance().set(Keys.waitingforimagelandscape, true)
            const token = await getToken()

            let path = ""
            let imagesufix = ""
            path = 'requestpoltrait.php'
            if (landscape) {
                path = 'requestlandscape2.php'
                prompt = prompt 
            } else {
                path = 'requestpoltrait.php'
                prompt = "(((a poltrait of)))" + prompt + ",((((with a tall sky))))"
            }
            imagesufix = ""


            const imagerequest = await fetch(url + path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    prompt: prompt
                    // Otros datos van aquí...
                }), timeout: 100000
            })

            const imagesrc = await imagerequest.text();
            console.log(imagesrc)
            for (let imageEntity of imageEntities) {
                console.log(url + imagesrc + String(imageEntity.getPos()) + ".png")
                imageEntity.getPos()

                Material.setPbrMaterial(
                    imageEntity.getEntity(), {
                    texture: Material.Texture.Common({
                        src: url + imagesrc + String(imageEntity.getPos()) + ".png"
                    })
                })
            }
            
            Globals.getInstance().set(Keys.activeImage, url+imagesrc.replace("images/",""))
            let mintEntity = restartMintImage("images/mint/mintonmatic.png")
            Globals.getInstance().set(Keys.mintEntity, mintEntity)
            const token2 = await getToken()
        } catch {
            let mintEntity = restartMintImage("images/mint/mintederror.png")
            Globals.getInstance().set(Keys.mintEntity, mintEntity)
            Material.setPbrMaterial(
                imageEntities[0].entity, {
                texture: Material.Texture.Common({
                    src: "images/error/0.png"
                })
            })

            Material.setPbrMaterial(
                imageEntities[1].entity, {
                texture: Material.Texture.Common({
                    src: "images/error/1.png"
                })
            })

            Material.setPbrMaterial(
                imageEntities[2].entity, {
                texture: Material.Texture.Common({
                    src: "images/error/2.png"
                })
            })

            Material.setPbrMaterial(
                imageEntities[3].entity, {
                texture: Material.Texture.Common({
                    src: "images/error/3.png"
                })
            })
        } finally {
            Globals.getInstance().set(Keys.waitingforimagelandscape, false)
        }
    })

}


export function createImageEntity(entity: Entity,
    pos: Vector3.ReadonlyVector3, scale: Vector3.ReadonlyVector3,
    rotation: Quaternion.MutableQuaternion, imagepos: number): ImageCubeEntity {
    Transform.createOrReplace(entity, {
        position: pos,
        scale: scale,
    })


    // Fetch a mutable version of the transform
    const mutableTransform = Transform.getMutable(entity)

    // Set the rotation with an object, from euler angles
    if (rotation) {
        mutableTransform.rotation = rotation
    }
    mutableTransform.scale.z = 0.2

    MeshRenderer.setPlane(entity)
    MeshCollider.setBox(entity)

    return new ImageCubeEntity(imagepos, entity)
}


export function createEntity(entity: Entity, pos: Vector3.ReadonlyVector3, scale: Vector3.ReadonlyVector3, rotation: Quaternion.MutableQuaternion | undefined) {
    Transform.createOrReplace(entity, {
        position: pos,
        scale: scale,
    })


    // Fetch a mutable version of the transform
    const mutableTransform = Transform.getMutable(entity)

    // Set the rotation with an object, from euler angles
    if (rotation) {
        mutableTransform.rotation = rotation
    }
    MeshRenderer.setPlane(entity)
    MeshCollider.setBox(entity)
    return entity
}



export function drawImage(entity: Entity, prompt: string, pos: Vector3, scale: Vector3, rotation: Quaternion.MutableQuaternion, image?: string) {
    createEntity(entity, pos, scale, rotation)
    if (image) {
        Material.setPbrMaterial(
            entity, {
            texture: Material.Texture.Common({
                src: "images/" + image
            })
        })
    } else {
        askForImage(entity, prompt)
    }
}

export function drawImages(entities: ImageCubeEntity[], prompt: string, landscape: boolean) {
    askForImages(entities, prompt, landscape)
}

export function restartMintImage(path: string) {
    let mintEntity  = Globals.getInstance().get(Keys.mintEntity)
    if (mintEntity != undefined){
        const mutableTransform = Transform.getMutable(mintEntity)
        mutableTransform.position.y = -50
        engine.removeEntity(mintEntity)
    }
    mintEntity = engine.addEntity()

    Globals.getInstance().set(Keys.mintEntity, mintEntity)
    createMintCube(mintEntity, path)
    return mintEntity
}
