import {
  engine,
  MeshRenderer,
  Transform,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiComponent, UiEntity } from '@dcl/sdk/react-ecs'
import { Cube } from './components'
import { createCube } from './factory'
import { timers } from '@dcl-sdk/utils'
import { Callback } from '@dcl-sdk/utils/dist/timer'

var currentTextString = ""