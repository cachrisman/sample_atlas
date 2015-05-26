window.onload = function() {
  test("Atlas Construction & Initialization", function() {
    pause();
    setTimeout(function() {
      var samples = getSamples("./samples.json");
      assert(samples.length > 0, "Samples loaded");
      var atlas = buildAtlas(samples);
      assert(atlas !== undefined, "buildAtlas() returns a new atlas");
      var id = samples[0].id;
      var sNode = atlas.getNode(id);
      assert(sNode.name === id, "Sample node added to atlas");
      var node = atlas.getNode("Bass");
      assert(node.data.type === "macro", "Atlas has macro node");
      assert(atlas.getEdgesFrom(node).length === 1, "Macro node has sample");
      var node = atlas.getNode("Analog Bass");
      assert(node.data.type === "messo", "Atlas has a messo node");
      assert(atlas.getEdgesFrom(node).length === 1, "Messo node has sample");
      var node = atlas.getNode("FM");
      assert(node.data.type === "micro", "Atlas has a micro node");
      assert(atlas.getEdgesFrom(node).length === 1, "Micro node has sample");
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
