window.onload  = function() {

  let currentBubble;
  let startRadius;
  let width = document.documentElement.clientWidth;
  let height = document.documentElement.clientHeight;
  let centerX = width / 2 ;
  let centerY = height / 2 ;

  let minRadius = 1;
  let maxRadius = 7;
  let rate = 2;
  let pulseRate;
  let centerCirle;
  let color;
  let forces = [0.0005, -0.0005, 0.001, -0.001, 0, 0.0007, -0.0007, 0 ];
  let maxRads = [12, 15, 18, 20, 22, 26];
  let opacities = [0.1, 0.2, 0.3, 0.2, 0.5, 0.6, 0.7 ];
  let change = 1;

  var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  World = Matter.World,
  Bodies = Matter.Bodies;
  Events = Matter.Events;
  Body = Matter.Body;

  // create engine
  var engine = Engine.create({
    timing: {
      isFixed: false,
      timeScale: 10
    }
  });
  world = engine.world;

  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: Math.min(width),
      height: Math.min(height),
      showVelocity: false,
      showAngleIndicator: false,
      background: 'black',
      wireframes: false
    }
  });

  Render.run(render);

  // Create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  // Add bodies
  World.add(world, [
    Bodies.rectangle(width, centerY, 2, height, {
      isStatic: true,
      render: {
        visible: true
      }
    }),
    Bodies.rectangle(0, centerY, 2, height, {
      isStatic: true,
      render: {
        visible: true
      }
    })
  ]);

  engine.world.gravity.y = -0.02;

  updateBubbles();

  function addCircle(){
    let radius = minRadius + Math.random() * maxRadius;
    let randXPos = radius + Math.random() * ( width - radius );
    let frictionAir = setFrictionAir(radius);
    let force = setRandomForce();

    let circle = Bodies.circle(randXPos, height + 100, radius, {
      isStatic: false,
      isSensor: true,
      restitution: 1,
      frictionAir: frictionAir,
      render: {
        fillStyle: color,
        strokeStyle: 'white',
        lineWidth: 2,
        opacity: 0.5
      }
    });

    Body.applyForce(circle, { x: circle.position.x, y: circle.position.y }, {x: force, y: 0});
    World.add(world, circle);
  }

  function addBackCircle(){
    let radius = minRadius + Math.random() * maxRadius;
    let randXPos = radius + Math.random() * ( width - radius );
    let frictionAir = setFrictionAir(radius)
    let force = setRandomForce();

    let circle = Bodies.circle(randXPos, height + 50, radius, {
      isStatic: false,
      isSensor: true,
      restitution: 0.8,
      frictionAir: frictionAir,
      render: {
        fillStyle: color,
        strokeStyle: 'white',
        lineWidth: 2,
        opacity: setOpacity()
      }
    });

    Body.applyForce(circle, { x: circle.position.x, y: circle.position.y }, {x: force, y: 0});
    World.add(world, circle);
  }

  function addFrontCircle(){
    let radius = (minRadius + 10) + Math.random() * (maxRadius + 40);
    let randXPos = radius + Math.random() * ( width - radius );
    let frictionAir = setFrictionAir(radius)
    let force = setRandomForce();
    let col = color;

    let circle = Bodies.circle(randXPos, height + 50, radius, {
      isStatic: false,
      isSensor: true,
      restitution: 0.8,
      frictionAir: frictionAir,
      render: {
        fillStyle: color,
        strokeStyle: col,
        lineWidth: 6,
        opacity: setOpacityTwo()
      }
    });

    Body.applyForce(circle, { x: circle.position.x, y: circle.position.y }, {x: force, y: 0});
    World.add(world, circle);
  }

  // Add mouse control
  var mouse = Mouse.create(render.canvas),

  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
      render: {
        visible: false
      }
    }
  });

  function setOpacity(){
    let index = Math.floor(Math.random() * ( opacities.length - 1 ));
    return opacities[index];
  }

  function setOpacityTwo(){
    opacs = [0.01, 0.05, 0.08, 0.1, 0.3];
    let index = Math.floor(Math.random() * ( opacs.length - 1 ));
    return opacs[index];
  }

  function setRandomForce(){
    let index = Math.floor(Math.random() * ( forces.length - 1 ));
    return forces[index];
  }

  setInterval(function(){
    change++;
    updateBubbles();
  }, 15000);

  function setFrictionAir( radius ){
    let frictionAir = radius / 1000;

    if( frictionAir < 0.01 ){
      frictionAir = 0.01;
    }

    if( frictionAir > 0.015 ){
      frictionAir = 0.015;
    }

    return 0.02 - frictionAir;
  }

  function updateBubbles() {

    switch (change) {
      case 1:
        maxRadius = maxRads[0];
        color = 'green';
      break;
      case 2:
        maxRadius = maxRads[0];
        color = 'green';
        break;
      case 3:
        maxRadius = maxRads[1];
        color = 'orange';
        break;
      case 4:
        maxRadius = maxRads[3];
        color = 'orange';
        break;
      case 5:
        maxRadius = maxRads[4];
        color = 'red';
        break;
      case 6:
        maxRadius = maxRads[5];
        color = 'red';
        change = 0;
        break
      default:

    }
  }

  Events.on(runner, "tick", draw);

  let pulse = true;
  let count = 0;
  let swaying = true;
  let swayCount = 0;

  function draw(){
      count++;
      if(count % 10 === 0 ){
          addCircle();
          addBackCircle();
          addCircle();
          addBackCircle();
          addCircle();
          addBackCircle();
          addFrontCircle();
      }
  }


  World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: document.documentElement.clientWidth, y: document.documentElement.clientHeight }
  });

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function() {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    }
  };
};

// http://ordinary-library.surge.sh/
