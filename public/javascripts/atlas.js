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
* @param type "macro" | "messo" | "micro" | "sample",
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
  this.color = "#000";
  this.mass = 1.0;
  this.fixed = false;
  this.point = arbor.Point;
}

/**
* @Constructor Edge
* @param type "macro" | "messo" | "micro" | "sample",
* Return an Edge data attribute based on the type of Node
*/
var Edge = function(type) {
  this.length = 0.75;
}

/**
* @function addNode(name, data)
* @param name unique identifier
* @param data data
* Check if the node is already in the atlas. If not then 
* create it. Regardless, return the node object
*/
var addNode = function(atlas, name, data) {
  var node = atlas.getNode(name);
  return (node === undefined) ? atlas.addNode(name, data) : node;
}    
  
/**
* @function buildAtlas
* @param samples // array of Samples
* Givin an array of Samples, return an Atlas in the format
* required by arbor.js
*/
var buildAtlas = function(samples) {
  var atlas = arbor.ParticleSystem(new System);
  var sample, node, data;
  // Create a sample node and its edges & add it to the atlas
  samples.forEach(function (s) {
    data = new Data(s.name, "sample", false, false, s.filePath);
    sample = addNode(atlas, s.id, data);
    // create the edge nodes
    data = new Data(s.macro, "macro", false, false, "");
    node = addNode(atlas, s.macro, data);
    atlas.addEdge(node, sample, new Edge("macro"));

    data = new Data(s.messo, "messo", false, false, "");
    node = addNode(atlas, s.messo, data);
    atlas.addEdge(node, sample, new Edge("messo"));

    for (var i=0; i<s.micro.length; i++) {
      data = new Data(s.micro[i], "micro", false, false, "");
      node = addNode(atlas, s.micro[i], data);
      atlas.addEdge(node, sample, new Edge("micro"));
    }
});

  return atlas;
}

