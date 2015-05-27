(function() {

  var Renderer = function(canvas) {
    canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d")
    var particleSystem = null
    
    var that = {

      init: function(system){
        particleSystem = system
        particleSystem.screen({padding:[100, 60, 60, 60], // leave some space at the bottom for the param sliders
                               step:.02}) // have the ‘camera’ zoom somewhat slowly as the graph unfolds 
        $(window).resize(that.resize)
        that.resize()
        
        // that.initMouseHandling()
      },

      redraw: function(){
        if (particleSystem===null) return

        ctx.clearRect(0,0, canvas.width, canvas.height)
        ctx.strokeStyle = "#d3d3d3"
        ctx.lineWidth = 1
        ctx.beginPath()
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          var weight = null // Math.max(1,edge.data.border/100)
          var color = null // edge.data.color
          var sourceVisible = edge.source.data.isVisible;
          var targetVisible = edge.target.data.isVisible;
          if (sourceVisible && targetVisible) {
            if (!color || (""+color).match(/^[ \t]*$/)) color = null

            if (color!==undefined || weight!==undefined){
              ctx.save() 
              ctx.beginPath()

              if (!isNaN(weight)) ctx.lineWidth = weight
              
              if (edge.source.data.region==edge.target.data.region){
                ctx.strokeStyle = palette[edge.source.data.region]
              }
              
              // if (color) ctx.strokeStyle = color
              ctx.fillStyle = null
              
              ctx.moveTo(pt1.x, pt1.y)
              ctx.lineTo(pt2.x, pt2.y)
              ctx.stroke()
              ctx.restore()
            }else{
              // draw a line from pt1 to pt2
              ctx.moveTo(pt1.x, pt1.y)
              ctx.lineTo(pt2.x, pt2.y)
            }
          }
        })
        ctx.stroke()

        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords
          

          // determine the box size and round off the coords if we'll be 
          // drawing a text label (awful alignment jitter otherwise...)
//          var w = ctx.measureText(node.data.label||"").width + 6
          if (node.data.isVisible) {
            var w = ctx.measureText(node.name||"").width + 6
            var label = node.name
            if (!(label||"").match(/^[ \t]*$/)){
              pt.x = Math.floor(pt.x)
              pt.y = Math.floor(pt.y)
            }else{
              label = null
            }
            
            // clear any edges below the text label
            // ctx.fillStyle = 'rgba(255,255,255,.6)'
            // ctx.fillRect(pt.x-w/2, pt.y-7, w,14)


            ctx.clearRect(pt.x-w/2, pt.y-7, w,14)

            

            // draw the text
            if (label){
              var fontSize = (node.data.isSelected || 1) * 12;
              var fontWeight = (fontSize == 12) ? "normal" : "bold";
              ctx.font = fontSize + "px Arial " + fontWeight;
              ctx.textAlign = "center"
              
              // if (node.data.region) ctx.fillStyle = palette[node.data.region]
              // else ctx.fillStyle = "#888888"
              ctx.fillStyle = "#888888"

              // ctx.fillText(label||"", pt.x, pt.y+4)
              ctx.fillText(label||"", pt.x, pt.y+4)
            }
          }
        })    
      },
      
      resize:function(){
        var w = $(window).width(),
            h = $(window).height();
        canvas.width = w; canvas.height = h // resize the canvas element to fill the screen
        particleSystem.screenSize(w,h) // inform the system so it can map coords for us
        that.redraw()
      }

    }
  
    return that
  };
  
  $(document).ready(function(){
    var demoSamples = getSamples("../demo/samples.json");
    var atlas = buildAtlas(demoSamples);

   // Our newly created renderer will have its .init() method called shortly by 
    atlas.renderer = Renderer("#viewport")

  })
                                      
})()
