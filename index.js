const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
// const random = require('canvas-sketch-util/random');
// const Color = require('canvas-sketch-util/color');
// const risoColors = require('riso-colors');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  // name: seed,
};

let elcanvas;
let points;

// Artwork function
const sketch = ({ canvas }) => {
  points = [
    new Point({ x: 200, y: 540 }),
    new Point({ x: 400, y: 700 }),
    new Point({ x: 880, y: 540 }),
    new Point({ x: 600, y: 700 }),
    new Point({ x: 640, y: 900 }),
  ];
  canvas.addEventListener('mousedown', onMouseDown);

  elcanvas = canvas;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = '#999';
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    // for (let i = 1; i < points.length; i += 2) {
    //   context.quadraticCurveTo(
    //     points[i].x,
    //     points[i].y,
    //     points[i + 1].x,
    //     points[i + 1].y
    //   );
    // }

    context.beginPath();

    for (let i = 0; i < points.length - 1; i += 1) {
      let curr = points[i + 0];
      let next = points[i + 1];

      let mx = curr.x + (next.x - curr.x) * 0.5;
      let my = curr.y + (next.y - curr.y) * 0.5;

      if (i == 0) context.moveTo(curr.x, curr.y);
      else if (i == points.length - 2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
      else context.quadraticCurveTo(curr.x, curr.y, mx, my);
      // context.quadraticCurveTo(curr.x, curr.y, mx, my);
    }

    context.lineWidth = 4;
    context.strokeStyle = 'blue';
    context.stroke();

    points.forEach((point) => {
      point.draw(context);
    });
  };
};

// Start the sketch
canvasSketch(sketch, settings);
// let points;
const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  const x = (e.offsetX / elcanvas.offsetWidth) * elcanvas.width;
  const y = (e.offsetY / elcanvas.offsetHeight) * elcanvas.height;

  points.forEach((point) => {
    point.isDragging = point.hittest(x, y);
  });
};
const onMouseMove = (e) => {
  const x = (e.offsetX / elcanvas.offsetWidth) * elcanvas.width;
  const y = (e.offsetY / elcanvas.offsetHeight) * elcanvas.height;

  // console.log(x,y)
  points.forEach((point) => {
    if (point.isDragging) {
      point.x = x;
      point.y = y;
    }
  });
};

const onMouseUp = () => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

class Point {
  constructor({ x, y, control = false }) {
    this.x = x;
    this.y = y;
    this.control = control;
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control ? 'red' : 'black';
    // context.fillStyle = 'black';
    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
  hittest(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dd = Math.sqrt(dx * dx - dy * dy);

    return dd <= 20;
  }
}
