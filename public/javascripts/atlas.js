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
  this.color = "";
  this.mass = 1.0;
  this.fixed = false;
  this.point = arbor.Point;
}

Data.prototype.initColor = function() {
  switch(this.type) {
    case "sample":
    this.color = " #00e676";
    break;
    case "micro":
    this.color = "#0fc1c9";
    break;
    case "messo":
    this.color = "fcd735";
    break;
    case "macro":
    this.color = "#ec5250";
    break;
    case "root":
    this.color = "brown";
    break;
  }
}

Data.prototype.initFont = function() {
  this.fontSize = 12;
  this.fontWeight = "normal";
  if (this.type === "root") {
    this.fontSize = 18;
    this.fontWeight = "bold"
  }
}

Data.prototype.initVisibility = function() {
  switch (this.type) {
    case "sample":
    this.isVisible = false
    break;
    case "messo":
    this.isVisible = false;
    break;
    default:
    // roots, macros, micros are initially visible
    this.isVisible = true;
    break;
    }
}

Data.prototype.initSelected = function() {
  this.isSelected = false;
  if (this.type === "root") {
    this.isSelected = true;
  }
}

// Samples only
Data.prototype.setFilePath = function(pathToFile) {
  this.filePath = pathToFile;
}

// Samples only
Data.prototype.setAudio = function() {
  this.audio = new Audio(this.filePath);
}

/**
* @Constructor Edge
* @param type "root" | "macro" | "messo" | "micro" | "sample",
* Return an Edge data attribute based on the type of Node.
* If its a root (i.e, Type or Mode) then set its visiblity
* to true;
*/
var Edge = function(source, target) {
  this.length = 0.75;
  if (source === "root") {
    this.isVisible = true;
  } else {
    this.isVisible = false;
  }
  this.color = "rgba(255, 255, 255, 0.333)";
}

/**
* @function isMacroSelected(atlas) 
* @param atlas the particle system
* return true if one of the macros is selected
*/
var isMacroSelected = function(atlas) {
  var edges = atlas.getEdgesFrom(atlas.getNode("Type"));
  var numMacros = edges.length;
  var macroSelected = false;
  var i = 0;
  do {
    macroSelected = edges[i].target.data.isSelected;
    i++;
  } while (!macroSelected && i < numMacros);

  return macroSelected;
}

/**
* @function sampleVisible(atlas, node)
* @param node
*/
var sampleVisible = function(atlas, source, target) {
  return isMacroSelected(atlas);
}

/**
* @function selectNode(node)
* @param node A selected node
* Todo: If sample node, play the sample??
*/

var selectNode = function (atlas, node) {
  node.data.isSelected = true;
  node.data.fontWeight = "bold";
  node.data.fontSize = 18;
  // Am I a sample node -> play the sample
  if (node.data.type === "sample") {
    console.log("started playing: ", node.data.filePath);
    node.data.audio.play();
  } else {
  // make all the edges and end nodes visible
    var edges = atlas.getEdgesFrom(node);
    edges.forEach(function (item) {
      item.data.isVisible = true;
      item.target.data.isVisible = true;
    });
  }
  return;
}

/**
* @function setVisibility(node)
* Called when a macro, messo, or micro node
* is deselected.  Set the visibility of the 
* edge nodes accordingly
*/
var setVisibility = function (atlas, node) {
  var edges = atlas.getEdgesTo(node);
  var isSelected = false;
  edges.forEach(function(item) {
    if (item.source.data.isSelected) {
      isSelected = true;
    }
  });

  if (isSelected) {
    node.data.isVisible = true;
  } else {
    node.data.isVisible = false;
  }
}




/**
* @function deselectNode(node)
* @param node A deselected node
* Deselected node and deal with 
* with the consequences
*/

var deselectNode = function (atlas, node) {
  switch (node.data.type) {
    case "sample":
    node.data.fontWeight = "normal";
    node.data.fontSize = 12;
    // stop playing
    node.data.audio.pause();
    node.data.audio.currentTime = 0;
    // deal with my visiblity
    setVisibility(atlas, node);
    break;
    case "root":
    break; // roots cannot be deselected or invisible??
    case "macro":
    // macros are never invisible
    node.data.fontWeight = "normal";
    node.data.fontSize = 12;
    node.data.isSelected = false;
    // make my messo & sample edges invisible and deselected
    var edges = atlas.getEdgesFrom(node);
    edges.forEach(function (item) {
      item.data.isVisible = false; // turn off the edge
      deselectNode(atlas, item.target)
    });
    break;
    case "messo":
    node.data.fontWeight = "normal";
    node.data.fontSize = 12;
    node.data.isSelected = false;
    // deal with my visiblity
    setVisibility(atlas, node);
    // deal with my sample's visibility
    var edges = atlas.getEdgesFrom(node);
    edges.forEach(function (item) {
      item.data.isVisible = false; // turn off the edge
      deselectNode(atlas, item.target)
    });
    break;
    case "micro":
    node.data.fontWeight = "normal";
    node.data.fontSize = 12;
    node.data.isSelected = false;
    // micros are never invisible
    // call deselectNode on all my samples
    var edges = atlas.getEdgesFrom(node);
    edges.forEach(function (item) {
      item.data.isVisible = false; // turn off the edge
      deselectNode(atlas, item.target)
    });
    break;
    default: // there should be no default!!
    break;
  }

  return;
}

/**
* @function handleNode(node)
* @param node A selected or deselected node
* View has detected that the node has been
* clicked by the user.  Do something about
* it
*/

var handleNode = function (atlas, node) {
  (node.data.isSelected) ? deselectNode(atlas, node) : selectNode(atlas, node);
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
    data.initColor();
    data.initSelected();
    data.initVisibility();
    data.initFont();
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
    data.setAudio();
    sample = addNode(atlas, s.id, data);
    // create the edge nodes
    data = new Data(s.macro, "macro", "");
    macro = addNode(atlas, s.macro, data);
    // todo: check to see only one edge is added!!!
    atlas.addEdge(type, macro, new Edge("root", "macro"));
    atlas.addEdge(macro, sample, new Edge("macro", "sample"));

    data = new Data(s.messo, "messo");
    node = addNode(atlas, s.messo, data);
    atlas.addEdge(macro, node, new Edge("macro", "messo"));
    atlas.addEdge(node, sample, new Edge("messo", "sample"));


    for (var i=0; i<s.micro.length; i++) {
      data = new Data(s.micro[i], "micro");
      node = addNode(atlas, s.micro[i], data);
      atlas.addEdge(mode, node, new Edge("root", "micro"));
      atlas.addEdge(node, sample, new Edge("micro", "sample"));
    }
});

  return atlas;
}

