let player;
let floor;
let countCanyons = 1;
let canyons = [];
let cloudX;
let cloudSpeed = 1;
let coin = [];
let enemies = [];
let score = 0;
let coinSound;
let jumpSound;
let mountainX = 366;
let treeX = 793;
let flyingEnemy;
let enemydeath;
let deathSound;
let backMusic;   
let soundSlider;
let musicSlider;
let basefloor = 200;
let countPlatforms = 1;
let platforms = [];
let ruby;
let ruby2;
let diamond;
let checkpoints = [];
let isPaused = false;
let offsetMovingCamera = 100;

function preload() {
    soundFormats('mp3', 'wav');    
    coinSound = loadSound('assets/sound/monetka.wav');
    jumpSound = loadSound('assets/sound/prijok.wav');
    enemydeath = loadSound('assets/sound/enemydeath.mp3');
    deathSound = loadSound('assets/sound/loss.mp3');
    backMusic = loadSound('assets/sound/123.mp3');
}
function setup() {
    createCanvas(1024, 576);
    floor = {
        height: 200,
        color: color(50, 255, 55),
        drawFloor: function() {
            fill(this.color);
            rect(0, height - this.height, width, this.height);
        },
    }

    for(let i = 0; i < countPlatforms; i++) {
        platforms.push({
            x: i * 100 + random(width),
            name: "platform",
            y: 277,
            width: 80 + random(30),
            height: 20,
            color: color(72, 61, 139),
            draw: function() {
                fill(this.color);
                rect(this.x, height - this.height - this.y, this.width, this.height);
            }
        });
    }
    diamond = {
        x: platforms[0].x + platforms[0].width / 2,
        y: height - platforms[0].y - platforms[0].height - 15,
        size: 30,
        collected: false,
        draw: function() {
          if (this.collected == false) {
            fill(0, 255, 255);
            noStroke();
            beginShape();
            vertex(this.x, this.y - this.size / 2);
            vertex(this.x + this.size / 2, this.y);
            vertex(this.x, this.y + this.size / 2);
            vertex(this.x - this.size / 2, this.y);
            endShape();
          }
        }
    }
    ruby = {
        x: width + 300,
        y: height - floor.height - 35 - 15, 
        size: 30,
        collected: false,
        draw: function() {
            if (!this.collected) {
                fill(255, 0, 0);
                noStroke();
                beginShape();
                vertex(this.x, this.y - this.size / 2);
                vertex(this.x + this.size / 2, this.y);
                vertex(this.x, this.y + this.size / 2);
                vertex(this.x - this.size / 2, this.y);
                endShape();
            }
        }
    };
    ruby2 = {
        x: width - 1200,
        y: height - floor.height - 35 - 15, 
        size: 30,
        collected: false,
        draw: function() {
            if (!this.collected) {
                fill(255, 0, 0);
                noStroke();
                beginShape();
                vertex(this.x, this.y - this.size / 2);
                vertex(this.x + this.size / 2, this.y);
                vertex(this.x, this.y + this.size / 2);
                vertex(this.x - this.size / 2, this.y);
                endShape();
            }
        }
    };
    flyingEnemy = {
        x: 450,
        y: 290,
        width: 35,
        height: 35,
        speedX: 3,
        direction: 1,
        isDead: false,
    };
    soundSlider = createSlider(0, 1, 0.1, 0.01);
    soundSlider.position(800, 15); 
    soundSlider.style('transform', 'rotate(360deg)');
    soundSlider.style('transform-origin', 'left top');
    musicSlider = createSlider(0, 1, 0.1, 0.01);
    musicSlider.position(800, 45); 
    musicSlider.style('transform', 'rotate(360deg)');
    musicSlider.style('transform-origin', 'left top');
    backMusic.setVolume(musicSlider.value());
    backMusic.loop(); 
    cloudX = width;
    coin.push({
        x: random(100, width - 100),
        y: random(100, height - 100),
    });

    player = {
        x: 100,
        y: 300,
        width: 65,
        height: 60,
        speedGravity: -7,
        color: color(200, 150, 0),
        grounded: false,
        dead: false,
        speedRun: 5,
        movingLeft: false,
        movingRight: false,
        drawPlayer: function() {
            noStroke();
            fill(this.color);
            rect(this.x, this.y - 35, this.width, this.height);
            fill(255, 224, 189);
            ellipse(this.x + this.width / 2, this.y - 55, 50, 50);
            fill(0);
            ellipse(this.x + this.width / 2 - 8, this.y - 65, 10, 10);
            ellipse(this.x + this.width / 2 + 8, this.y - 65, 10, 10);
            fill(75, 0, 130);
            arc(this.x + this.width / 2, this.y - 49, 25, 25, 0, PI);
            fill(255, 105, 180);
            rect(this.x, this.y + this.height - 35, 20, 35);
            rect(this.x + this.width - 20, this.y + this.height - 35, 20, 35);
            fill(135, 206, 235);
            if (this.movingLeft) {
                rect(this.x - 10, this.y - 33, 10, 45);
            } else {
                rect(this.x - 10, this.y - 33, 10, 20);
            }
            if (this.movingRight) {
                rect(this.x + this.width, this.y - 33, 10, 45);
            } else {
                rect(this.x + this.width, this.y - 33, 10, 20);
            }
        },
        gravity: function(floor) {
            if (this.speedGravity > -5)
                this.speedGravity--;
            if (this.y + this.height < height - floor.height)
                this.y -= this.speedGravity;
            else {
                this.grounded = true;
            }
        },
        jump: function() {
            this.speedGravity = 15;
            this.y -= this.speedGravity;
            this.grounded = false;
            jumpSound.setVolume(soundSlider.value());
            jumpSound.play();
        },
        moveLeft: function() {
            this.x -= this.speedRun;
            this.movingLeft = true;
            this.movingRight = false;
        },
        moveRight: function() {
            this.x += this.speedRun;
            this.movingRight = true;
            this.movingLeft = false;
        },
        movement: function() {
            if (!this.dead) {
                if (this.grounded && keyIsDown(87))
                    this.jump();
                if (keyIsDown(68))
                    this.moveRight();
                if (keyIsDown(65))
                    this.moveLeft();
            }
            if (!keyIsDown(68) && !keyIsDown(65)) {
                this.movingLeft = false;
                this.movingRight = false;
            }
        },
        deadAnimation: function() {
            if (this.dead) {
                if (this.y < height)
                    this.y -= this.speedGravity;
            }
        },
        checkOutside: function() {
            if (this.x < -10)
                this.x = width - this.width + 10;
            if (this.x > width + 10)
                this.x = -10;
        },
        checkCanyon: function() {
            for (let i = 0; i < canyons.length; i++) {
                if (
                    this.x + this.width > canyons[i].x &&
                    this.x < canyons[i].x + canyons[i].width &&
                    this.y + this.height >= height - floor.height
                ) {
                    if (!this.dead) {
                        this.grounded = false;
                        this.dead = true;
                        score -= 70;
                        deathSound.setVolume(soundSlider.value());
                        deathSound.play();
                    }
                    this.deadAnimation();
                }
            }
        },

        checkEnemies: function() {
            for (let i = 0; i < enemies.length; i++) {
                if (!enemies[i].isDead &&
                    this.x < enemies[i].x + enemies[i].width &&
                    this.x + this.width > enemies[i].x &&
                    this.y + this.height > enemies[i].y &&
                    this.y < enemies[i].y + enemies[i].height
                ) {
                    if (!this.grounded) {
                        this.speedGravity = 15;
                        enemies[i].isDead = true;
                        score += 10;
                        enemydeath.setVolume(soundSlider.value());
                        enemydeath.play();
                        if (i == 0) {
                            enemies[i].x = random(450, 625);
                        } else {
                            enemies[i].x = random(675, 950);
                        }
                        enemies[i].isDead = false;
                    } else if (!this.dead) {
                        this.dead = true;
                        deathSound.setVolume(soundSlider.value());
                        deathSound.play();
                        score -= 50;
                    }
                } 
            }
            if (!flyingEnemy.isDead &&
                this.x < flyingEnemy.x + flyingEnemy.width &&
                this.x + this.width > flyingEnemy.x &&
                this.y + this.height > flyingEnemy.y &&
                this.y < flyingEnemy.y + flyingEnemy.height) {
                if (!this.grounded && this.y + this.height < flyingEnemy.y + flyingEnemy.height / 2) {
                    this.speedGravity = 15;
                    score += 100;
                    enemydeath.setVolume(soundSlider.value());
                    enemydeath.play();
                    flyingEnemy.isDead = true;
                } 
                else if (!this.dead) {
                    this.dead = true;
                    deathSound.setVolume(soundSlider.value());
                    deathSound.play();
                    score -= 50;
                }
            }
        },
        checkPlatform: function () {
            this.grounded = false;
            for (let i = 0; i < platforms.length; i++) {
                if (
                    this.y + this.height >= platforms[i].y - 5 &&
                    this.y + this.height <= platforms[i].y + 10 && 
                    this.x + this.width > platforms[i].x &&
                    this.x < platforms[i].x + platforms[i].width
                ) {
                    this.y = platforms[i].y - this.height;
                    this.speedGravity = 0;
                    this.grounded = true;
                }
            }

            if (!this.grounded && this.y + this.height >= height - floor.height) {
                this.y = height - floor.height - this.height;
                this.speedGravity = 0;
                this.grounded = true;
            }
        }
    }
    canyons.push({
        x: 250,
        y: height - floor.height,
        width: 100,
        height: floor.height,
        drawCanyon: function() {
            fill(77, 34, 14);
            rect(this.x + 150, this.y - 60, 5, 70); 
            fill(207, 16, 32);
            rect(this.x, this.y, this.width, this.height);
            fill(255, 255, 255); 
            rect(this.x + 125, this.y - 60, 60, 40, 5); 
            fill(200, 0, 0);
            textSize(20);
            text("lava", this.x + 136, this.y - 35);
        }
    });
    for (let i = 0; i < 5; i++) {
        canyons.push({
            x: width + i * 400,
            y: height - floor.height,
            width: 100,
            height: floor.height,
            drawCanyon: function() {
                fill(77, 34, 14);
                rect(this.x + 150, this.y - 60, 5, 70); 
                fill(207, 16, 32);
                rect(this.x, this.y, this.width, this.height);
                fill(255, 255, 255); 
                rect(this.x + 125, this.y - 60, 60, 40, 5); 
                fill(200, 0, 0);
                textSize(20);
                text("lava", this.x + 136, this.y - 35);
            }
        });
    }
    for (let i = 1; i <= 5; i++) {
        canyons.push({
            x: -i * 400,
            y: height - floor.height,
            width: 100,
            height: floor.height,
            drawCanyon: function() {
                fill(77, 34, 14);
                rect(this.x + 150, this.y - 60, 5, 70); 
                fill(207, 16, 32);
                rect(this.x, this.y, this.width, this.height);
                fill(255, 255, 255); 
                rect(this.x + 125, this.y - 60, 60, 40, 5); 
                fill(200, 0, 0);
                textSize(20);
                text("lava", this.x + 136, this.y - 35);
            }
        });
    }
    enemies.push({
        x: 500,
        y: height - floor.height - 45,
        width: 50,
        height: 50,
        color: color(255, 105, 180),
        isDead: false,
        draw: function() {
            if (!this.isDead) {
                fill(this.color);
                rect(this.x, this.y, this.width, this.height);
            }
        }
    });
    enemies.push({
        x: 700,
        y: height - floor.height - 45,
        width: 50,
        height: 50,
        color: color(32, 178, 170),
        isDead: false,
        draw: function() {
            if (!this.isDead) {
                fill(this.color);
                rect(this.x, this.y, this.width, this.height);
            }
        }
    });
    }



function movingCamera(direction)
{
    for(let i = 0; i < canyons.length; i++)
    {
        if (!direction)
            canyons[i].x += player.speedRun;
        else
            canyons[i].x -= player.speedRun;
    }

    for(let i = 0; i < platforms.length; i++)
    {
        if (!direction)
            platforms[i].x += player.speedRun;
        else
            platforms[i].x -= player.speedRun;
    }

    for(let i = 0; i < enemies.length; i++)
    {
        if (!direction)
            enemies[i].x += player.speedRun;
        else
            enemies[i].x -= player.speedRun;
    }
    if (!direction)
        player.x += player.speedRun;
    else
        player.x -= player.speedRun;
    if (!direction) {
        mountainX += player.speedRun;
        treeX += player.speedRun;
        diamond.x += player.speedRun;
        ruby.x += player.speedRun;
        coin[0].x += player.speedRun;
        ruby2.x += player.speedRun;
        flyingEnemy.x += player.speedRun;
        cloudX += player.speedRun;
    } else {
        mountainX -= player.speedRun;
        treeX -= player.speedRun;
        diamond.x -= player.speedRun;
        ruby.x -= player.speedRun;
        coin[0].x -= player.speedRun
        ruby2.x -= player.speedRun;
        flyingEnemy.x -= player.speedRun;
        cloudX -= player.speedRun;
    }
}

function keyPressed() {
    if (keyCode == ESCAPE) {
      isPaused = !isPaused;
    }
  }

function draw() {
    backMusic.setVolume(musicSlider.value());
    if (player.dead) {
        background(128, 128, 128); 
    } 
    else {
        background(100, 155, 255); 
    }

    if (isPaused) {
        drawPauseScreen();
        return;
      }

      function drawPauseScreen() {
        fill(50);
        noStroke();
        rect(0, 0, width, height);
        fill(255);
        textSize(64);
        text("PAUSED", width / 3, height / 2);
      }

    if (diamond.collected == false) {
        if (
          player.x + player.width > diamond.x - diamond.size / 2 &&
          player.x < diamond.x + diamond.size / 2 &&
          player.y - 35 + player.height + 15 > diamond.y - diamond.size / 2 &&
          player.y - 35 < diamond.y + 15 + diamond.size / 2
        ) {
          diamond.collected = true;
          score += 10;
          coinSound.setVolume(soundSlider.value());
          coinSound.play();
        }
      }

      if (ruby.collected == false) {
        if (
            player.x + player.width > ruby.x - ruby.size / 2 &&
            player.x < ruby.x + ruby.size / 2 &&
            player.y - 35 + player.height + 15 > ruby.y - ruby.size / 2 &&
            player.y - 35 < ruby.y + 15 + ruby.size / 2
        ) {
            ruby.collected = true;
            score += 111; 
            coinSound.setVolume(soundSlider.value());
            coinSound.play();
        }
    }
    if (ruby2.collected == false) {
        if (
            player.x + player.width > ruby2.x - ruby2.size / 2 &&
            player.x < ruby2.x + ruby2.size / 2 &&
            player.y - 35 + player.height + 15 > ruby2.y - ruby2.size / 2 &&
            player.y - 35 < ruby2.y + 15 + ruby2.size / 2
        ) {
            ruby2.collected = true;
            score += 111; 
            coinSound.setVolume(soundSlider.value());
            coinSound.play();
        }
    }
    
    floor.drawFloor();
    for (let i = 0; i < canyons.length; i++)
        canyons[i].drawCanyon();
    if (player.x > width - 2 * offsetMovingCamera)
        movingCamera(true);
    else if (player.x < offsetMovingCamera)
        movingCamera(false);
    for (let i = 0; i < canyons.length; i++)
        canyons[i].drawCanyon();
    for (let i = 0; i < platforms.length; i++)
        platforms[i].draw();
    for (let i = 0; i < enemies.length; i++)
        enemies[i].draw();

    noStroke();
    fill(192, 192, 192);
    triangle(mountainX + 100, 377, mountainX + 134, 135, mountainX + 300, 377);

    noStroke();
    fill(121, 82, 61);
    rect(treeX, 218, 35, 158);
    fill(137, 172, 118);
    ellipse(treeX - 3, 275, 55, 55);
    ellipse(treeX - 3, 275, 66, 66);
    ellipse(treeX + 12, 270, 66, 66);
    ellipse(treeX + 17, 280, 66, 66);
    ellipse(treeX + 27, 250, 55, 55);
    ellipse(treeX - 3, 240, 55, 55);
    ellipse(treeX + 57, 275, 55, 55);
    ellipse(treeX + 57, 290, 55, 55);
    ellipse(treeX + 57, 270, 55, 70);
    ellipse(treeX + 57, 255, 55, 55);
    ellipse(treeX + 32, 222, 55, 55);

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }

    if (cloudX < -100) {
        cloudX = width;
    }
    if (!flyingEnemy.isDead) {
        flyingEnemy.x += flyingEnemy.speedX * flyingEnemy.direction;
        if (flyingEnemy.x > 900) {
            flyingEnemy.direction = -1;
        }
        if (flyingEnemy.x < 450) {
            flyingEnemy.direction = 1;
        }
    }
    cloudX -= cloudSpeed;
    drawCloud(cloudX);
    function drawCloud(cloudX) {
        fill(255);
        noStroke();
        ellipse(cloudX + 20, 111, 100, 60);
        ellipse(cloudX + 60, 111 - 20, 80, 50);
        ellipse(cloudX + 80, 111 + 10, 90, 60);
    }
    
    for(let i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }

    player.drawPlayer();
    player.checkPlatform();
    player.checkCanyon();
    player.checkEnemies();
    player.checkOutside();
    player.gravity(floor);
    diamond.draw();
    ruby.draw();
    ruby2.draw();
    player.movement();
    if (!flyingEnemy.isDead) {
    fill(255, 65, 69);
    ellipse(flyingEnemy.x + flyingEnemy.width, flyingEnemy.y + flyingEnemy.height, flyingEnemy.width, flyingEnemy.height);
    }
    stroke(0);
    strokeWeight(1);
    fill(255, 215, 0);
    ellipse(coin[0].x, coin[0].y, 33, 33);
    let d = dist(mouseX, mouseY, coin[0].x, coin[0].y);
    if (d < 20 && mouseIsPressed) {
        coin[0] = {
            x: random(100, width - 100),
            y: random(100, height - 100)
        };
        score += 3;
        coinSound.setVolume(soundSlider.value());
        coinSound.play();
    }
    fill(255, 255, 200);
    textSize(32);
    text(`Score: ${score}`, 10, 30);
    fill(255);
    textSize(15);
    text("Music", 750, 60);
    text("Effects", 750, 30); 
    if (player.dead) {
        stroke(1);
        fill(255, 0, 0);
        textSize(77);
        text("YOU DIE", width / 3, height / 2);
        fill(255, 255, 230);
        text("Press R to restart", width / 4, height / 1.55);
        fill(255, 255, 255);
        text("R", width / 2.16, height / 1.55);
        if (keyIsDown(82)) {
            player.x = 100;
            player.y = 300;
            player.dead = false;
        }
    }   
}