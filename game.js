// ========================================
// ARENA LEGENDS - PHASER 3
// ========================================

const HEROES = [

{
    name:"ASTRA",
    color:0x55d8d1,
    hp:110,
    damage:18,
    speed:190,
    range:65,
    weapon:"sword",
    desc:"Une épéiste agile capable de contrôler le combat."
},

{
    name:"BRAM",
    color:0xe58b55,
    hp:155,
    damage:23,
    speed:145,
    range:75,
    weapon:"hammer",
    desc:"Un guerrier massif qui écrase ses adversaires."
},

{
    name:"NYX",
    color:0xa98bea,
    hp:85,
    damage:17,
    speed:235,
    range:55,
    weapon:"dagger",
    desc:"Une assassine rapide et mortelle."
},

{
    name:"KAIRO",
    color:0xe9d36b,
    hp:110,
    damage:22,
    speed:190,
    range:65,
    weapon:"sword",
    desc:"Un combattant maîtrisant les éclairs."
},

{
    name:"MIRA",
    color:0x64a9eb,
    hp:115,
    damage:18,
    speed:180,
    range:105,
    weapon:"spear",
    desc:"Une guerrière capable de frapper à distance."
},

{
    name:"ROOK",
    color:0x9ac47d,
    hp:120,
    damage:21,
    speed:185,
    range:65,
    weapon:"axe",
    desc:"Un chasseur sauvage et puissant."
},

{
    name:"SOL",
    color:0xf2bd62,
    hp:100,
    damage:19,
    speed:175,
    range:115,
    weapon:"staff",
    desc:"Un mage qui manipule les flammes."
},

{
    name:"VESPER",
    color:0xe58bb8,
    hp:100,
    damage:19,
    speed:220,
    range:65,
    weapon:"scythe",
    desc:"Une combattante mystérieuse et imprévisible."
}

];

let selectedHero = 0;
let phaserGame = null;
let gameScene = null;

const characterList = document.getElementById("characters");


// ========================================
// CRÉATION DES PERSONNAGES SVG
// ========================================

function heroSVG(hero) {

const color = "#" + hero.color.toString(16).padStart(6,"0");

const weapons = {

sword:`
<path d="M87 69 L117 19 L122 24 L99 78Z" fill="#dce8f7" stroke="#26334b" stroke-width="3"/>
<path d="M91 72 L105 80 L97 88 L84 79Z" fill="#b37a4c"/>
`,

hammer:`
<path d="M96 74 L110 24" stroke="#7b563c" stroke-width="8"/>
<rect x="91" y="12" width="37" height="22" rx="5" fill="#9e9eaa" stroke="#30394e" stroke-width="4"/>
`,

dagger:`
<path d="M92 70 L119 30 L121 39 L101 80Z" fill="#d7e3ef" stroke="#28334b" stroke-width="3"/>
`,

spear:`
<path d="M104 91 L115 12" stroke="#a8794b" stroke-width="6"/>
<path d="M115 12 L104 27 L126 24Z" fill="#e1e9f3"/>
`,

axe:`
<path d="M96 82 L114 23" stroke="#906b48" stroke-width="7"/>
<path d="M112 25 Q140 4 139 37 Q124 51 112 35Z" fill="#c5cbd5" stroke="#28334b" stroke-width="3"/>
`,

staff:`
<path d="M105 88 L115 18" stroke="#936b46" stroke-width="7"/>
<circle cx="116" cy="15" r="12" fill="#f6a54e" stroke="#fff1a7" stroke-width="4"/>
`,

scythe:`
<path d="M100 87 L116 30" stroke="#9b704e" stroke-width="6"/>
<path d="M116 30 Q150 2 139 48 Q126 33 116 44Z" fill="#e6e8f2" stroke="#27344b" stroke-width="3"/>
`

};

return `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="180" viewBox="0 0 160 180">

<defs>
<linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="${color}"/>
<stop offset="100%" stop-color="#202a42"/>
</linearGradient>

<filter id="shadow">
<feGaussianBlur stdDeviation="3"/>
</filter>
</defs>

<ellipse cx="80" cy="160" rx="39" ry="9" fill="#10131e" opacity=".5" filter="url(#shadow)"/>

<!-- Jambes -->

<path d="M55 112 L48 145 L65 151 L77 119Z" fill="#343c50" stroke="#151d2e" stroke-width="4"/>
<path d="M91 115 L100 145 L116 143 L111 109Z" fill="#343c50" stroke="#151d2e" stroke-width="4"/>

<!-- Bottes -->

<path d="M46 141 L68 141 L72 154 L42 154Z" fill="#74513e"/>
<path d="M97 140 L116 139 L124 153 L97 153Z" fill="#74513e"/>

<!-- Cape -->

<path d="M52 72 Q25 101 42 139 L80 126 L109 141 Q133 99 104 72Z"
fill="${color}" stroke="#202a40" stroke-width="4"/>

<!-- Corps -->

<path d="M48 76 Q80 57 111 76 L109 121 Q80 139 51 120Z"
fill="url(#body)" stroke="#202a40" stroke-width="5"/>

<!-- Ceinture -->

<path d="M51 111 Q80 119 109 110 L109 120 Q80 133 51 122Z" fill="#b48b55"/>

<!-- Bras -->

<path d="M51 79 L29 108 L39 117 L64 91Z"
fill="${color}" stroke="#202a40" stroke-width="5"/>

<path d="M105 79 L130 101 L119 113 L96 91Z"
fill="${color}" stroke="#202a40" stroke-width="5"/>

<!-- Tête -->

<circle cx="80" cy="49" r="31" fill="#f0c7a1" stroke="#26334b" stroke-width="5"/>

<!-- Cheveux -->

<path d="M49 48 Q40 5 81 10 Q120 5 111 49 L100 35 L91 43 L80 30 L67 45 L56 37Z"
fill="${color}" stroke="#202a40" stroke-width="5"/>

<!-- Yeux -->

<ellipse cx="68" cy="53" rx="4" ry="5" fill="#242c3d"/>
<ellipse cx="91" cy="53" rx="4" ry="5" fill="#242c3d"/>

<!-- Bouche -->

<path d="M72 66 Q80 72 89 66" fill="none" stroke="#a45e5c" stroke-width="3" stroke-linecap="round"/>

<!-- Arme -->

${weapons[hero.weapon]}

<!-- Détails -->

<circle cx="80" cy="91" r="9" fill="#e8c26f" stroke="#28334b" stroke-width="3"/>

</svg>
`;
}


// ========================================
// SÉLECTION DES PERSONNAGES
// ========================================

function updateLobby() {

characterList.innerHTML = "";

HEROES.forEach((hero,index)=>{

const card = document.createElement("div");

card.className = "character-card";

if(index===selectedHero) card.classList.add("selected");

const image = "data:image/svg+xml;charset=UTF-8," +
encodeURIComponent(heroSVG(hero));

card.innerHTML = `
<img src="${image}">
<span>${hero.name}</span>
`;

card.onclick = ()=>{

selectedHero=index;
updateLobby();

};

characterList.appendChild(card);

});

const hero = HEROES[selectedHero];

document.getElementById("hero-name").textContent=hero.name;

document.getElementById("hero-desc").textContent=hero.desc;

document.getElementById("hero-preview").innerHTML=
`<img src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(heroSVG(hero))}">`;

document.getElementById("hp-stat").style.width=
(hero.hp/160*100)+"%";

document.getElementById("damage-stat").style.width=
(hero.damage/25*100)+"%";

document.getElementById("speed-stat").style.width=
(hero.speed/250*100)+"%";

}

updateLobby();


// ========================================
// SCÈNE DU JEU
// ========================================

class ArenaScene extends Phaser.Scene {

constructor(){
super("Arena");
}

preload(){

HEROES.forEach((hero,index)=>{

this.load.svg(
"hero"+index,
"data:image/svg+xml;charset=UTF-8,"+
encodeURIComponent(heroSVG(hero)),
{width:160,height:180}
);

});

}

create(){

gameScene=this;

this.physics.world.setBounds(0,0,1200,800);

this.drawArena();

this.fighters=[];

this.particles=this.add.particles(0,0,"white",{
speed:{min:20,max:150},
scale:{start:.5,end:0},
lifespan:350,
quantity:0
});

this.createObstacles();

this.zone=this.add.circle(
600,400,350,
0x4c8bdc,.08
);

this.zone.setStrokeStyle(4,0xf4cb77,.9);

this.physics.add.existing(this.zone,false);

this.zone.body.setCircle(350);
this.zone.body.setAllowGravity(false);
this.zone.body.moves=false;

this.zoneRadius=350;

this.player=this.createFighter(
selectedHero,
600,
400,
true
);

for(let i=0;i<7;i++){

let index=(selectedHero+i+1)%8;

let angle=i/7*Math.PI*2;

let x=600+Math.cos(angle)*260;
let y=400+Math.sin(angle)*260;

this.createFighter(index,x,y,false);

}

this.keys=this.input.keyboard.addKeys(
'W,A,S,D,Z,Q,UP,DOWN,LEFT,RIGHT,SPACE,SHIFT'
);

this.timeLeft=300;
this.elapsed=0;

this.lastAttack=0;
this.lastDash=0;

this.spawnCrates();

this.input.keyboard.on("keydown-SPACE",()=>{
this.attack(this.player);
});

this.input.keyboard.on("keydown-SHIFT",()=>{
this.dash(this.player);
});

}


// ========================================
// DÉCOR
// ========================================

drawArena(){

const graphics=this.add.graphics();

graphics.fillGradientStyle(
0x526d54,
0x526d54,
0x354c3c,
0x354c3c,
1
);

graphics.fillRect(0,0,1200,800);

graphics.lineStyle(2,0xffffff,.035);

for(let x=0;x<1200;x+=55){
graphics.lineBetween(x,0,x,800);
}

for(let y=0;y<800;y+=55){
graphics.lineBetween(0,y,1200,y);
}

// Décor végétal

for(let i=0;i<65;i++){

let x=30+Math.random()*1140;
let y=30+Math.random()*740;

let color=Math.random()>.5?0x294936:0x365c3b;

graphics.fillStyle(color,1);

graphics.fillCircle(x,y,12+Math.random()*10);

graphics.fillStyle(0x668650,.5);

graphics.fillCircle(x-4,y-5,5);

}

graphics.lineStyle(12,0x273a31,1);
graphics.strokeRect(12,12,1176,776);

}


// ========================================
// OBSTACLES
// ========================================

createObstacles(){

this.obstacles=this.physics.add.staticGroup();

for(let i=0;i<17;i++){

let x=100+Math.random()*1000;
let y=100+Math.random()*600;

if(Phaser.Math.Distance.Between(x,y,600,400)<110)continue;

let rock=this.add.container(x,y);

let shadow=this.add.ellipse(3,8,54,27,0x10131e,.4);

let stone=this.add.ellipse(
0,0,47,38,0x737d7b,1
);

stone.setStrokeStyle(4,0x39454b);

rock.add([shadow,stone]);

this.physics.add.existing(rock,true);

rock.body.setSize(40,30);

this.obstacles.add(rock);

}

}


// ========================================
// CRÉATION DES COMBATTANTS
// ========================================

createFighter(index,x,y,human){

let hero=HEROES[index];

let sprite=this.physics.add.sprite(
x,y,"hero"+index
);

sprite.setScale(.65);

sprite.setDepth(y);

sprite.body.setSize(80,130);

sprite.body.setOffset(40,35);

sprite.setCollideWorldBounds(true);

sprite.setBounce(.1);

let fighter={

sprite,
hero,
index,
human,

hp:hero.hp,
maxHp:hero.hp,

damage:hero.damage,
speed:hero.speed,

alive:true,

level:1,
kills:0,

attackCooldown:0,
dashCooldown:0,
invulnerable:0,

target:null,
brainTimer:0

};

sprite.fighter=fighter;

this.physics.add.collider(
sprite,
this.obstacles
);

this.fighters.push(fighter);

return fighter;

}


// ========================================
// CAISSES
// ========================================

spawnCrates(){

this.crates=this.physics.add.staticGroup();

for(let i=0;i<8;i++){

let x=100+Math.random()*1000;
let y=100+Math.random()*600;

let box=this.add.container(x,y);

let wood=this.add.rectangle(
0,0,34,34,0xb77a42
);

wood.setStrokeStyle(4,0x633f2b);

let cross=this.add.rectangle(
0,0,8,40,0xf2ca78
);

box.add([wood,cross]);

box.setSize(40,40);

this.physics.add.existing(box,true);

box.opened=false;

this.crates.add(box);

}

this.physics.add.overlap(
this.player.sprite,
this.crates,
(player,crate)=>{

if(crate.opened)return;

crate.opened=true;

crate.destroy();

let f=player.fighter;

f.maxHp+=20;
f.hp=Math.min(f.maxHp,f.hp+35);
f.damage+=3;

this.showText(
f.sprite.x,
f.sprite.y-70,
"+ AMÉLIORATION",
"#f4cb77"
);

},
null,
this
);

}


// ========================================
// ATTAQUES
// ========================================

attack(f){

if(!f || !f.alive)return;

if(f.attackCooldown>0)return;

f.attackCooldown=.65;

let s=f.sprite;

let range=f.hero.range;

let angle=s.rotation;

let target=null;
let closest=range;

for(let enemy of this.fighters){

if(enemy===f || !enemy.alive)continue;

let distance=Phaser.Math.Distance.Between(
s.x,s.y,
enemy.sprite.x,enemy.sprite.y
);

if(distance<closest){

closest=distance;
target=enemy;

}

}

s.setTint(0xffffff);

this.time.delayedCall(120,()=>{
if(s.active)s.clearTint();
});

if(target){

let e=target.sprite;

let dx=e.x-s.x;
let dy=e.y-s.y;

let direction=Math.atan2(dy,dx);

let force=360;

target.hp-=f.damage;

e.setVelocity(
Math.cos(direction)*force,
Math.sin(direction)*force
);

target.invulnerable=.18;

this.hitEffect(e.x,e.y);

if(target.hp<=0){

this.eliminate(target,f);

}

}else{

this.hitEffect(
s.x+Math.cos(angle)*50,
s.y+Math.sin(angle)*50
);

}

}


// ========================================
// EFFETS
// ========================================

hitEffect(x,y){

let effect=this.add.circle(
x,y,12,
0xffd47b,.8
);

this.tweens.add({

targets:effect,
scale:4,
alpha:0,
duration:280,
onComplete:()=>effect.destroy()

});

}

showText(x,y,text,color){

let label=this.add.text(x,y,text,{
fontFamily:"Arial",
fontSize:"16px",
fontStyle:"bold",
color,
stroke:"#172033",
strokeThickness:4
});

label.setOrigin(.5);

this.tweens.add({

targets:label,
y:y-40,
alpha:0,
duration:900,
onComplete:()=>label.destroy()

});

}


// ========================================
// ESQUIVE
// ========================================

dash(f){

if(!f || !f.alive)return;

if(f.dashCooldown>0)return;

let s=f.sprite;

let velocity=s.body.velocity;

let direction=new Phaser.Math.Vector2(
velocity.x,
velocity.y
);

if(direction.length()<10){

direction.set(1,0);

}

direction.normalize();

s.setVelocity(
direction.x*600,
direction.y*600
);

f.dashCooldown=2.5;
f.invulnerable=.35;

s.setAlpha(.55);

this.time.delayedCall(350,()=>{

if(s.active)s.setAlpha(1);

});

}


// ========================================
// ÉLIMINATION
// ========================================

eliminate(target,killer){

if(!target.alive)return;

target.alive=false;

target.sprite.disableBody(true,true);

if(killer){

killer.kills++;
killer.level++;

killer.damage+=2;

killer.hp=Math.min(
killer.maxHp,
killer.hp+20
);

this.showText(
killer.sprite.x,
killer.sprite.y-50,
"ELIMINATION + PUISSANCE",
"#ffce74"
);

}

}


// ========================================
// IA DES BOTS
// ========================================

updateBots(dt){

for(let bot of this.fighters){

if(bot.human || !bot.alive)continue;

let s=bot.sprite;

bot.brainTimer-=dt;

if(bot.brainTimer<=0){

bot.brainTimer=.35+Math.random()*.4;

let enemies=this.fighters.filter(f=>
f!==bot && f.alive
);

bot.target=enemies.sort((a,b)=>

Phaser.Math.Distance.Between(
s.x,s.y,a.sprite.x,a.sprite.y
)-
Phaser.Math.Distance.Between(
s.x,s.y,b.sprite.x,b.sprite.y
)

)[0];

}

let target=bot.target;

if(!target || !target.alive)continue;

let t=target.sprite;

let angle=Phaser.Math.Angle.Between(
s.x,s.y,t.x,t.y
);

let distance=Phaser.Math.Distance.Between(
s.x,s.y,t.x,t.y
);

if(distance>bot.hero.range*.75){

s.setVelocity(
Math.cos(angle)*bot.speed,
Math.sin(angle)*bot.speed
);

}else{

s.setVelocity(
Math.cos(angle+1.5)*bot.speed*.35,
Math.sin(angle+1.5)*bot.speed*.35
);

}

s.rotation=angle;

if(distance<bot.hero.range+10){

if(bot.attackCooldown<=0){

this.attack(bot);

}

}

}

}


// ========================================
// JOUEUR
// ========================================

updatePlayer(dt){

let f=this.player;
let s=f.sprite;

let x=0;
let y=0;

if(this.keys.W.isDown || this.keys.Z.isDown || this.keys.UP.isDown)y--;
if(this.keys.S.isDown || this.keys.DOWN.isDown)y++;
if(this.keys.A.isDown || this.keys.Q.isDown || this.keys.LEFT.isDown)x--;
if(this.keys.D.isDown || this.keys.RIGHT.isDown)x++;

let direction=new Phaser.Math.Vector2(x,y);

if(direction.length()>0){

direction.normalize();

s.setVelocity(
direction.x*f.speed,
direction.y*f.speed
);

s.rotation=Math.atan2(direction.y,direction.x);

}else{

s.setVelocity(
s.body.velocity.x*.88,
s.body.velocity.y*.88
);

}

}


// ========================================
// ZONE
// ========================================

updateZone(dt){

this.elapsed+=dt;

this.timeLeft-=dt;

let radius=Math.max(
65,
350-Math.max(0,this.elapsed-15)*.65
);

this.zone.setRadius(radius);

this.zone.body.setCircle(radius);

this.zoneRadius=radius;

for(let f of this.fighters){

if(!f.alive)continue;

let s=f.sprite;

let distance=Phaser.Math.Distance.Between(
s.x,s.y,600,400
);

if(distance>radius){

f.hp-=12*dt;

}

if(f.hp<=0){

this.eliminate(f,null);

}

}

}


// ========================================
// INTERFACE
// ========================================

updateHUD(){

let f=this.player;

document.getElementById("hud-name").textContent=
f.hero.name+"  •  NIVEAU "+f.level;

let percent=Math.max(0,f.hp/f.maxHp*100);

document.getElementById("hud-health").style.width=
percent+"%";

document.getElementById("hud-health-text").textContent=
Math.ceil(Math.max(0,f.hp))+" / "+f.maxHp+" PV";

let alive=this.fighters.filter(f=>f.alive).length;

document.getElementById("alive-count").textContent=alive;

let minutes=Math.floor(this.timeLeft/60);
let seconds=Math.floor(this.timeLeft%60);

document.getElementById("game-timer").textContent=
String(minutes).padStart(2,"0")+":"+
String(seconds).padStart(2,"0");

}


// ========================================
// FIN DE PARTIE
// ========================================

finish(win){

if(this.finished)return;

this.finished=true;

document.getElementById("game-result").classList.remove("hidden");

document.getElementById("result-icon").textContent=
win?"🏆":"💀";

document.getElementById("result-title").textContent=
win?"VICTOIRE !":"ÉLIMINÉ !";

document.getElementById("result-description").textContent=
"Éliminations : "+this.player.kills+
" | Niveau : "+this.player.level;

}


// ========================================
// BOUCLE PRINCIPALE
// ========================================

update(time,delta){

if(this.finished)return;

let dt=Math.min(delta/1000,.04);

for(let f of this.fighters){

if(!f.alive)continue;

f.attackCooldown=Math.max(0,f.attackCooldown-dt);
f.dashCooldown=Math.max(0,f.dashCooldown-dt);
f.invulnerable=Math.max(0,f.invulnerable-dt);

}

this.updatePlayer(dt);

this.updateBots(dt);

this.updateZone(dt);

this.updateHUD();

let alive=this.fighters.filter(f=>f.alive).length;

if(!this.player.alive){

this.finish(false);

}else if(alive<=1 || this.timeLeft<=0){

this.finish(true);

}

}

}


// ========================================
// LANCEMENT
// ========================================

function startGame(){

document.getElementById("lobby").classList.add("hidden");

document.getElementById("game-screen").classList.remove("hidden");

document.getElementById("game-result").classList.add("hidden");

document.getElementById("hud-health").style.width="100%";

document.getElementById("hud-name").textContent=
HEROES[selectedHero].name;

if(phaserGame){

phaserGame.destroy(true);

phaserGame=null;

}

const config={

type:Phaser.AUTO,

parent:"game",

width:1200,
height:800,

backgroundColor:"#526d54",

physics:{

default:"arcade",

arcade:{
debug:false
}

},

scale:{
mode:Phaser.Scale.FIT,
autoCenter:Phaser.Scale.CENTER_BOTH
},

scene:[ArenaScene]

};

phaserGame=new Phaser.Game(config);

}

function returnLobby(){

if(phaserGame){

phaserGame.destroy(true);
phaserGame=null;

}

gameScene=null;

document.getElementById("game-screen").classList.add("hidden");

document.getElementById("lobby").classList.remove("hidden");

}

document.getElementById("play-button").onclick=startGame;

document.getElementById("again-button").onclick=startGame;

document.getElementById("lobby-button").onclick=returnLobby;

document.getElementById("exit-button").onclick=returnLobby;
