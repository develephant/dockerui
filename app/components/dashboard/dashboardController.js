angular.module('dashboard', [])
    .controller('DashboardController', ['$scope', '$log', 'Container', 'Settings', function ($scope, $log, Container, Settings) {
        $scope.$log = $log;

        $scope.predicate = '-Created';
        $scope.containers = [];

        var getStarted = function (data) {
            $scope.totalContainers = data.length;
        };

        if (Settings.firstLoad) {
            Settings.firstLoad = false;
        }

        Container.query({all: 1}, function (d) {
            var running = 0;
            var ghost = 0;
            var stopped = 0;

            for (var i = 0; i < d.length; i++) {
                var item = d[i];

                if (item.Status === "Ghost") {
                    ghost += 1;
                } else if (item.Status.indexOf('Exit') !== -1) {
                    stopped += 1;
                } else {
                    running += 1;
                    $scope.containers.push(new ContainerViewModel(item));
                }
            }

            getStarted(d);
        });
    }]);
