(function(){
	angular.module("synergy")
	.service("Data", ["$rootScope", function($rootScope){
		var serv = this,
			defaultLink = {
				source: {},
				target: {},
				distance: 0
			},
			defaultNode = {
				charge: 1,
				title: "Default",
				currentSynergy: 0
			};

		serv.nodes = [];
		serv.links = [];

		serv.createNewNode = function(){
			return $.extend(true, {}, defaultNode);
		};

		serv.createNewLink = function(){
			return $.extend(true, {}, defaultLink);
		};

		serv.add = function(node, links, removeLinks){
			var indexs = [], i = 0;
			$rootScope.$broadcast("stop-graph");

			if(node.index === undefined) serv.nodes.push(node);

			serv.links.forEach(function(link){
				removeLinks.some(function(distant){
					if(link === distant){
						indexs.push(i);
						return true;
					}
				});
				i++;
			});

			for (var i = indexs.length - 1; i >= 0; i--) {
				serv.links.splice(indexs[i], 1);
			};

			Array.prototype.push.apply(serv.links, links);

			$rootScope.$broadcast("update-graph");
		};

		serv.resetWith = function(newDatas){
			$rootScope.$broadcast("stop-graph");

			newDatas.links.forEach(function(link){
				link.source = newDatas.nodes[link.source.index];
				link.target = newDatas.nodes[link.target.index];
			});

			serv.nodes.length = 0;
			serv.links.length = 0;

			Array.prototype.push.apply(serv.nodes, newDatas.nodes);
			Array.prototype.push.apply(serv.links, newDatas.links);

			$rootScope.$broadcast("update-graph");
		};

		serv.remove = function(node){
			$rootScope.$broadcast("stop-graph");

			var linksToRemove = [],
				i = 0;
			serv.links.forEach(function(link){
				if(link.source.index === node.index || link.target.index === node.index){
					linksToRemove.push(i);
				}
				i++;
			});
			for(i=linksToRemove.length-1; i >= 0; i--){
				serv.links.splice(linksToRemove[i], 1);
			}

			i = 0;
			serv.nodes.some(function(item){
				if(item.index === node.index){
					serv.nodes.splice(i, 1);
					return true;
				}
				i++
				return false;
			});

			$rootScope.$broadcast("update-graph");
		};
	}]);
})();