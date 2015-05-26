var tFile = {
  samples:
  [ 
    {
    name: "bass001", 
    macro: "Bass",
    messo: "Analog Bass", 
    micro: ["Dry"], 
    technical: [""], 
    filePath: "./samples/bass001" 
    }
  ]
}

window.onload = function() {
  test("Sample Construction & Initialization", function() {
    pause();
    setTimeout(function() {
      var sample = new Sample("foo", "Bass", ["Analog Bass"], ["FM"], ["Edirol"], "./samples/test.wav");
      assert(sample.constructor === Sample, "Instance of sample points to Sample constructor");
      resume();
      }, 0);
  });
  test("Sample Getters/Setters", function() {
    pause();
    setTimeout(function() {
      var sFile = getSamples("./samples.json");
      console.log("sFile: ", sFile);
      assert(sFile.samples.length === tFile.samples.length, "getSampleFile returns the samples array");
      resume();
      }, 0);
  });
};
