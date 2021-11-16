/* eslint-disable semi */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-inferrable-types */

/**
 * Get average acceleration.
 * An object's average acceleration over a period of time is its change in velocity ( Δ v ) divided by the duration of the period ( Δ t ).
 * @param v0 the initial velocity
 * @param v1 the final velocity after the duration of the period
 * @param t the duration of the period
 */
export function getAverageAcceleration(v0: number, v1: number, t: number): number {
  return (v1 - v0) / t;
}

/**
 * Creates a function to get velocity at the elapsed time in uniform acceleration motion.
 * @param a the uniform rate of acceleration.
 * @param v0 the initial velocity, default is 0
 */
export function createUniformAccelerationVelocity(
  a: number,
  v0: number = 0,
): (t: number) => number {
  return t => v0 + a * t;
}

/**
 * Creates a function to get displacement from the origin at the elapsed time in uniform acceleration motion.
 * @param a the uniform rate of acceleration
 * @param v0 the initial velocity, default is 0
 * @param s0 the initial displacement from the origin, default is 0
 */
export function createUniformAccelerationDisplacement(
  a: number,
  v0: number = 0,
  s0: number = 0,
): (t: number) => number {
  return t => s0 + v0 * t + 0.5 * a * t ** 2;
}

/**
 * Create a function to get velocity at the elapsed time in 'braking' motion.
 * The 'braking' motion, just like a car brakes, means that the motion divides into two parts.
 * The first part is uniform velocity motion and the second part is uniform acceleration motion.
 * At the end, the velocity of the object decelerates from v0 to v1.
 * @param tt the duration of the total time
 * @param s the total displacement
 * @param v0 the initial velocity
 * @param v1 the final velocity, default is 0
 */
export function createBrakingVelocity(
  tt: number,
  s: number,
  v0: number,
  v1: number = 0,
): (t: number) => number {
  const t0 = (s - v0 * tt - 0.5 * (v1 - v0) * tt) / (-0.5 * (v1 - v0));
  const t1 = tt - t0;
  const a1 = (v1 - v0) / t1;
  return t => {
    if (t <= t0) {
      return v0;
    }
    if (t >= tt) {
      return v1;
    }
    return v0 + a1 * (t - t0);
  };
}

/**
 * Create a function to get displacement from the origin at the elapsed time in uniform velocity motion with 'braking'.
 * The 'braking' motion, just like a car brakes, means that the motion divides into two parts.
 * The first part is uniform velocity motion and the second part is uniform acceleration motion.
 * At the end, the velocity of the object decelerates from v0 to v1.
 * @param tt the duration of the total time
 * @param s the total displacement
 * @param v0 the initial velocity
 * @param v1 the final velocity, default is 0
 */
export function createUniformVelocityBrakingDisplacement(
  tt: number,
  s: number,
  v0: number,
  v1: number = 0,
): (t: number) => number {
  const t0 = (s - v0 * tt - 0.5 * (v1 - v0) * tt) / (-0.5 * (v1 - v0));
  const t1 = tt - t0;
  const s0 = v0 * t0;
  const a1 = (v1 - v0) / t1;
  return t => {
    if (t <= t0) {
      return v0 * t;
    }
    if (t >= tt) {
      return s;
    }
    return s0 + v0 * (t - t0) + 0.5 * a1 * (t - t0) ** 2;
  };
}

/**
 * Creates a function to get displacement from the origin at the elapsed time in uniform acceleration motion with 'crashing into a sponge'.
 * The 'sponge' motion, means that the motion divides into three parts.
 * The first part is uniform acceleration motion, the second part is crashing into a sponge and the third part is sponge regaining its shape.
 *
 */
export function createUniformAccelerationSpongeDisplacement(): (t: number) => number {
  return (t: number): number => t;
}
