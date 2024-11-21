import { dialogueData, scaleFactor } from "./constant";
import { k } from "./kaboomCtx";
import { displayDialogue, setCamScale } from "./utils";

//name , source
k.loadSprite("spritesheet", "./spritesheet.png", {
  sliceX: 39, //total nuber of mini assets tile / total png tile at x
  sliceY: 31,
  anims: {
    // create the animations
    "idle-down": 936,
    "walk-down": { from: 936, to: 939, loop: true, speed: 8 }, //start frame, end frame, looping, frame speed
    "idle-side": 975,
    "walk-side": { from: 975, to: 978, loop: true, speed: 8 },

    "idle-up": 1014,
    "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },

    "close-box": 137,
    "open-box": 138,
  },
});

k.loadSprite("map", "./map.png");

k.setBackground(k.Color.fromHex("#751047"));

k.scene("main", async () => {
  const LoadBaseMap = await fetch("./map.json");
  const mapData = await LoadBaseMap.json();
  const layers = mapData.layers;

  //create a object (player, props etc) not display on screen
  const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);
  // k.add() -> show on map

  const player = k.make([
    k.sprite("spritesheet", { anim: "idle-down" }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(),
    k.scale(scaleFactor),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);
  
  for (const layer of layers) {
    if (layer.name === "boundaries") {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.width),
          }),
          k.body({ isStatic: true }), //prevent to pass
          k.pos(boundary.x, boundary.y),
          boundary.name, // to call the object
        ]);

        //   todo boundry not detect collison
        // collied
        if (boundary.name) {
          
          player.onCollide(boundary?.name, () => {
            // console.log("collide with", boundary.name);

            player.isInDialogue = true;
            displayDialogue(
              dialogueData[boundary.name],
              () => (player.isInDialogue = false)
            );
          });
        }
      }
      continue;
    }

    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        if (entity.name === "player") {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          );
          k.add(player);
          continue;
        }
      }
    }
  }

  k.onUpdate(() => {
    k.camPos(player.pos.x, player.pos.y + 100);
  });

  setCamScale(k);
  k.onResize(setCamScale(k));

  //   controls
  k.onMouseRelease((e) => {
    switch (player.direction) {
      case "down":
        player.play("idle-down");
        break;
      case "up":
        player.play("idle-up");
        break;
      case "left":
        player.flipX = true;
        player.play("idle-side");
        break;
      case "right":
        player.play("idle-side");
        break;
    }
  });
  k.onMouseDown((e) => {
    if (e.key === "left" || player.isInDialogue) return; // stop the movement for the dialog box
    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    // directional animation
    const mouseAngle = player.pos.angle(worldMousePos);

    // 45 to 135 -> up
    // 135 to (225-180) -> right
    // (315-180) to (225-180) -> down
    // (135-180) to 45 -> left

    if (mouseAngle < 135 && mouseAngle > 45) {
      if (player.curAnim() !== "walk-up") player.play("walk-up");
      player.direction = "up";
    } else if (mouseAngle > -135 && mouseAngle < -45) {
      if (player.curAnim() !== "walk-down") player.play("walk-down");
      player.direction = "down";
    } else if (mouseAngle > -45 && mouseAngle < 45) {
      // left
      player.flipX = true;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "left";
    } else {
      // right
      player.flipX = false;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "right";
    }
  });
});

k.go("main");
