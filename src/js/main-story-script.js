var smallScreen = window.innerWidth <= 500 ? true : false;

// Grave Demo 
var graveDemoWidth = document.querySelector("#grave-demo").clientWidth;
var graveDemoHeight = document.querySelector("#grave-demo").clientHeight;

var graveDemoMargin = {
    top: smallScreen ? 10 : 30,
    right: smallScreen ? 5 : 30,
    bottom: smallScreen ? 5 : 30,
    left: smallScreen ? 5 : 30
}

var boundedgraveDemoWidth = graveDemoWidth - graveDemoMargin.right - graveDemoMargin.left;
var boundedgraveDemoHeight = graveDemoHeight - graveDemoMargin.bottom - graveDemoMargin.top;

var graveDemoSvg = d3.select("#grave-demo").append("svg")
    .attr("id", "graveDemoSvg")
    .attr("width", graveDemoWidth)
    .attr("height", graveDemoHeight)
    .attr('viewBox', [0, 0, graveDemoWidth*1.5, graveDemoHeight*1.5]);

if (smallScreen) {
    graveDemoSvg 
    .attr('viewBox', [0, 0, graveDemoWidth, graveDemoHeight]);
}

var graveDemoBounds = graveDemoSvg.append("g")
    .attr("transform", `translate(${graveDemoMargin.left}, ${graveDemoMargin.top})`);


// Grave Map 
var graveMapWidth = window.innerWidth;
var graveMapHeight = smallScreen ? graveMapWidth*0.6 : graveMapWidth*0.5;
var graveMapMargin = {
    top: smallScreen ? 5 : 50,
    right: smallScreen ? 25 : 60,
    bottom: smallScreen ? 30 : 50,
    left: smallScreen ? 0 : 30
}

var graveMapXScale = d3.scaleLinear();
var graveMapYScale = d3.scaleLinear();

var boundedgraveMapWidth = graveMapWidth - graveMapMargin.right - graveMapMargin.left;
var boundedgraveMapHeight = graveMapHeight - graveMapMargin.bottom - graveMapMargin.top;

var graveMapXAccessor = d => +d.x;
var graveMapYAccessor = d => +d.y;
var graveMapColorAccessor = d => d.religion;

var graveMapSvg = d3.select("#grave-map").append("svg")
    .attr("width", graveMapWidth)
    .attr("height", graveMapHeight)
    .attr('viewBox', [0, 0, graveMapWidth, graveMapHeight]);

var graveMapBounds = graveMapSvg.append("g")
    .attr("transform", `translate(${graveMapMargin.left}, ${graveMapMargin.top})`);

var graveMapColorScale = d3.scaleOrdinal()
    .domain(["C", "P"])
    .range(["#998675", "#999999"]);

/* ADD A TOOLTIP TO THE RECT */
var tooltip = d3.select("#grave-map")
    .append("div")
    .attr("class", "tooltip");

d3.csv("./src/assets/gravemap.csv").then(function(data){{

    data = data.filter(d => d.x !== "");

    //Grave Map
    graveMapXScale.domain([0, d3.max(data, graveMapXAccessor)]);
    graveMapYScale.domain([0, d3.max(data, graveMapYAccessor)]);

        graveMapXScale
            .range([0, boundedgraveMapWidth]);
        graveMapYScale
            .range([boundedgraveMapHeight, 0]);

    drawGraveMap(data, graveDemoBounds);
    drawGraveMap(data, graveMapBounds);

}})


function drawGraveMap(data, boundsName) {

        var bounds = boundsName; 
        var rectgraveMapWidth = smallScreen ? 20 : 38;
        var rectgraveMapHeight =smallScreen ? 10 : 20;
        var padding = 5;

        var rectsG = bounds.selectAll(".rectangleG")
            .data(data).enter()
            .append("g")
            .attr("class", "rectangleG");

        var rects = rectsG.append("rect")
            .attr("class", "rects")
            .attr("id", function(d) {
                if (d["Burial Plot Number"] == "C-154"){
                    return "C154";
                }
            })
            .attr("fill", d => graveMapColorScale(graveMapColorAccessor(d)))
            .attr("x", function(d){ 
                    return graveMapXScale(graveMapXAccessor(d)) - rectgraveMapWidth / 2 + padding;  
             })
            .attr("y", function(d){
                    return graveMapYScale(graveMapYAccessor(d)) + rectgraveMapHeight / 2 + padding;
            })
            .attr("width", rectgraveMapWidth)
            .attr("height",rectgraveMapHeight);


        var rectsLabel = rectsG.append("text")
            .attr("class", "rectsLabels")
            .text(d => d["Burial Plot Number"].split("-").join(""))
            .attr("x", function(d){ 
                    return graveMapXScale(graveMapXAccessor(d)) + padding;  
             })
            .attr("y", function(d){
                    return graveMapYScale(graveMapYAccessor(d)) + rectgraveMapHeight / 2 + padding;
            })
            .attr("text-anchor", "middle")
            .attr("baseline-shift", "-100%")
            .style("pointer-events", "none");

        if (bounds == graveMapBounds){

        rectsG.selectAll("rect").on("mouseover", function (d) {

            var x = graveMapXScale(graveMapXAccessor(d)) + rectgraveMapWidth + 20;
            var y = graveMapYScale(graveMapYAccessor(d)) + rectgraveMapHeight / 2 + 5;
            
            tooltip.style("visibility", "visible")
                .style("left", x + "px")
                .style("top", y + "px")
                .html(function () {

                    var description = "Name: " + d.Name + "</br>"
                    +"Birth Date: " + d["Birth Date"] + "</br/>"
                    +"Death Date: " + d["Death Date"]

                    return description;

                });


            d3.selectAll(".rects").attr("opacity", 0.2);

            d3.select(this)
            .attr("opacity", 1);

        }).on("mouseout", function () {
            tooltip.style("visibility", "hidden");
            d3.selectAll(".rects").attr("opacity", 1);
        });

        }

    };


    var $demoMap1 = $("#demoMap1");
    var $demoMap2 = $("#demoMap2");
    var $demoMap3 = $("#demoMap3");


        $demoMap1.waypoint(function (direction){

            if (direction == "down"){
                $("p#demoMap1").addClass("right-paragraph-full-opacity");
            }

            if (direction == "up"){
                $("p#demoMap1").removeClass("right-paragraph-full-opacity");
            }

        }, {offset: "60%"})


        $demoMap2.waypoint(function (direction) {


            if (direction == "down") {

                if (smallScreen) {

                    graveDemoSvg
                     .attr('viewBox', [0, 0, graveDemoWidth, graveDemoHeight]);

                } else {

                    graveDemoSvg
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(3000)
                        .attr('viewBox', [graveDemoWidth/2, 0, graveDemoWidth*1.5, graveDemoHeight*1.5]);
                     
                }
            }



            if (direction == "up") {

                 if (smallScreen) {

                    graveDemoSvg
                     .attr('viewBox', [0, 0, graveDemoWidth, graveDemoHeight]);

                } else {

                    graveDemoSvg
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(500)
                    .attr('viewBox', [0, 0, graveDemoWidth*1.5, graveDemoHeight*1.5]);
                     
                }
                
            }



        }, { offset: smallScreen ? "80%" : "40%"});


        $demoMap2.waypoint(function (direction){


            if (direction == "down"){
                $("p#demoMap2").addClass("right-paragraph-full-opacity");

                graveDemoBounds.selectAll(".rectangleG")
                    .style("opacity", function(d){

                        if(d["Burial Plot Number"]  == "V" || d["Burial Plot Number"]  == "W"|| d["Burial Plot Number"]  == "Q"|| d["Burial Plot Number"] == "F"){
                            return 1;
                        }

                        else {
                            return 0.3;
                        }

                    });

                 if (smallScreen) {

                    graveDemoSvg
                     .attr('viewBox', [0, 0, graveDemoWidth, graveDemoHeight]);

                } else {

                 graveDemoSvg
                .transition()
                .ease(d3.easeLinear)
                .duration(500)
                .attr('viewBox', [graveDemoWidth, 50, graveDemoWidth, graveDemoHeight]);
                     
                }

            }

            if (direction == "up"){
                $("p#demoMap2").removeClass("right-paragraph-full-opacity");
                graveDemoBounds.selectAll(".rectangleG")
                    .style("opacity", 0.9);

                if (smallScreen) {

                    graveDemoSvg
                     .attr('viewBox', [0, 0, graveDemoWidth, graveDemoHeight]);

                } else {

                    graveDemoSvg
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(500)
                        .attr('viewBox', [graveDemoWidth/2, 0, graveDemoWidth*1.5, graveDemoHeight*1.5]);
                     
                }
            }
            

        }, {offset: smallScreen ? "60%" : "40%"})

        $demoMap3.waypoint(function (direction){

            if (direction == "down"){
                $("p#demoMap3").addClass("right-paragraph-full-opacity");


                graveDemoBounds.selectAll(".rectangleG")
                    .style("opacity", function(d){

                        if(d["Burial Plot Number"]  == "C-154"){
                            return 1;
                        }

                        else {
                            return 0.3;
                        }

                    });

                 if (smallScreen) {

                    graveDemoSvg
                     .attr('viewBox', [0, 0, graveDemoWidth, graveDemoHeight]);

                } else {

                graveDemoSvg
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(500)
                    .attr('viewBox', zoomIn("C154"));
                     
                }

               
            }

            if (direction == "up"){
                $("p#demoMap3").removeClass("right-paragraph-full-opacity");

                 graveDemoBounds.selectAll(".rectangleG")
                    .style("opacity", function(d){

                        if(d["Burial Plot Number"]  == "V" || d["Burial Plot Number"]  == "W"|| d["Burial Plot Number"]  == "Q"|| d["Burial Plot Number"] == "F"){
                            return 1;
                        }

                        else {
                            return 0.3;
                        }

                    });


                    if (smallScreen) {

                        graveDemoSvg
                         .attr('viewBox', [0, 0, graveDemoWidth, graveDemoHeight]);

                    } else {

                            graveDemoSvg
                                .transition()
                                .ease(d3.easeLinear)
                                .duration(500)
                                .attr('viewBox', [graveDemoWidth-100, 0, graveDemoWidth, graveDemoHeight]);
                             
                        }

          
            }

        }, {offset: smallScreen ? "60%" : "30%"})
   


function zoomIn(elementID) {
// zooming in part
var currentElement= document.getElementById(elementID),
    s = currentElement.getBBox(),
    newView = [ s.x - 50,  s.y + 30, (s.width + 300), (s.height + 100) ]
    return newView;

}


var slideIndex = [1,1,1];
var slideId = ["image-slides1", "image-slides2", "image-slides3"]
showSlides(1, 0);
showSlides(1, 1);
showSlides(1, 2);

function plusSlides(n, no) {
  showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
  var i;
  var x = document.getElementsByClassName(slideId[no]);
  var captionText = document.getElementById(slideId[no]+"-caption");
  if (n > x.length) {slideIndex[no] = 1}    
  if (n < 1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }
  x[slideIndex[no]-1].style.display = "block";  
  captionText.innerHTML = x[slideIndex[no]-1].lastElementChild.alt;
}

// calculate h2 position

function calH2Position(){
        var contentWidth = document.querySelector("section #content-first").clientWidth;
        d3.selectAll("section .h2-container")
        .style("width", `${contentWidth}px`);
}

calH2Position()

