window.onload = function() {
  test("Atlas Construction & Initialization", function() {
    pause();
    setTimeout(function() {
      var samples = getSamples("./samples.json");
      assert(samples !== undefined, "Samples loaded");
      var atlas = buildAtlas(samples);
      assert(atlas !== undefined, "buildAtlas() returns a new atlas");
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
