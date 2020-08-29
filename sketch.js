const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

random.setSeed(random.getRandomSeed());

const settings = {
  suffix: random.getSeed(),
  dimensions: [2048, 2048],
};

let palette = random.pick(palettes);
palette = palette.slice(0, random.rangeFloor(2, palette.length + 1));
const background = palette.shift();

const sketch = async () => {
  const count = 50;
  const createGrid = () => {
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);

        const position = [u, v];
        const radius = Math.abs(random.noise2D(u, v)) * 0.3;

        points.push({
          color: random.pick(palette),
          radius,
          position,
          rotation: random.noise2D(u, v),
        });
      }
    }
    return points;
  };

  let points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { position, radius, color, rotation } = data;

      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, width - margin, v);

      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`;
      context.rotate(rotation);
      context.fillText('.', x, y);
    });
  };
};

canvasSketch(sketch, settings);
