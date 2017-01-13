let oMCtrl = oM.controller('oMCtrl', ['$scope', '$http', '$location', '$rootScope', '$timeout', '$route', '$interval', 'ngDialog', 'w', 'caching', 'changeview', function ($scope, $http, $location, $rootScope, $timeout, $route, $interval, ngDialog, w, caching, changeview) {
    var iam = this;
    if (typeof iam.imgStretched === 'undefined') {
        iam.w = w;
        if ($route.current.loadedTemplateUrl === 'views/login.html') {
            iam.imgStretched = $.backstretch('img/1.jpg');
        }
        else {
            $('.backstretch').remove();
        };
        iam.signIn = function () {
            w.viewLogin.phU.v = $('#phU').val();
            w.viewLogin.phP.v = $('#phP').val();
            (function () {
                $('.backstretch').remove();
                changeview($location, '/start');
            }());
        };
    };
}]);
let oStartCtrl = oM.controller('oStartCtrl', ['$scope', '$http', '$location', '$rootScope', '$timeout', '$route', '$interval', 'ngDialog', 'w', 'caching', 'csvToArray', 'csvToJson', 'getJsonFile', function ($scope, $http, $location, $rootScope, $timeout, $route, $interval, ngDialog, w, caching, csvToArray, csvToJson, getJsonFile) {
    var iam = this;
    if (typeof iam.changeView === 'undefined') {
        // Loading data into cache, also storing the indicators for resolved
        //using sessionStorage
        caching.setCache('sessionStorage', 'employeesIndicator', false, true);
        caching.setCache('sessionStorage', 'issuesIndicator', false, true);
        let employees;
        let issues;
        new Promise(function (resolve, reject) {
            resolve(function () { employees = getJsonFile('https://chicagodata.blob.core.windows.net/data/employees.json'); }())
        }).then(function (result) {
            caching.setCache('sessionStorage', 'employees', JSON.stringify(employees), true);
            caching.setCache('sessionStorage', 'employeesIndicator', true, true);
            new Promise(function (resolve, reject) {
                resolve(function () {
                    issues = csvToJson('https://chicagodata.blob.core.windows.net/data/Issues0.csv');
                }())
            }).then(function (result) {
                caching.setCache('sessionStorage', 'issues', JSON.stringify(issues), true);
                caching.setCache('sessionStorage', 'issuesIndicator', true, true);
                new Promise(function (resolve, reject) {
                    resolve(function () {
                    }())
                }).then(function (result) {
                    iam.changeView = function (view) { $location.url(view); };
                    iam.getMaps = function () {
                        iam.changeView('/maps');
                    };
                    iam.getCharts = function () {
                    iam.changeView('/charts');
                    };
                    iam.getDetails = function () {
                        iam.changeView('/details');
                    };
                    iam.redirect = function (v) {
                        switch (v) {
                            case 'errorLogs':
                                iam.changeView('/errorLogs');
                                break;
                            case 'eventLogs':
                                iam.changeView('/errorLogs');
                                break;
                            default:
                                break;
                        };
                    };
                }, function (err) { });
            }, function (err) { });
        }, function (err) { });
    };
}]);
let oMapsCtrl = oM.controller('oMapsCtrl', ['$scope', '$http', '$location', '$rootScope', '$timeout', '$route', '$interval', 'ngDialog', 'NgMap', 'w', 'caching', 'toUSD', 'getJsonFile', function ($scope, $http, $location, $rootScope, $timeout, $route, $interval, ngDialog, NgMap, w, caching, toUSD, getJsonFile) {
    let iam = this;
    if (typeof iam.changeView === 'undefined') {
        iam.changeView = function (view) { $location.url(view); };
        iam.getMenu = function () {
            iam.changeView('/start');
        };
        iam.startlocation = new google.maps.LatLng(40.7125031, -74.0100727999999);
        iam.w = $('#map').width();
        iam.convertToCurrency = function (n) {
            return toUSD(n);
        };
        //https://ngmap.github.io/#/!infowindow-simple-max.html
        iam.offices = [];
        iam.office = {};
        new Promise(function (resolve, reject) {
            resolve(function () {
                iam.offices = caching.getCache('sessionStorage', 'employees');
                iam.office = iam.offices[0];
                iam.showDetail = function (e, office) {
                    iam.office = office;
                    iam.map.showInfoWindow('foo-iw', office.id);
                };
                iam.hideDetail = function () {
                    iam.map.hideInfoWindow('foo-iw');
                };
                let c = 1;
                $interval(
                    function () {
                        if ($location.url() === '/maps') {
                            let tD = [];
                            let tAdd = {};
                            new Promise(function (resolve, reject) {
                                resolve(function () {
                                    tAdd = getJsonFile('https://chicagodata.blob.core.windows.net/data/employees' + c + '.json');
                                }())
                            }).then(function (result) {
                                tD = caching.getCache('sessionStorage', 'employees');
                            }, function (err) { }).then(function (result) {
                                tD.push(tAdd);
                                caching.setCache('sessionStorage', 'employees', JSON.stringify(tD), true);
                                iam.offices = tD;
                            }, function (err) { });
                            c += 1;
                        };
                    }, 5000, 5);
            }());
        }).then(function (result) {
            NgMap.getMap().then(function (map) {
                 iam.map = map;
            });
        }, function (err) { });
    };
}]);
let oChartsCtrl = oM.controller('oChartsCtrl', ['$scope', '$http', '$location', '$rootScope', '$timeout', '$route', '$interval', '$filter', 'ngDialog', 'w', 'caching', 'getOpenClosedIssues', 'dataGrouping', 'csvToJson', function ($scope, $http, $location, $rootScope, $timeout, $route, $interval, $filter, ngDialog, w, caching, getOpenClosedIssues, dataGrouping, csvToJson) {
    var iam = this;
    if (typeof iam.changeView === 'undefined') {
        iam.changeView = function (view) { $location.url(view); };
        iam.getMenu = function () {
            iam.changeView('/start');
        };
        iam.url = 'views/chartsoi.html';
        if (window.innerHeight >= 500){ iam.h = 100;}else{iam.h = window.innerHeight * 0.75;};
        iam.getView = function (e) {
            iam.url = 'views/' + e.target.id + '.html';
        };
        ////////////////// Structuring the data
        iam.issues = caching.getCache('sessionStorage', 'issues');
        new Promise(function (resolve, reject) {
            resolve(function () {
                ////////////////////////////// OI
                iam.OCI = getOpenClosedIssues(iam.issues);
            }());
        }).then(function (result) {
            iam.oiLabels = ["Open Issues", "Closed Issues"];
            iam.oiData = [iam.OCI.open, iam.OCI.closed];
            new Promise(function (resolve, reject) {
                resolve(function () {
                    ///////////////////////////// PC
                    iam.PC = dataGrouping(iam.issues, $filter);
                }());
            }).then(function (result) {
                iam.pcLabels = iam.PC.arrMonthCTData.arrLabels;
                iam.pcSeries = ['Paid customers', 'Total $ received'];
                iam.pcData = [
                  iam.PC.arrMonthCTData.arr0,
                  iam.PC.arrMonthCTData.arr1
                ];
                iam.pcOnClick = function (points, evt) {
                    //console.log(points, evt);
                };
                iam.pcDatasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
                iam.pcOptions = {
                    scales: {
                        yAxes: [
                          {
                              id: 'y-axis-1',
                              type: 'linear',
                              display: true,
                              position: 'left'
                          },
                          {
                              id: 'y-axis-2',
                              type: 'linear',
                              display: true,
                              position: 'right'
                          }
                        ]
                    }
                };
                //////////////////////////// RI
                iam.riLabels = iam.PC.arrMonthSTData.arrLabels;
                iam.riSeries = ['Open issues', 'Resolved post fact um issues'];
                iam.riData = [
                   iam.PC.arrMonthSTData.arr0,
                  iam.PC.arrMonthSTData.arr1
                ];
            }, function (err) { });
        }, function (err) { });
        iam.OCI;
        iam.PC;
        let c = 0;
        let p = 0;
        $interval(function () {
            if ($location.url() === '/charts') {
                let issues;
                //buffer
                if (c === 6) { c = 0; p = 1; }; //else {p = 1};
                // initializing
                if (p === 0 && c === 0) {
                    // do nothing
                } else {
                    new Promise(function (resolve, reject) {
                        resolve(function () {
                            issues = csvToJson('https://chicagodata.blob.core.windows.net/data/Issues' + c + '.csv');
                        }())
                    }).then(function (result) {
                        iam.issues = issues;
                        new Promise(function (resolve, reject) {
                            resolve(function () {
                                ////////////////////////////// OI
                                iam.OCI = getOpenClosedIssues(iam.issues);
                            }());
                        }).then(function (result) {
                            iam.oiLabels = ["Open Issues", "Closed Issues"];
                            iam.oiData = [iam.OCI.open, iam.OCI.closed];
                            new Promise(function (resolve, reject) {
                                resolve(function () {
                                    ///////////////////////////// PC
                                    iam.PC = dataGrouping(iam.issues, $filter);
                                }());
                            }).then(function (result) {
                                iam.pcLabels = iam.PC.arrMonthCTData.arrLabels;
                                iam.pcSeries = ['Paid customers', 'Total $ received'];
                                iam.pcData = [
                                  iam.PC.arrMonthCTData.arr0,
                                  iam.PC.arrMonthCTData.arr1
                                ];
                                iam.pcOnClick = function (points, evt) {
                                    //console.log(points, evt);
                                };
                                iam.pcDatasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
                                iam.pcOptions = {
                                    scales: {
                                        yAxes: [
                                          {
                                              id: 'y-axis-1',
                                              type: 'linear',
                                              display: true,
                                              position: 'left'
                                          },
                                          {
                                              id: 'y-axis-2',
                                              type: 'linear',
                                              display: true,
                                              position: 'right'
                                          }
                                        ]
                                    }
                                };
                                //////////////////////////// RI
                                iam.riLabels = iam.PC.arrMonthSTData.arrLabels;
                                iam.riSeries = ['Open issues', 'Resolved post fact um issues'];
                                iam.riData = [
                                   iam.PC.arrMonthSTData.arr0,
                                  iam.PC.arrMonthSTData.arr1
                                ];
                            }, function (err) { });
                        }, function (err) { });
                    }, function (err) {
                        console.log(err);
                    });
                };
                c += 1;
            };
        }, 5000);
    };
}]);
let oDetailsCtrl = oM.controller('oDetailsCtrl', ['$scope', '$http', '$location', '$rootScope', '$timeout', '$route', '$interval', 'ngDialog', 'uiGridConstants', 'w', 'caching', 'csvToArray', 'csvToJson', function ($scope, $http, $location, $rootScope, $timeout, $route, $interval, ngDialog, uiGridConstants, w, caching, csvToArray, csvToJson) {
    var iam = this;
    if (typeof iam.changeView === 'undefined') {
        iam.changeView = function (view) { $location.url(view); };
        iam.getMenu = function () {
            iam.changeView('/start');
        };
        /////////// Grid
        iam.gridOptions = {
            enableFiltering: true,
            flatEntityAccess: true,
            showGridFooter: true,
            fastWatch: false
        };
        iam.gridOptions.columnDefs = [
    { field: 'submission timestamp', displayName: 'Submitted', width: 200, pinnedRight: true },
    { name: 'customer name', displayName: 'Customer', width: 200, pinnedRight: true },
    { name: 'customer email address', displayName: 'Email', width: 200, pinnedRight: true },
    { name: 'description', displayName: 'Description', width: 200, pinnedRight: true },
    { name: 'open/closed status', displayName: 'Status', width: 200, pinnedRight: true },
    { name: 'closed timestamp', displayName: 'Closed', width: 200, pinnedRight: true }
        ];
        iam.gridOptions.data = [];
        iam.gridOptions.data = csvToJson('https://chicagodata.blob.core.windows.net/data/Issues0.csv');
        iam.hideTable = false;
        iam.showData = function () {
            iam.hideTable = !iam.hideTable;
        };

    };
}]);