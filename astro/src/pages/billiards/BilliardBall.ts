import p5 from "p5";
let mu = 0.01;

export default class BilliardBall {
  pos: p5.Vector;
  vel: p5.Vector;
  mass: number;
  r: number;
  color: p5.Color;

  constructor(x: number, y: number, m: number, p: p5) {
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(p.random(-20, 20), p.random(-20, 20));
    this.mass = m;
    this.r = 16 * p.sqrt(m);
    this.color = p.color(p.random(255), p.random(255), p.random(255));
  }

  calcFriction() {
    let friction = this.vel.copy();
    friction.setMag(-1 * mu * this.mass);
    return friction;
  }

  update() {
    this.vel.add(this.calcFriction());
    this.pos.add(this.vel);
  }

  edges(width: number, height: number) {
    if (this.pos.y >= height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
    } else if (this.pos.y <= this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }

    if (this.pos.x >= width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
    } else if (this.pos.x <= this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    }
  }

  collision(other: BilliardBall) {
    let mt = this.mass + other.mass;
    if (p5.Vector.dist(this.pos, other.pos) <= this.r + other.r) {
      let normalVector = p5.Vector.sub(this.pos, other.pos).normalize();
      let tangentVector = new p5.Vector(normalVector.y * -1, normalVector.x);

      let ball1Normal = normalVector.dot(this.vel);
      let ball2Normal = normalVector.dot(other.vel);

      let ball1Tangent = tangentVector.dot(this.vel);
      let ball2Tangent = tangentVector.dot(other.vel);

      let ball1NormalAfter =
        ball1Normal * (this.mass - other.mass) +
        (2 * other.mass * ball2Normal) / mt;

      let ball2NormalAfter =
        ball2Normal * (other.mass - this.mass) +
        (2 * this.mass * ball1Normal) / mt;

      let ball1NormalVector = normalVector.copy().mult(ball1NormalAfter);
      let ball1TangentVector = tangentVector.copy().mult(ball1Tangent);
      let ball2NormalVector = normalVector.copy().mult(ball2NormalAfter);
      let ball2TangentVector = tangentVector.copy().mult(ball2Tangent);

      this.vel.set(p5.Vector.add(ball1NormalVector, ball1TangentVector));
      other.vel.set(p5.Vector.add(ball2NormalVector, ball2TangentVector));
      //
      // other.vel.set(p5.Vector.add(other.vel, dist1));
      // console.log("colliding!");
      // this.vel.x =
      //   ((this.mass - other.mass) * this.vel.x) / mt +
      //   (2 * other.mass * other.vel.x) / mt;
      // other.vel.x =
      //   (2 * this.mass * this.vel.x) / mt +
      //   ((other.mass - this.mass) * other.vel.x) / mt;
      // this.vel.y =
      //   ((this.mass - other.mass) * this.vel.y) / mt +
      //   (2 * other.mass * other.vel.y) / mt;
      // other.vel.y =
      //   (2 * this.mass * this.vel.y) / mt +
      //   ((other.mass - this.mass) * other.vel.y) / mt;
    }
  }

  show(p: p5) {
    p.stroke(this.color);
    p.fill(this.color);
    p.ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}
