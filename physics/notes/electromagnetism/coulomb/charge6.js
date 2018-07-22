(function() {
  var canvas = document.getElementById("charge6");
  var ctx = canvas.getContext("2d");
  canvas.width = document.getElementsByTagName("article")[0].clientWidth;
  ctx.font = "30px Arial";
  ctx.fillStyle = "#aaa";
  ctx.textAlign = "center";
  ctx.fillText("click to start simulation", canvas.width / 2, canvas.height / 2);
})();

function charges6(el) {
  el.onclick = null; //stops the function from running on button click
  Charge.setCanvas(el);
  // var canvas = el
  // var ctx = canvas.getContext("2d");

  //switch between draw modes
  let drawMode = 1;
  document.addEventListener("keypress", event => {
    if (!pause) {
      if (event.charCode === 49) {
        drawMode = 1; //particle
        el.style.background = "#fff";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (event.charCode === 50) {
        drawMode = 2; //particles + electric vector field
        el.style.background = "#fff";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (event.charCode === 51) {
        drawMode = 3; //electric potential scalar field
        el.style.background = "#fff";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (event.charCode === 52) {
        drawMode = 4; //cloud chamber
        el.style.background = "#000";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  });

  //___________________get mouse input___________________
  var mouse = {
    down: false,
    x: 0,
    y: 0
  };
  canvas.onmousemove = function(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };
  canvas.onmousedown = function() {
    mouse.down = true;
    Charge.repulse(q, mouse);
  };
  canvas.onmouseup = function() {
    mouse.down = false;
  };
  let pause = false;
  el.addEventListener("mouseleave", function() {
    pause = true;
  });
  el.addEventListener("mouseenter", function() {
    Charge.setCanvas(el);
    if (pause) requestAnimationFrame(cycle);
    pause = false;
  });

  const q = []; //holds the charges
  //spawn p before e to avoid a bug in the class method allPhysics
  const side = 30;
  const apothem = side * 0.866; //vertical distance between rows
  const rows = 22; // y
  const columns = 14; // x

  const hexLeft = canvas.width / 2 - side * ((columns * 3) / 4);
  const hexTop = canvas.height / 2 - apothem * (rows / 2);

  for (let y = 1; y < rows; ++y) {
    let xOff = 0;
    if (y % 2) {
    } else {
      xOff = 0.5; //odd
    }
    for (let x = -1, i = 0; i < columns; ++i) {
      if (i % 2) {
        //even
        x++;
        xOff = Math.abs(xOff);
      } else {
        //odd
        x += 2;
        xOff = -Math.abs(xOff);
      }

      q[q.length] = new Charge("p", {
        x: hexLeft + (x + xOff) * side,
        y: hexTop + y * apothem
      });
    }
  }

  for (let y = 1; y < rows; ++y) {
    let xOff = 0;
    if (y % 2) {
    } else {
      xOff = 0.5; //odd
    }
    for (let x = -1, i = 0; i < columns; ++i) {
      if (i % 2) {
        //even
        x++;
        xOff = Math.abs(xOff);
      } else {
        //odd
        x += 2;
        xOff = -Math.abs(xOff);
      }

      q[q.length] = new Charge("e-small", {
        x: hexLeft + (x + xOff) * side,
        y: hexTop + y * apothem
      });
    }
  }

  // const separation = 30;
  // const len = 7;
  // const offx = canvas.width / 2 - ((len - 1) * separation) / 2;
  // const offy = canvas.height / 2 - ((len - 1) * separation) / 2;
  // for (let i = 0; i < len; ++i) {
  //   for (let j = 0; j < len; ++j) {
  //     q[q.length] = new Charge("p", {
  //       x: i * separation + offx,
  //       y: j * separation + offy
  //     });
  //   }
  // }
  // for (let i = 0; i < len; ++i) {
  //   for (let j = 0; j < len; ++j) {
  //     q[q.length] = new Charge("e", {
  //       x: i * separation + offx,
  //       y: j * separation + offy
  //     });
  //   }
  // }

  // Charge.spawnCharges(q, 25, 'e')
  // Charge.spawnCharges(q, 25, 'p')
  function cycle() {
    Charge.physicsAll(q, 0.985, 600, 150);
    //choose a draw mode
    if (drawMode === 1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      Charge.drawAll(q);
    } else if (drawMode === 2) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      Charge.vectorField(q);
      ctx.globalAlpha = 0.5;
      Charge.drawAll(q);
      ctx.globalAlpha = 1;
    } else if (drawMode === 3) {
      Charge.scalarField(q);
    } else if (drawMode === 4) {
      Charge.drawCloudChamber(q);
    }
    Charge.bounds(q);
    if (!pause) requestAnimationFrame(cycle);
  }
  requestAnimationFrame(cycle);
}
