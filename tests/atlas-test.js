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
      assert(type.data.color === "#AE62B7", "type node color is #AE62B7");
      assert(atlas.getEdgesFrom(type).length === 2, "Type node has edge to Bass & Piano/Keys");
      var mode = atlas.getNode("Mode");
      assert(mode !== undefined, "Mode node added to atlas");
      assert(type.data.color === "#AE62B7", "Mode node color is #AE62B7");
      assert(atlas.getEdgesFrom(mode).length === 4,
             "Mode node has edges to Long Evolving, Digital, FM & Dry");
      var id = samples[1].id;
      var sNode = atlas.getNode(id);
      assert(sNode.data.label === "rhodes001", "Piano sample added to atlas");
      assert(!sNode.data.isVisible, "Piano sample not visible");
      var node = atlas.getNode("Piano/Keys");
      assert(node.data.type === "macro", "Atlas has macro node");
      assert(node.data.color === "#ec5250", "macro node color is #ec5250");
      assert(node.data.isVisible, "Piano/Keys is visible");
      assert(!node.data.isSelected, "Piano/Keys is not selected");
      assert(atlas.getEdgesFrom(node).length === 2,
             "Piano/Keys node has edges to sample & messo");
      var node = atlas.getNode("Grand Piano");
      assert(node.data.type === "messo", "Atlas has a messo node");
      assert(node.data.color === "#fcd735", "messo node color is #fcd735");
      console.log("messo color: ", node.data.color);
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
      assert(sampleVisible(atlas, mNode), "A macro is selected");
      handleNode(atlas, mNode);
      assert(!mNode.data.isSelected, "Piano/Keys is deselected");
      assert(!sNode.data.isVisible, "Rhodes001 is not visible");
      assert(!edges[0].data.isVisible, "Edge is not visible");
      assert
      resume();
      }, 0);
  });
  test("Sample Play/Stop Methods", function() {
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
      // stop play the sample and console log
      handleNode(atlas, sNode);
      // stop playing the sample and console log
      setTimeout(function() {
        handleNode(atlas, sNode);
      }, 5000);

      handleNode(atlas, mNode);
      assert(!mNode.data.isSelected, "Piano/Keys is deselected");
      assert(!sNode.data.isVisible, "Rhodes001 is not visible");
      assert(!edges[0].data.isVisible, "Edge is not visible");
      assert
      resume();
      }, 0);
  });
};
