const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

const characters = [
    {name:"ASTRA", icon:"⚔️", color:"#69d9d2", hp:105, damage:18, speed:220, range:58, desc:"Duelliste rapide et précise."},
    {name:"BRAM", icon:"🛡️", color:"#e58b55", hp:145, damage:23, speed:170, range:62, desc:"Tank très résistant."},
    {name:"NYX", icon:"🌙", color:"#a78be8", hp:90, damage:16, speed:250, range:55, desc:"Assassin extrêmement rapide."},
    {name:"KAIRO", icon:"⚡", color:"#e9d36b", hp:110, damage:20, speed:205, range:60, desc:"Combattant équilibré."},
    {name:"MIRA", icon:"🔱", color:"#66a9e8", hp:115, damage:17, speed:195, range:76, desc:"Combattante à longue portée."},
    {name:"ROOK", icon:"🐺", color:"#9dc47c", hp:100, damage:21, speed:215, range:57, desc:"Chasseur agressif."},
    {name:"SOL", icon:"☀️", color:"#efb75f", hp:100, damage:19, speed:190, range:90, desc:"Mage solaire."},
    {name:"VESPER", icon:"🌀", color:"#e58bb8", hp:95, damage:18, speed:230, range:65, desc:"Combattante imprévisible."}
];

let selected = 0;
let game = null;
let animation = 0;
const keys = {};

const list = document.getElementById("character-list");
const info = document.getElementById("character-info");

function renderCharacters() {
    list.innerHTML = "";

    characters.forEach((c, i) => {
        const button = document.createElement("button");
        button.className = "character" + (selected === i ? " selected" : "");

        button.innerHTML = `
            <span class="icon">${c.icon}</span>
            <strong>${c.name}</strong>
        `;

        button.onclick = () => {
            selected = i;
            renderCharacters();
        };

        list.appendChild(button);
    });

    const c = characters[selected];

    info.innerHTML = `
        <h3>${c.icon} ${c.name}</h3>
        ${c.desc}<br><br>
        PV : ${c.hp} |
        DÉGÂTS : ${c.damage} |
        VITESSE : ${c.speed}
    `;
}

renderCharacters();

window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;

    if (e.code === "Space") {
        e.preventDefault();
        if (game) attack(game.player);
    }

    if (e.key === "Shift" && game) {
        dash(game.player);
    }
});

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

function createFighter(data, x, y, human = false) {
    return {
        name: data.name,
        icon: data.icon,
        color: data.color,
        x, y,
        hp: data.hp,
        maxHp: data.hp,
        damage: data.damage,
        speed: data.speed,
        range: data.range,
        human,
        alive: true,
        vx: 0,
        vy: 0,
        cooldown: 0,
        dashCooldown: 0,
        invulnerable: 0,
        kills: 0,
        level: 1,
        direction: {x:1,y:0},
        brain: Math.random()
    };
}

function startGame() {
    document.getElementById("lobby").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    document.getElementById("end-screen").classList.add("hidden");

    const player = createFighter(
        characters[selected],
        W/2,
        H/2,
        true
    );

    const bots = characters
        .filter((c,i) => i !== selected)
        .map((c,i) => createFighter(
            c,
            100 + (i*137)%800,
            100 + (i*83)%450
        ));

    game = {
        player,
        fighters: [player,...bots],
        time: 300,
        elapsed: 0,
        zone: {
            x: W/2,
            y: H/2,
            radius: 290,
            minRadius: 65
        },
        particles: [],
        ended: false
    };

    document.getElementById("player-name").textContent = player.name;

    document.getElementById("health-fill").style.width = "100%";

    cancelAnimationFrame(animation);

    let previous = performance.now();

    function loop(now) {
        if (!game) return;

        const dt = Math.min((now-previous)/1000,0.04);
        previous = now;

        update(dt);
        draw();

        animation = requestAnimationFrame(loop);
    }

    animation = requestAnimationFrame(loop);
}

function distance(a,b) {
    return Math.hypot(a.x-b.x,a.y-b.y);
}

function attack(a) {
    if (!a || !a.alive || a.cooldown > 0) return;

    a.cooldown = 0.48;

    const targets = game.fighters
        .filter(f => f !== a && f.alive)
        .filter(f => distance(a,f) < a.range+22)
        .sort((x,y) => distance(a,x)-distance(a,y));

    const target = targets[0];

    if (!target) return;

    const dx = target.x-a.x;
    const dy = target.y-a.y;
    const d = Math.hypot(dx,dy) || 1;

    target.hp -= a.damage * (1+(a.level-1)*0.08);

    target.vx += dx/d*245;
    target.vy += dy/d*245;

    target.invulnerable = 0.18;

    particles(target.x,target.y,target.color,10);

    if (target.hp <= 0) {
        eliminate(target,a);
    }
}

function dash(a) {
    if (!a || !a.alive || a.dashCooldown > 0) return;

    a.vx = a.direction.x*560;
    a.vy = a.direction.y*560;

    if (a.vx === 0 && a.vy === 0) a.vx = 560;

    a.dashCooldown = 2.4;
    a.invulnerable = 0.2;

    particles(a.x,a.y,a.color,6);
}

function eliminate(target,killer) {
    if (!target.alive) return;

    target.alive = false;

    if (killer) {
        killer.kills++;
        killer.level = Math.min(5,killer.level+1);
        killer.hp = Math.min(
            killer.maxHp,
            killer.hp+15
        );
    }

    particles(target.x,target.y,"#f4c66b",25);
}

function particles(x,y,color,count) {
    for (let i=0;i<count;i++) {
        const angle = Math.random()*Math.PI*2;
        const speed = 40+Math.random()*190;

        game.particles.push({
            x,y,
            vx:Math.cos(angle)*speed,
            vy:Math.sin(angle)*speed,
            life:0.5+Math.random()*0.3,
            color
        });
    }
}

function update(dt) {
    const g = game;
    const p = g.player;

    g.elapsed += dt;
    g.time = Math.max(0,g.time-dt);

    g.zone.radius = Math.max(
        g.zone.minRadius,
        290-Math.max(0,g.elapsed-18)*0.55
    );

    g.zone.x = W/2+Math.sin(g.elapsed*0.11)*18;
    g.zone.y = H/2+Math.cos(g.elapsed*0.13)*12;

    for (const a of g.fighters) {
        if (!a.alive) continue;

        a.cooldown = Math.max(0,a.cooldown-dt);
        a.dashCooldown = Math.max(0,a.dashCooldown-dt);
        a.invulnerable = Math.max(0,a.invulnerable-dt);

        let mx = 0;
        let my = 0;

        if (a.human) {
            if (keys["w"] || keys["z"] || keys["arrowup"]) my--;
            if (keys["s"] || keys["arrowdown"]) my++;
            if (keys["a"] || keys["q"] || keys["arrowleft"]) mx--;
            if (keys["d"] || keys["arrowright"]) mx++;
        } else {
            a.brain -= dt;

            if (a.brain <= 0) {
                a.brain = 0.4+Math.random()*0.4;

                a.target = g.fighters
                    .filter(f => f !== a && f.alive)
                    .sort((x,y) => distance(a,x)-distance(a,y))[0];
            }

            const t = a.target;

            if (t && t.alive) {
                const d = distance(a,t);
                const angle = Math.atan2(t.y-a.y,t.x-a.x);

                if (d > a.range*0.7) {
                    mx = Math.cos(angle);
                    my = Math.sin(angle);
                } else if (d < a.range*0.35) {
                    mx = -Math.cos(angle)*0.35;
                    my = -Math.sin(angle)*0.35;
                }

                if (d < a.range+10 && a.cooldown <= 0) {
                    if (Math.random() < 0.09) attack(a);
                }
            }
        }

        const magnitude = Math.hypot(mx,my);

        if (magnitude > 0) {
            mx /= magnitude;
            my /= magnitude;

            a.direction = {x:mx,y:my};

            a.vx += mx*a.speed*dt*8;
            a.vy += my*a.speed*dt*8;
        }

        const friction = Math.pow(0.0008,dt);

        a.vx *= friction;
        a.vy *= friction;

        a.vx = Math.max(-a.speed,Math.min(a.speed,a.vx));
        a.vy = Math.max(-a.speed,Math.min(a.speed,a.vy));

        a.x = Math.max(25,Math.min(W-25,a.x+a.vx*dt));
        a.y = Math.max(40,Math.min(H-25,a.y+a.vy*dt));

        if (distance(a,g.zone) > g.zone.radius) {
            a.hp -= 8*dt;
        }

        if (a.hp <= 0) {
            eliminate(a,null);
        }
    }

    const alive = g.fighters.filter(f=>f.alive).length;

    document.getElementById("alive").textContent = alive;

    document.getElementById("health-fill").style.width =
        Math.max(0,p.hp/p.maxHp*100)+"%";

    document.getElementById("health-text").textContent =
        Math.max(0,Math.ceil(p.hp))+" / "+p.maxHp+" PV";

    document.getElementById("timer").textContent =
        String(Math.floor(g.time/60)).padStart(2,"0")+":"+
        String(Math.floor(g.time%60)).padStart(2,"0");

    g.particles = g.particles.filter(q=>q.life>0);

    for (const q of g.particles) {
        q.x += q.vx*dt;
        q.y += q.vy*dt;
        q.vx *= 0.94;
        q.vy *= 0.94;
        q.life -= dt;
    }

    if (!p.alive) {
        finish(false);
    } else if (alive === 1 || g.time <= 0) {
        finish(true);
    }
}

function finish(win) {
    if (!game || game.ended) return;

    game.ended = true;

    document.getElementById("end-screen").classList.remove("hidden");

    document.getElementById("end-title").textContent =
        win ? "DERNIÈRE LÉGENDE !" : "ÉLIMINATION";

    document.getElementById("end-description").textContent =
        win
        ? "Tu as remporté l'arène !"
        : "Tu as été éliminé. Retente ta chance !";

    cancelAnimationFrame(animation);
}

function draw() {
    const g = game;

    ctx.clearRect(0,0,W,H);

    // Sol
    ctx.fillStyle = "#202b43";
    ctx.fillRect(0,0,W,H);

    // Grille
    ctx.strokeStyle = "#ffffff0a";

    for (let x=0;x<W;x+=42) {
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,H);
        ctx.stroke();
    }

    for (let y=0;y<H;y+=42) {
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(W,y);
        ctx.stroke();
    }

    // Zone dangereuse
    const z = g.zone;

    ctx.save();

    ctx.fillStyle = "#d45d6940";
    ctx.beginPath();
    ctx.rect(0,0,W,H);
    ctx.arc(z.x,z.y,z.radius,0,Math.PI*2,true);
    ctx.fill("evenodd");

    ctx.strokeStyle = "#f4c66b";
    ctx.lineWidth = 3;
    ctx.setLineDash([9,8]);

    ctx.beginPath();
    ctx.arc(z.x,z.y,z.radius,0,Math.PI*2);
    ctx.stroke();

    ctx.restore();

    // Combattants
    for (const a of g.fighters) {
        if (!a.alive) continue;

        ctx.save();
        ctx.translate(a.x,a.y);

        // Ombre
        ctx.fillStyle = "#080d19aa";
        ctx.beginPath();
        ctx.ellipse(0,13,19,8,0,0,Math.PI*2);
        ctx.fill();

        // Corps
        ctx.fillStyle = a.invulnerable>0 ? "#ffffff" : a.color;

        ctx.beginPath();
        ctx.arc(0,0,17,0,Math.PI*2);
        ctx.fill();

        ctx.strokeStyle = a.human ? "#ffffff" : "#101526";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Emoji
        ctx.font = "17px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#172039";
        ctx.fillText(a.icon,0,1);

        // Barre de vie
        ctx.fillStyle = "#11182a";
        ctx.fillRect(-19,-29,38,5);

        ctx.fillStyle = "#69dda5";
        ctx.fillRect(
            -19,
            -29,
            38*Math.max(0,a.hp/a.maxHp),
            5
        );

        if (a.human) {
            ctx.fillStyle = "white";
            ctx.font = "bold 10px sans-serif";
            ctx.fillText("VOUS",0,-39);
        }

        ctx.restore();
    }

    // Particules
    for (const q of g.particles) {
        ctx.globalAlpha = Math.max(0,q.life/0.5);
        ctx.fillStyle = q.color;

        ctx.beginPath();
        ctx.arc(q.x,q.y,3,0,Math.PI*2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;

    if (distance(g.player,z)>z.radius-20) {
        ctx.fillStyle = "#f4c66b";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("⚠ REJOIGNEZ LA ZONE SÛRE",W/2,H-20);
    }
}

document.getElementById("play").onclick = startGame;

function returnLobby() {
    cancelAnimationFrame(animation);
    game = null;

    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("lobby").classList.remove("hidden");
}

document.getElementById("quit").onclick = returnLobby;
document.getElementById("return").onclick = returnLobby;
document.getElementById("restart").onclick = startGame;

// Contrôles tactiles
document.querySelectorAll("[data-key]").forEach(button => {
    const key = button.dataset.key;

    const mapping = {
        up:"z",
        down:"s",
        left:"q",
        right:"d"
    };

    button.addEventListener("pointerdown",e => {
        e.preventDefault();
        keys[mapping[key]] = true;
    });

    ["pointerup","pointerleave","pointercancel"].forEach(event => {
        button.addEventListener(event,() => {
            keys[mapping[key]] = false;
        });
    });
});

document.getElementById("mobile-attack").onclick = () => {
    if(game) attack(game.player);
};

document.getElementById("mobile-dash").onclick = () => {
    if(game) dash(game.player);
};
