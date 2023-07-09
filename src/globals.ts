import { executeTask } from "@dcl/sdk/ecs";
import { getUserData } from "~system/UserIdentity";

export enum Keys {
    lang = "lang",
    prompt = "prompt",
    images = "images",
    character ="character",
    promptChat = "promptChat",
    promptImageLandscape = "promptImageLandscape",
    promptImagePoltrait = "promptImagePoltrait",
    promptImageGround = "promptImageGround",
    activePoltrait = "activePoltrait",
    waitingforimage = "waitingforimage",
    waitingforimagelandscape = "waitingforimagelandscape",
    waitingforai = "waitingforai",
    activeImage = "activeImage",
    minting = "minting",
    userWallet= "userWallet",
    mintEntity="mintEntity"
}

export enum Languages {
    es = "es",
    eng = "en"
}
export class Globals { 
    private static instance: Globals;
    private data: { [key: string]: any } = {}; 
  isMenu2Visible: boolean=false;
  isMenu1Visible: boolean=false;
  minutesServerWait: string = "1min"

    private constructor() { }

    public static getInstance(): Globals {
        if (!Globals.instance) {
            Globals.instance = new Globals();
            //default values:
            Globals.instance.set(Keys.lang, Languages.eng)
            Globals.instance.set(Keys.character, "Salvador dalí")
            Globals.instance.set(Keys.promptImageLandscape, "A dream world based on metaverse landscape (((by random artist))), masterpiece")
            Globals.instance.set(Keys.promptImagePoltrait, "A dream world based on metaverse landscape (((by moebius))), masterpiece")
            Globals.instance.set(Keys.promptImageGround, "((a background texture, metaverse,dreams, by random style))")
            Globals.instance.set(Keys.promptChat, "Welcome to my scene create to the decentraland gamejam, lucid dreams, please select a language before start to sleep")
            Globals.instance.set(Keys.promptChat, "Welcome to my scene create to the decentraland gamejam, lucid dreams, please select a language before start to sleep")
            Globals.instance.set(Keys.waitingforai, false)
            Globals.instance.set(Keys.waitingforimage, false)
            Globals.instance.set(Keys.waitingforimagelandscape, false)
            Globals.instance.set(Keys.minting, false)
            Globals.instance.set(Keys.activeImage, "")
            Globals.instance.set(Keys.activePoltrait, "")
            Globals.instance.set(Keys.mintEntity, undefined)
            getWallet()

            
        }

        return Globals.instance;
    }

    get(key: Keys): any {
        return this.data[key];
    }

    set(key: Keys, value: any): void {
        this.data[key] = value;
    }
}

function getWallet(): any {
    
executeTask(async () => {
    let userData = await getUserData({})
    if (userData != undefined && userData.data != undefined){
    if(userData.data.hasConnectedWeb3){
      Globals.getInstance().set(Keys.userWallet,userData.data.publicKey)
    }}
    else{
        Globals.getInstance().set(Keys.userWallet,"")
    }
  })
}
// Uso
/* let globals = Globals.getInstance();
globals.set(Keys.lang, Languages.es);
console.log(globals.get(Keys.lang));  */