import MainScene from './mainScene.js'
import MatterScene from './matterScene.js'
var config = {
    type: Phaser.AUTO,
    width: 300,
    height: 500,
    physics: {
        default:'matter',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        },
        matter: {
            debug: true,
            gravity: { y: 0}
        },
        impact: {
            gravity: 100,
            debug: true,
            setBounds: {
                x: 100,
                y: 100,
                width: 600,
                height: 300,
                thickness: 32
            },
            maxVelocity: 500
        }
    },
    scene: [MatterScene,MainScene]
};

var game = new Phaser.Game(config);
