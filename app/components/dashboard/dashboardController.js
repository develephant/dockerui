angular.module('dashboard', [])
    .controller('DashboardController', ['$scope', '$log', 'Container', 'Settings', function ($scope, $log, Container, Settings) {
        $scope.$log = $log;

        $scope.predicate = '-Created';
        $scope.containers = [];
        $scope.options = {};

        $scope.doShowOptions = function(containerId) {
          Container.get({id: containerId}, function (d) {
              $log.log( d );
              //$scope.options = d;
          }, function (e) {
              if (e.status === 404) {
                  //Messages.error("Not found", "Container not found.");
              } else {
                  //Messages.error("Failure", e.data);
              }
          });
        };

        $scope.doContainerStart = function(containerId, containerHostConfig) {
          $log.log(containerId, containerHostConfig);
          Container.start({
              id: containerId,
              HostConfig: containerHostConfig
          }, function (d) {
              //Messages.send("Container started", containerId);
          }, function (e) {
              //Messages.error("Failure", "Container failed to start." + e.data);
          });
        };

        $scope.doContainerStop = function(containerId) {
          Container.stop({id: containerId}, function (d) {
              //Messages.send("Container stopped", containerId);
          }, function (e) {
              //Messages.error("Failure", "Container failed to stop." + e.data);
          });
        }

        $scope.doContainerPause = function(containerId) {
          Container.pause({id: containerId}, function (d) {
              //Messages.send("Container paused", containerId);
          }, function (e) {
              //Messages.error("Failure", "Container failed to pause." + e.data);
          });
        }

        $scope.doContainerUnpause = function(containerId) {
          Container.unpause({id: containerId}, function (d) {
              //Messages.send("Container unpaused", containerId);
          }, function (e) {
              //Messages.error("Failure", "Container failed to unpause." + e.data);
          });
        }

        $scope.doContainerDelete = function(containerId) {
          Container.remove({id: containerId}, function (d) {
              //Messages.send("Container removed", containerId);
          }, function (e) {
              //Messages.error("Failure", "Container failed to remove." + e.data);
          });
        }

        $scope.doContainerRestart = function(containerId) {
          Container.restart({id: containerId}, function (d) {
              //Messages.send("Container restarted", containerId);
          }, function (e) {
              //Messages.error("Failure", "Container failed to restart." + e.data);
          });
        }

        $scope.doContainerKill = function(containerId) {
          Container.kill({id: containerId}, function (d) {
              //Messages.send("Container killed", containerId);
          }, function (e) {
              //Messages.error("Failure", "Container failed to die." + e.data);
          });
        }

        $scope.doContainerCommit = function(containerId, containerConfigImage) {
          ContainerCommit.commit({id: containerId, repo: containerConfigImage}, function (d) {
              //Messages.send("Container commited", containerId);
          }, function (e) {
              //Messages.error("Failure", "Container failed to commit." + e.data);
          });
        }

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
                item.Index = i;
                
                item.IconFill = "green";
                if (item.Status === "Ghost") {
                    ghost += 1;
                    item.IconFill = "grey";
                } else if (item.Status.indexOf('Exit') !== -1) {
                    stopped += 1;
                    item.IconFill = "red";
                } else {
                    running += 1;
                }
                
                $scope.containers.push(new ContainerViewExtModel(item));
            }

            $scope.runningContainers = running;
            $scope.stoppedContainers = stopped;
            $scope.ghostContainers = ghost;

            getStarted(d);
        });
    }]);
