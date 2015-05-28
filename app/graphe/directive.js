(function(){
	angular.module("synergy")
	.directive("synerGraph", ["Data", function(Data){
		return {
			restrict: "EA",
			link: function(scope, element){

				function linkDistance(link){
					return link.distance * link.distance * scope.linkDistanceFactor; //link.distance/scope.linkDistanceFactor;
				}

				function nodeCharge(node){
					return node.charge * 1000 * -1 * scope.nodeChargeFactor; //node.charge*-scope.nodeChargeFactor;
				}

				//Parameters
				scope.linkDistanceFactor = 1;
				scope.nodeChargeFactor = 1;

				scope.$watchGroup(["linkStrength", "linkDistanceFactor", "nodeChargeFactor", "gravity"], function(){
					force.start();
				});

				function linkify(){
					link = link.data(force.links(), function(d) { return d.source.title + "-" + d.target.title; });
					link
						.enter()
						.insert("line", ".node")
						.attr("class", "link")
						.style({
							"stoke-width": 3,
							stroke: "black"
						});
					link.exit().remove();

					link.append("title")
						.text(function(d){return d.distance;});
				}

				function nodify(){
					node = node.data(force.nodes(), function(d) { return d.title;});
					node.enter().append("circle").attr("class", "node").attr("r", 8).call(force.drag);
					node.exit().remove();

					node.append("title")
                		.text(function(d) { return d.title; });
				}

				var width = $("body").width(),
					height = $("body").height(),
					force = d3.layout.force()
							.nodes(Data.nodes)
						    .links(Data.links)
						    .size([width, height])
						    .linkDistance(linkDistance)
						    .charge(nodeCharge)
						    .gravity(1)
						    .alpha(1)
						    .start(),
					svg = d3.select("syner-graph").append("svg")
							.attr("width", width)
							.attr("height", height),
					link = svg.selectAll(".link"),
					node = svg.selectAll(".node");

					linkify();
					nodify();

				node.append("title")
					.text(function(d){return d.title;});

				force.on("tick", function(){
					link.attr("x1", function(d) { return d.source.x; })
	                    .attr("y1", function(d) { return d.source.y; })
	                    .attr("x2", function(d) { return d.target.x; })
	                    .attr("y2", function(d) { return d.target.y; });
                    
                    node.attr("cx", function(d) { return d.x; })
                    	.attr("cy", function(d) { return d.y; });
				});

				scope.$on("stop-graph", function(){
					force.stop();
				});

				scope.$on("update-graph", function(){
					linkify();
					nodify();

					force.start();
				});
			}
		};
	}]);
})();