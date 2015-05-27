window.onload = function() {
  test("Atlas Construction & Initialization - Two samples", function() {
    pause();
    setTimeout(function() {
      var samples = getSamples("./two_samples.json");
      assert(samples.length === 2, "Samples loaded");
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
             "Mode node has edges to Long Evolving, Digital, FM & Dry");
      var id = samples[1].id;
      var sNode = atlas.getNode(id);
      assert(sNode.data.label === "rhodes001", "Piano sample added to atlas");
      assert(!sNode.data.isVisible, "Piano sample not visible");
      var node = atlas.getNode("Piano/Keys");
      assert(node.data.type === "macro", "Atlas has macro node");
      assert(node.data.color === "red", "macro node color is red");
      assert(node.data.isVisible, "Piano/Keys is visible");
      assert(!node.data.isSelected, "Piano/Keys is not selected");
      assert(atlas.getEdgesFrom(node).length === 2,
             "Piano/Keys node has edges to sample & messo");
      var node = atlas.getNode("Grand Piano");
      assert(node.data.type === "messo", "Atlas has a messo node");
      assert(node.data.color === "green", "messo node color is green");
      assert(!node.data.isVisible, "messo node is not visible");
      assert(atlas.getEdgesFrom(node).length === 1, "Messo has edge to sample");
      var node = atlas.getNode("Digital");
      assert(node.data.type === "micro", "Atlas has a micro node");
      assert(atlas.getEdgesFrom(node).length === 1, "Micro has edge to sample");
      var node = atlas.getNode("Type");
      assert(node.data.type === "root", "Atlas has a Type node");
      assert(node.data.isVisible, "Type is visible");
      resume();
      }, 0);
  });

  test("Atlas Controller Methods", function() {
    pause();
    setTimeout(function() {
      var samples = getSamples("./two_samples.json");
      assert(samples.length === 2, "Samples loaded");
      var atlas = buildAtlas(samples);
      assert(atlas !== undefined, "buildAtlas() returns a new atlas");
      var mNode = atlas.getNode("Piano/Keys");
      assert(!mNode.data.isSelected, "Piano/Keys not selected");
      var sNode = atlas.getNode(samples[1].id);
      assert(!sNode.data.isVisible, "Rhodes001 not visible");
      handleNode(atlas, mNode);
      assert(mNode.data.isSelected, "Piano/Keys is now selected");
      assert(sNode.data.isVisible, "Rhodes001 is now visible");
      var edges = atlas.getEdgesFrom(mNode)
      assert(edges[0].data.isVisible, "Edge is visible");
      handleNode(atlas, mNode);
      assert(!mNode.data.isSelected, "Piano/Keys is deselected");
      assert(!sNode.data.isVisible, "Rhodes001 is not visible");
      assert(!edges[0].data.isVisible, "Edge is not visible");
      resume();
      }, 0);
  });
};
