import {
  engine,
  MeshCollider,
  MeshRenderer,
  Transform,
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Input, Label, ReactEcsRenderer, UiComponent, UiEntity } from '@dcl/sdk/react-ecs'
import { Cube } from './components'
import { createCube } from './factory'
import { timers } from '@dcl-sdk/utils'
import { Callback } from '@dcl-sdk/utils/dist/timer'
import { askForImage, askForImages } from './image'

import { Globals, Keys, Languages } from './globals';
import { playAudioRequest, playInit } from './network'
import { drawhorizont } from '.'
// Variable to reflect current state of menu visibility


function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return ' no data yet'
  const { x, y, z } = playerPosition.position
  return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}
var timeinmin = "1"
export function updatetimeinmin(value: string) {
  timeinmin = value
}
var isMenuVisible: boolean[] = [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
export function setupUi() {
  Globals.getInstance().isMenu1Visible = true;
  Globals.getInstance().isMenu2Visible = false;
  ReactEcsRenderer.setUiRenderer(() => (
    <UiEntity
      uiTransform={{
        width: 500,
        height: 100,
        justifyContent: 'space-between',
        padding: 4,
        alignSelf: 'center',
        display: Globals.getInstance().isMenu1Visible ? 'flex' : 'none'
      }}
      uiBackground={{ color: Color4.Gray() }}
    >
      <Label
        value={"Select your language:"}
        uiTransform={{ width: "100%", height: 20, margin: 4 }}
        onMouseDown={() => {
        }}
      />
      <Button
        value="English"
        variant='primary'
        uiTransform={{ width: "100%", height: 40, margin: 24 }}
        onMouseDown={() => {

          let globals = Globals.getInstance();
          globals.set(Keys.lang, Languages.eng);
          Globals.getInstance().isMenu1Visible = false
        }}
      />
      <Button
        value="Español"
        variant='secondary'
        uiTransform={{ width: "100%", height: 40, margin: 24 }}
        onMouseDown={() => {
          let globals = Globals.getInstance();
          globals.set(Keys.lang, Languages.es);

          playInit(Globals.getInstance().get(Keys.lang), true)
          Globals.getInstance().isMenu1Visible = false
        }}
      />
    </UiEntity>
  ))
}

function toggleMenuVisibility(pos: number) {
  isMenuVisible[pos] = !isMenuVisible[pos]
}

/* export function drawFirst(posicion:string, isMenuVisible:boolean[], pos:number){

ReactEcsRenderer.setUiRenderer(() => (
  // parent entity
  <UiEntity
    uiTransform={{
      width: 200,
      height: 200,
      margin: { top: '250px', left: '500px' }
    }}
    uiBackground={{ color: Color4.Blue() }}
  >
    // self-closing child entity
    <UiEntity
      uiTransform={{
        width: 400,
        height: 400,
        margin: { top: '35px', left: '500px' }
      }}
      uiText={{ value: `Hello world!`, fontSize: 40 }}
    />
  // closing statement for the parent entity
  </UiEntity>
))
}

} */
let poltraitEntity = engine.addEntity()
export function openInput() {
  console.log("openui");
  var drawUserText = ""
  var askUserText = ""
  var changeiacharacter = ""
  const instresp = "Manten el audio activo. \nPodras dibujar landscapes (mejor introducir en ingles el texto)\n Ademas de dibujar e invocar y preguntar a personajes vivos o muertos ficticios o reales \n rellena todos los campos para ver todos los botones \n algunos se ocultaran por momentos para evitar sobrecarga del server \n Los personajes te responderan por audio. \n Busca el cubo polygon para mintear tus sueños. \n Los botones de accion se muestran/ocultan de manera inteligente \n para no saturar el servidor,\n recuerda rellenar todos los campos para verlos.\n Si presionas la tecla U puedes ocultar/mostrar la ui para ver el paisaje o los botones"
  const instren = "Keep the audio active. \nYou will be able to draw landscapes (it's best to input the text in English)\n In addition to drawing, you can invoke and ask questions to living or dead characters,\n whether they are real or fictitious \n Fill in all the fields to see all the buttons \n some will be hidden at times to avoid server overload \n The characters will respond to you by audio. \n Look for the Polygon cube to mint your dreams. \n The action buttons are smartly shown/hidden \n to avoid overloading the server, \n remember to fill in all the fields to see them.\n If you press the U key, you can hide/show the UI to see the landscape or the buttons."
  const activeInfo = Globals.getInstance().get(Keys.lang) == Languages.eng ? instren : instresp
  var drawText = Globals.getInstance().get(Keys.lang) == Languages.eng ? "What do you want draw? Write your prompt and dream" : "¿Que quieres dibujar? Escribe tu prompt y sueña"
  var askia = Globals.getInstance().get(Keys.lang) == Languages.eng ? "Write here the question for the AI" : "Escribe aquí tu pregunta para la ia"
  var changeia = Globals.getInstance().get(Keys.lang) == Languages.eng ? "Write here the name and surname of the character (real or fictitious, alive or dead) you want to invoke." : "Escribe aquí nombre y apellidos del personaje(real o ficticio, vivo o muerto) que quieras invocar"
  Globals.getInstance().isMenu2Visible = true
  //export type JustifyType = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  ReactEcsRenderer.setUiRenderer(() => (
    <UiEntity
      uiTransform={{
        width: 500,
        height: 720,
        justifyContent: 'flex-start',
        alignSelf: 'flex-end',
        flexDirection: 'column',
        display: Globals.getInstance().isMenu2Visible ? 'flex' : 'none'
      }}
      uiBackground={{ color: Color4.Gray() }}
    >
      
      <Label
      uiTransform={{
        height: 10,
        width: 500,
        justifyContent: 'flex-start',
        padding: 4,
        alignSelf: 'flex-end',
        flexWrap: "wrap",
        flexDirection: 'column',
      }}
        value={"Lucid Dream Machine. Server delay:" + timeinmin + " min"+"\n"+drawText}
      />

      <Input
        onChange={(e) => { drawUserText = e; }}
        fontSize={25}
        uiTransform={{ height: 40, margin: '5px 0' }}
        placeholder={"type something"}
        placeholderColor={Color4.Gray()}
      />
      <Button
        value={Globals.getInstance().get(Keys.lang) == Languages.eng ? "Draw" : "Dibuja"}
        variant='primary'
        uiTransform={{ height: 40, margin: '5px 0', display: (!Globals.getInstance().get(Keys.waitingforimagelandscape) ? 'flex' : 'none') }}
        onMouseDown={() => {
          console.log("ok")
          if (!Globals.getInstance().get(Keys.waitingforimagelandscape)) {
            Globals.getInstance().set(Keys.promptImageLandscape, drawUserText)
            drawhorizont(drawUserText)
          }
        }}
      />

      <Label value={askia} fontSize={10} 
         uiTransform={{ height: 30, margin: '5px 0' }} />

      <Input
        onChange={(e) => { askUserText = e; }}
        fontSize={25}
         uiTransform={{ height: 40, margin: '5px 0' }}
       
        placeholder={"type something"}
        placeholderColor={Color4.Gray()}
      />
      
      <Button
        value={Globals.getInstance().get(Keys.lang) == Languages.eng ? "Click to ask" : "Clic para preguntar"}
        variant='primary'
        uiTransform={{
          height: 40, margin: '5px 0', display: ((askUserText != "" && changeiacharacter != "") && ((!Globals.getInstance().get(Keys.waitingforai)))
            ? 'flex' : 'none')
        }}
        onMouseDown={() => {
          console.log("click")
          if (!Globals.getInstance().get(Keys.waitingforai)) {
            Globals.getInstance().set(Keys.character, changeiacharacter)
            Globals.getInstance().set(Keys.promptChat, askUserText)
            playAudioRequest()
          }
        }}
      />

      <Label value={changeia} fontSize={10}
        uiTransform={{ height: 40, margin: '5px 0' }} />

      <Input
        onChange={(e) => { changeiacharacter = e; }}
        fontSize={25}
        uiTransform={{ height: 40, margin: '5px 0' }}
        placeholder={"type something"}
        placeholderColor={Color4.Gray()}
      /> 
      <Button
        value={Globals.getInstance().get(Keys.lang) == Languages.eng ? "Click to draw poltrait of your selected character" : "Clic para dibujar retrato de personaje"}
        variant='primary'
        uiTransform={{
          height: 40, display: ((changeiacharacter != "") && ((!Globals.getInstance().get(Keys.waitingforimage) && !Globals.getInstance().get(Keys.waitingforimagelandscape)))
            ? 'flex' : 'none')
        }}
        onMouseDown={() => {
          console.log("click")
          if (!Globals.getInstance().get(Keys.waitingforimage)) {
            Globals.getInstance().set(Keys.character, changeiacharacter)
            
              MeshRenderer.setBox(poltraitEntity);
              Transform.createOrReplace(poltraitEntity, {
              position: Vector3.create(16, 4, 19),
              scale: Vector3.create(2, 2, 0.5),
            })

            askForImage(poltraitEntity, "poltrait of (("+Globals.getInstance().get(Keys.character)+")), by random artist")
            Globals.getInstance().set(Keys.activePoltrait, changeiacharacter)
          }
        }}
      />
      <Label value={""} fontSize={10}
          uiTransform={{ height: 50, margin: '5px 0' }} />
      <Label value={activeInfo} fontSize={10}
        uiTransform={{ height: 50, margin: '5px 0' }} />
        <Label value={""} fontSize={10}
          uiTransform={{ height: 50, margin: '5px 0' }} />
    </UiEntity>
  ))
  console.log("openui")
} 
