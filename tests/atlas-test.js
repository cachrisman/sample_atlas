window.onload = function() {
  test("Atlas Construction & Initialization - One sample", function() {
    pause();
    setTimeout(function() {
      var samples = getSamples("./samples.json");
      assert(samples.length > 0, "Samples loaded");
      var atlas = buildAtlas(samples);
      assert(atlas !== undefined, "buildAtlas() returns a new atlas");
      var type = atlas.getNode("Type");
      assert(type !== undefined, "Type node added to atlas");
      assert(type.data.color === "brown", "type node color is brown");
      assert(atlas.getEdgesFrom(type).length === 1, "Type node has edge to Bass");
      var mode = atlas.getNode("Mode");
      assert(mode !== undefined, "Mode node added to atlas");
      assert(mode.data.color === "brown", "mode node color is brown");
      assert(atlas.getEdgesFrom(mode).length === 2, "Mode node has edges to FM & Dry");
      var id = samples[0].id;
      var sNode = atlas.getNode(id);
      assert(sNode.name === id, "Sample node added to atlas");
      var node = atlas.getNode("Bass");
      assert(node.data.type === "macro", "Atlas has macro node");
      assert(node.data.color === "red", "macro node color is red");
      assert(atlas.getEdgesFrom(node).length === 2, "Macro node has edges to sample & messo");
      var node = atlas.getNode("Analog Bass");
      assert(node.data.type === "messo", "Atlas has a messo node");
      assert(node.data.color === "green", "messo node color is green");
      assert(atlas.getEdgesFrom(node).length === 1, "Messo has edge to sample");
      var node = atlas.getNode("FM");
      assert(node.data.type === "micro", "Atlas has a micro node");
      assert(atlas.getEdgesFrom(node).length === 1, "Micro has edge to sample");
      resume();
      }, 0);
  });

  test("Atlas Construction & Initialization - Two samples", function() {
    pause();
    setTimeout(function() {
      var samples = getSamples("./two_samples.json");
      assert(samples.length > 0, "Samples loaded");
      var atlas = buildAtlas(samples);
      assert(atlas !== undefined, "buildAtlas() returns a new atlas");
      var type = atlas.getNode("Type");
      assert(type !== undefined, "Type node added to atlas");
      assert(type.data.color === "brown", "type node color is brown");
      assert(atlas.getEdgesFrom(type).length === 2, "Type node has edge to Bass & Piano/Keys");
      var mode = atlas.getNode("Mode");
      assert(mode !== undefined, "Mode node added to atlas");
      assert(mode.data.color === "brown", "mode node color is brown");
      assert(atlas.getEdgesFrom(mode).length === 4,
             "Mode node has edges to Long Evolving, Digital FM & Dry");
      var id = samples[1].id;
      var sNode = atlas.getNode(id);
      assert(sNode.data.label === "rhodes001", "Piano sample added to atlas");
      var node = atlas.getNode("Piano/Keys");
      assert(node.data.type === "macro", "Atlas has macro node");
      assert(node.data.color === "red", "macro node color is red");
      assert(atlas.getEdgesFrom(node).length === 2,
             "Piano/Keys node has edges to sample & messo");
      var node = atlas.getNode("Grand Piano");
      assert(node.data.type === "messo", "Atlas has a messo node");
      assert(node.data.color === "green", "messo node color is green");
      assert(atlas.getEdgesFrom(node).length === 1, "Messo has edge to sample");
      var node = atlas.getNode("Digital");
      assert(node.data.type === "micro", "Atlas has a micro node");
      assert(atlas.getEdgesFrom(node).length === 1, "Micro has edge to sample");
      resume();
      }, 0);
  });

  test("Atlas Getters/Setters", function() {
    pause();
    setTimeout(function() {
      assert(true === true, "Stub");
      resume();
      }, 0);
  });
};
