export default class MatterScene extends Phaser.Scene{


    constructor(){
      super({key:"MatterScene"})
      this.red = Phaser.Display.Color.GetColor(255, 0, 0);
      this.blue = Phaser.Display.Color.GetColor(0, 0, 255);
      this.green = Phaser.Display.Color.GetColor(0,255,0)
      this.doors=[]
      this.rombs=[]
    }

    preload(){
        this.load.json('shapes','http://'+document.location.host+'/assets/shS_data.json')

        this.load.image('door_blue', 'http://'+document.location.host+'/assets/door_blue.png');
        this.load.image('door_green', 'http://'+document.location.host+'/assets/door_green.png');
        this.load.image('door_red', 'http://'+document.location.host+'/assets/door_red.png');
        this.load.image('door_yellow', 'http://'+document.location.host+'/assets/door_yellow.png');
        this.load.image('romb', 'http://'+document.location.host+'/assets/romb.png');

        this.load.image('ball', 'http://'+document.location.host+'/assets/ball.png');

        
        this.load.image('s', 'http://'+document.location.host+'/assets/shapeS.png');        
        


        // // / Load sprite sheet generated with TexturePacker
        // this.load.atlas('sheet', 'assets/physics/fruit-sprites.png', 'assets/physics/fruit-sprites.json');
    
        // // Load body shapes from JSON file generated using PhysicsEditor
        // this.load.json('shapes', 'assets/physics/fruit-shapes.json');
    }


    circleInit(){
        
        var circle = this.matter.add.image(200, 200, 'ball',null,{shape:'circle'});
            circle.myId='player'
        this.circle=circle
        circle.setBounce(0)
        const velocityToTarget = (from, to, speed = 1) => {
            const direction = Math.atan((to.x - from.x) / (to.y - from.y));
            const speed2 = to.y >= from.y ? speed : -speed;
            return { velX: speed2 * Math.sin(direction), velY: speed2 * Math.cos(direction) };
        };

        
        this.input.on('pointermove', function(pointer){
            let {velX,velY}=velocityToTarget(circle,pointer,3)
            circle.setVelocity(velX,velY)
        },this);
        this.input.on('pointerdown', function(pointer){
            let {velX,velY}=velocityToTarget(circle,pointer,3)
            circle.setVelocity(velX,velY)
        })

    }

    doorsInit(){
        let doors=[]
        let doors_c=this.shuffle(['door_red','door_blue','door_yellow','door_green'])
        for(let key in doors_c){
            // console.log(doors_c[key])
            let x,y=10
            if(key==0){
                x=35
            }
            else if(key>0){
                x=doors[key-1].x+doors[key-1].displayWidth
            }
            doors[key]=this.matter.add.image(x+1,y,doors_c[key],null,{})
            doors[key].displayWidth=((this.sys.game.canvas.width)/4)-1
            doors[key].displayHeight=20
            doors[key].setBounce(1)
            doors[key].firstX=doors[key].x
            doors[key].myId=doors_c[key]
            this.doors.push(doors[key])
        }
    }

    rombInit(){
        var shapes = this.cache.json.get('shapes');
        let romb=this.matter.add.image(150,0,'romb',null,{shape:shapes.romb})
            romb.setBounce(1)
            romb.myId="romb"
            romb.firstX=150
            romb.displayWidth=50
            romb.displayHeight=100
            this.rombs.push(romb)
    }

    shuffle(array) {
        var i = array.length,
            j = 0,
            temp;
        while (i--) {
            j = Math.floor(Math.random() * (i+1));
            // swap randomly chosen element with current element
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
    
        }
        return array;
    } 

    create(){
        let self = this
        this.matter.world.setBounds(0,0,this.sys.canvas.width,this.sys.canvas.height,1,true,true,false,true)

        this.matter.world.on("collisionstart",(e)=>{
            let gameObjectA=e.pairs[0].bodyA.gameObject
            let gameObjectB=e.pairs[0].bodyB.gameObject
                

           if(gameObjectA && gameObjectB){
            // console.log(gameObjectA.myId,gameObjectB.myId)
                if(gameObjectA.myId && gameObjectB.myId){
                    if(gameObjectA.myId=="door_green" && gameObjectB.myId=="player"
                        || gameObjectA.myId=="player" && gameObjectB.myId=="door_green"){
                        gameObjectA.myId!="player"?gameObjectA.destroy():gameObjectB.destroy()
                    }
                }
           }
        })
        this.matter.world.on("collisionend",(e)=>{
            
        })

        this.time.addEvent({delay:4000,repeat:4,callback:this.doorsInit,callbackScope:this})

        

    
        this.circleInit()
        
    }

    update(){
        // console.log(this.scene)
        const doorsHandler=()=>{
            if(this.doors.length>0){
                for(let key in this.doors){
                    let door = this.doors[key]
                    if(door.active){
                        door.setAngle(0)
                        door.setX(door.firstX)
                        door.setVelocityY(1)
                        if(door.y+door.height >= this.sys.game.canvas.height){
                            door.destroy()
                            this.doors.splice(key,1)
                        }
                    }else{
                        this.doors.splice(key,1)
                    }
                }
            }
        }
        doorsHandler()

        const rombHandler=()=>{
            if(this.rombs.length>0){
                for(let key in this.rombs){
                    let romb = this.rombs[key]
                    if(romb.active){
                        romb.setAngle(0)
                        romb.setX(romb.firstX)
                        romb.setVelocityY(1)
                        if(romb.y+romb.displayHeight>=this.sys.canvas.height){
                            romb.destroy()
                            this.rombs.splice(key,1)
                        }
                    }else{
                        this.rombs.splice(key,1)
                    }
                }
            }
        }
        rombHandler()

    }
}