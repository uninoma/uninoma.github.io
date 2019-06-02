
export default class MainScene extends Phaser.Scene{


  constructor(){
    super({key:"MainScene"})
    this.red = Phaser.Display.Color.GetColor(255, 0, 0);
    this.blue = Phaser.Display.Color.GetColor(0, 0, 255);
    this.green = Phaser.Display.Color.GetColor(0,255,0)
    
  }
  preload ()
  {

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



  doorsInit(){
    let {red,blue,green} = this
    let colors=this.shuffle([red,blue,green])

    let rectWidth=((this.sys.game.canvas.width)/3)
    let rect = this.add.rectangle(rectWidth/2,40,rectWidth,10,colors[0])
    let rect2 = this.add.rectangle(rect.x+rect.width,40,rectWidth,10,colors[1])
    let rect3 = this.add.rectangle(rect2.x+rect2.width,40,rectWidth,10,colors[2])
       
    for(let r of [rect,rect2,rect3]){
      this.physics.world.enable(r, 0)
      r.body.enable=true
      r.body.moves=true
      r.body.setVelocityY(20)
      r.body.setImmovable()
      this.physics.add.collider(this.circle,r,(circle,rect)=>{
        if(circle.fillColor == rect.fillColor){
          rect.destroy()
        }else{
          
        }
      })
    }
  }

  handler(){
    let self=this
    for(let obj of this.children.list){
      console.log(obj)
      
      if(obj.body)obj.body.setCollideWorldBounds()
        for(let obj2 of this.children.list){
          if(obj != obj2){
            this.physics.add.collider(obj, obj2,function(obj,obj2){
              console.log("collided")
            });
          }
        }
    }
  }

  circleInit(){
    let self = this
    let {red,blue,green} = this
    let radius=30
    let circle= this.add.circle(200,110,radius,green)
    this.circle=circle
    this.physics.world.enable(circle, 0);
        circle.body.enable=true
        circle.body.moves=true
        circle.body.setCollideWorldBounds()
        circle.body.setBounce(0)
        circle.body.setCircle(radius,-15,-15)


    this.input.on('pointermove', function(pointer){
      if(pointer.isDown){
        self.physics.moveTo(circle, pointer.x, pointer.y, 500, 100);
      }
    });
    console.log(circle)
  }

  triangleInit(){
    var triangle = this.add.triangle(50,100,10,50,10,100,100,10,0xff0000,null);
    triangle.setStrokeStyle(2,this.red);
    this.physics.world.enable(triangle,0)    
    triangle.body.setOffset(10,10)
    triangle.body.enable=true
    triangle.body.moves=true
    triangle.body.setImmovable()
    console.log(triangle.body)

    
    this.physics.add.collider(this.circle,triangle,(circle,triangle)=>{
      console.log("triangle collided")
    })


    
  }

  create ()
  {
    console.log(this)
    
    this.circleInit()
    // let cl = setInterval(()=>{
    //   this.doorsInit()
    // },5000)
    // setTimeout(()=>{
    //   clearTimeout(cl)
    // },60000)



    //this.doorsInit()

    this.triangleInit()
    // this.handler()
    


  }

}
