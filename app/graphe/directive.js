(function(){
	angular.module("synergy")
	.directive("synerGraph", ["Data", function(Data){

		function linkDistance(link){
			return link.distance*10;
		}

		function nodeCharge(node){
			return node.charge*-1000;
		}

		return {
			restrict: "EA",
			scope: {},
			link: function(scope, element){

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
				}

				function nodify(){
					node = node.data(force.nodes(), function(d) { return d.title;});
					node.enter().append("circle").attr("class", "node").attr("r", 8).call(force.drag);
					node.exit().remove();

					node.append("title")
                		.text(function(d) { return d.title; });
				}

				var force = d3.layout.force()
							.nodes(Data.nodes)
						    .links(Data.links)
						    .size([500, 500])
						    .linkStrength(1)
						    .linkDistance(linkDistance)
						    .charge(nodeCharge)
						    .gravity(1)
						    .start(),
					svg = d3.select("syner-graph").append("svg")
							.attr("width", 500)
							.attr("height", 500),
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