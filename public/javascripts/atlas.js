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
* @Constructor Data
* @param label String  // name of the node 
* @param type "root" | "macro" | "messo" | "micro" | "sample",
* @param visible Boolean,
* @param selected Boolean,
* @param filePath pathToFile // path to sample file, sample's only
* @param color #FFF000000
* @param mass Number // the node’s resistance to movement and repulsive power
* @param fixed Boolean  // if true, the node will be unaffected by other particles
* @param p: Point // the position of the node (in system coordinates (i.e., 0, 0 = top-left corner))
*/

var Data = function (label, type) {
  this.label = label;
  this.type = type;
  this.isVisible = false;
  this.isSelected = false;
  this.filePath = "";
  this.color = "black";
  this.mass = 1.0;
  this.fixed = false;
  this.point = arbor.Point;
}

Data.prototype.setColor = function() {
  switch(this.type) {
    case "sample":
    this.color = "orange";
    break;
    case "micro":
    this.color = "blue";
    break;
    case "messo":
    this.color = "green";
    break;
    case "macro":
    this.color = "red";
    break;
    case "root":
    this.color = "brown";
    break;
  }
}

Data.prototype.setVisibility = function (isVisible) {
  this.isVisible = isVisible;
}


Data.prototype.setSelected = function(isSelected) {
  this.isSelected = isSelected;
}

Data.prototype.setFilePath = function(pathToFile) {
  this.filePath = pathToFile;
}

/**
* @Constructor Edge
* @param type "root" | "macro" | "messo" | "micro" | "sample",
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
  if (node === undefined) {
    data.setColor();
    data.setSelected(false); 
    // roots, macros, micros are initially visible
    if (data.type.label === "root" ||
        name === "macro" || name === "micro" ) {
          data.setVisibility(true);
    }
    else {
      data.setVisibility(false);
    }
    node = atlas.addNode(name, data);
  }
  return node;
}    
  
/**
* @function buildAtlas
* @param samples // array of Samples
* Givin an array of Samples, return an Atlas in the format
* outlined by arbor.js
*/
var buildAtlas = function(samples) {
  var sample, node, macro, data;

  var atlas = arbor.ParticleSystem(new System);

  // create the root nodes
  var type = addNode(atlas, "Type", new Data("Type", "root"));
  var mode = addNode(atlas, "Mode", new Data("Mode", "root"));

  // Create a sample node and its edges & add it to the atlas
  samples.forEach(function (s) {
    data = new Data(s.name, "sample");
    data.setFilePath(s.filePath);
    sample = addNode(atlas, s.id, data);
    // create the edge nodes
    data = new Data(s.macro, "macro", "");
    macro = addNode(atlas, s.macro, data);
    atlas.addEdge(type, macro, new Edge("root", "macro"));
    atlas.addEdge(macro, sample, new Edge("macro", "sample"));

    data = new Data(s.messo, "messo");
    node = addNode(atlas, s.messo, data);
    atlas.addEdge(macro, node, new Edge("macro", "messo"));
    atlas.addEdge(node, sample, new Edge("messo", "sample"));


    for (var i=0; i<s.micro.length; i++) {
      data = new Data(s.micro[i], "micro", false, false, "");
      node = addNode(atlas, s.micro[i], data);
      atlas.addEdge(mode, node, new Edge("root", "micro"));
      atlas.addEdge(node, sample, new Edge("micro", "sample"));
    }
});

  return atlas;
}

