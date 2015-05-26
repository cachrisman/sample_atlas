var tSamples = 
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
      var samples = getSamples("./samples.json");
      console.log("samples: ", samples);
      assert(samples.length === tSamples.length &&
             samples[0].id != null, "getSampleFile returns the samples array");
      resume();
      }, 0);
  });
};
