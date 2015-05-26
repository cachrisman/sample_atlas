/**
* @Constructor System
* @param repulsion
* @param stiffness
* @param friction
* @param gravity
* @param fps
* @param dt
* @param precision
* Constructs a new paricles system.  See [Arbor Reference]
* (http://arborjs.org/reference) for details on parameters.
* For now we'll use the defaults
*/

var System = function(repulsion, stiffness, friction,
                      gravity, fps, dt, precision) {
  this.repulsion = 1000;
  this.stiffness = 600;
  this.friction = 0.5;
  this.gravity = false;
  this.fps = 55;
  this.dt = 0.02;
}

/**
* @Constructor Node
* @param name String (Unique ID) // read only
* @param data Data;
* Constructs a new Node.  See See [Arbor Reference]
* (http://arborjs.org/reference) for details on parameters.
*
*/

var Node = function (name, data) {
  this.name = name;
  this.data = data;
}

/**
* @Constructor Data
* @param label String  // name of the node 
* @param type "Macro" | "Messo" | "Micro" | "Sample",
* @param visible Boolean,
* @param selected Boolean,
* @param filePath pathToFile // path to sample file, sample's only
* @param color #FFF000000
* @param mass Number // the node’s resistance to movement and repulsive power
* @param fixed Boolean  // if true, the node will be unaffected by other particles
* @param p: Point // the position of the node (in system coordinates (i.e., 0, 0 = top-left corner))
*/

var Data = function (label, type, visible, selected,
                     filePath, color, mass, fixed, point) {
  this.label = label;
  this.type = type;
  this.visible = visible;
  this.selected = selected;
  this.filePath = filePath;
  this.color = color;
  this.mass = 1.0;
  this.fixed = false;
  this.point.x = 0;
  this.point.y = 0;
}

/**
* @function buildAtlas
* @param samples // array of samples
* Givin an array of Samples, return an Atlas in the format
* required by arbor.js
*/
var buildAtlas = function(samples) {
  var atlas = arbor.ParticleSystem(new System);
  // Create a sample node
/*
  samples.forEach(function (s) {
    var data = new Data(s.name, "sample", false, false, s.filePath);
    var node = new Node(s.id, data);
    });
*/
  return atlas;
}

