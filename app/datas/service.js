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
				charge: 0,
				title: "Default",
				currentSynergy: 0
			};

		serv.nodes = [{charge:3, title:"Athreos"}];
		serv.links = [];

		serv.createNewNode = function(){
			return $.extend(true, {}, defaultNode);
		};

		serv.createNewLink = function(){
			return $.extend(true, {}, defaultLink);
		};

		serv.add = function(node, links){
			$rootScope.$broadcast("stop-graph");

			serv.nodes.push(node);
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
	}]);
})();