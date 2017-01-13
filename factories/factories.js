oM.factory('w', function () {
    var engLang = {
        viewLogin: {
            title: 'O2 Solutions',
            phU: { f: 'Username', v: '', c: 'n', inv : 'Invalid account name' },
            phP: { f: 'Password', v: '', c: 'n', inv: 'Invalid password' },
            signIn: 'Sign in',
            passForget: 'Forgot Password',
            loadingImg0: { h: true, v: 'img/l0.gif' }
        },
        ID: '',
        buttons: {
            signIn: { v: 'Sign in', p: false, img: 'img/l0.gif' }
        },
        gW: { connectionIssues: 'connection issues, try again', enterUP: 'Enter account and password', enterU: 'Enter account', enterP: 'Enter password', logStr: 'Please wait while logging', invl: 'Entered account and password are invalid', tblNoSelection: 'Please select some data fields' }
    }
    var r = engLang;
    r.windowTimeOpen = 2200;
    return r;
});
oM.factory('changeview', function () {
    return function (l,v) {
        l.url(v);
    };
});
oM.factory('csvToArray', function () {
    return function (url) {
        let r = [];
        function processData(allText) {
            let allTextLines = allText.split(/\r\n|\n/);
            let headers = allTextLines[0].split(',');
            for (let i = 1; i < allTextLines.length; i++) {
                let data = allTextLines[i].split(',');
                if (data.length == headers.length) {
                    let tarr = [];
                    for (let j = 0; j < headers.length; j++) {
                        tarr.push(headers[j] + ":" + data[j]);
                    };
                    r.push(tarr);
                };
            };
        };
        function setHeader(xhr) {
            xhr.setRequestHeader('x-ms-version', '2014-02-14');
            xhr.setRequestHeader('MaxDataServiceVersion', '3.0');
            xhr.setRequestHeader('Accept', 'application/json;odata=nometadata');
        };
        $.ajax({
            type: "GET",
            url:url,
            dataType: "text",
            async: false,
            success: function (data) { processData(data); }
        });
        return r;
    };
});
oM.factory('csvToJson', function () {
    return function (url) {
        let rD = [];
        function processData(data) {
            rD.length = 0;
            let rows = data.split(/\r\n|\n/);
            let columns = rows[0].split(',');
            for (let i = 1; i < rows.length; i++) {
                let column = rows[i].split(',');
                if (column.length == columns.length) {
                    let object = {};
                    for (let j = 0; j < columns.length; j++) {
                        object[columns[j]] = column[j];
                    };
                    rD.push(object);
                };
            };
        };
        $.ajax({
            type: "GET",
            url: url,
            dataType: "text",
            async: false,
            success: function (data) { processData(data); }
        });
        return rD;
    };
});
oM.factory('getJsonFile', function () {
    return function (url) {
        let rD;
        function processData(data) {
            rD = JSON.parse(data);
        };
        $.ajax({
            type: "GET",
            url: url,
            dataType: "text",
            async: false,
            success: function (data) { processData(data); }
        });
        return rD;
    };
});
oM.factory('caching', function () {
    //http://www.w3schools.com/html/html5_webstorage.asp
    return {
        setCache: function (s, k, v, o) {
            c: {
                var r = {};
                //window.localStorage - stores data with no expiration date
                //window.sessionStorage - stores data for one session (data is lost when the browser tab is closed)
                if (typeof (window[s]) !== 'undefined') {
                    r.s = 'Y';
                    if (o) {
                        window[s].removeItem(k);
                        window[s].setItem(k, v);
                    } else {
                        if (typeof (window[s][k]) == 'undefined') {
                            window[s].setItem(k, v);
                        };
                    };
                    r.f = 'N'
                    return r;
                    break c;
                } else {
                    r.s = 'N';
                    return r;
                    break c;
                };
            };
        },
        getCache: function (s, k) {
            c: {
                if (typeof (window[s][k]) !== 'undefined') {
                    return JSON.parse(window[s][k]);
                    break c;
                } else {
                    return false;
                    break c;
                };
            };
        }
    };
});
oM.factory('updateCache', function () {
    let r = false;
    return function (caching, cacheType, cacheAction, cacheName, jsonStringifyYesNot, cacheNewData, cacheNewDataType, cacheNewDataIndexKey) {
        if (localStorage.getItem(cacheName) !== null) {
            outer: {
                switch (cacheAction.toLowerCase().trim()) {
                    case 'delete':
                        window[cacheType].removeItem(cacheName);
                        break outer;
                    case 'replace':
                        if (jsonStringifyYesNot) {
                            caching.setCache(cacheType, cacheName, JSON.stringify(cacheNewData), true);
                        } else {
                            caching.setCache(cacheType, cacheName, cacheNewData, true);
                        };
                        break outer;
                    case 'update':
                        if (cacheNewDataType.toLowerCase().trim() === 'array') {
                            let t = caching.getCache(cacheType, cacheName);
                            t[cacheNewDataIndexKey] = cacheNewData[0];
                            if (jsonStringifyYesNot) {
                                caching.setCache(cacheType, cacheName, JSON.stringify(t), true);
                            } else {
                                caching.setCache(cacheType, cacheName, t, true);
                            };
                        } else {

                        };
                        break outer;
                    default:
                        break outer;
                };
            };
        } else {
            if (jsonStringifyYesNot) {
                caching.setCache(cacheType, cacheName, JSON.stringify(cacheNewData), false);
            } else {
                caching.setCache(cacheType, cacheName, cacheNewData, false);
            };
        };
        return r;
    };
});
oM.factory('toUSD', function () {
    return function (n) {
        let number = n.toString(),
            dollars = number.split('.')[0],
            cents = (number.split('.')[1] || '') + '00';
        dollars = dollars.split('').reverse().join('')
            .replace(/(\d{3}(?!$))/g, '$1,')
            .split('').reverse().join('');
        if (cents.slice(0, 2) == '00')
        { return '$ ' + dollars }
        else
        { return '$ ' + dollars + '.' + cents.slice(0, 2); };
    };
});
oM.factory('getOpenClosedIssues', function () {
    return function (d) {
        let r = {};
        r.open = 0;
        r.closed = 0;
        let c = d.length;
        for (let i = 0; i < c; i++) {
            if (d[i]['open/closed status'] === 'Open') {
                r.open += 1;
            } else {
                r.closed += 1;
            };
        };
        return r;
    };
});
oM.factory('dataGrouping', function () {
    return function (d,f) {
        function weekNum(date) {
            return f('date')(date, 'ww');
        };
        function dayStr(n) {
            switch (n) {
                case 0:
                    return "Sunday";
                    break;
                case 1:
                    return 'Monday';
                    break;
                case 2:
                    return 'Tuesday';
                    break;
                case 3:
                    return 'Wednesday';
                    break;
                case 4:
                    return 'Thursday';
                    break;
                case 5:
                    return 'Friday';
                    break;
                case 6:
                    return 'Saturday';
                    break;
                default:
                    return '';
            }
        };
        function monthStr(n) {
            switch(n) {
                case 0:
                    return "January";
                    break;
                case 1:
                    return 'February';
                    break;
                case 2:
                    return 'March';
                    break;
                case 3:
                    return 'April';
                    break;
                case 4:
                    return 'May';
                    break;
                case 5:
                    return 'June';
                    break;
                case 6:
                    return 'July';
                    break;
                case 7:
                    return 'August';
                    break;
                case 8:
                    return 'September';
                    break;
                case 9:
                    return 'October';
                    break;
                case 10:
                    return 'November';
                    break;
                case 11:
                    return 'December';
                    break;
                default:
                    return '';
            }
        };
        let t = d;
        let c = t.length;
        // Adding JS times
        for (let i = 0; i < c; i++) {
            let st, ct, dayStrst, dayStrct, weekNumst, weekNumct, monthStrst, monthStrct, jDst, jDct, arrst, arrct;
            arrst = t[i]['submission timestamp'].split('|');
            arrct = t[i]['closed timestamp'].split('|');
            if (arrct.length > 1) {
                let dd = new Date(new Date(arrct[0]));
                t[i].ct = dd;
                t[i].ctMonth = monthStr(dd.getMonth());
                t[i].ctMonthNum = dd.getMonth();
                t[i].ctDay = dayStr(dd.getDay());
                t[i].ctDayNum = dd.getDay();
                t[i].ctWeek = weekNum(dd);
            } else {
                t[i].ct = '';
                t[i].ctMonth = '';
                t[i].ctDay = '';
                t[i].ctWeek = '';
            };
            if (arrst.length > 1) {
                let dd = new Date(new Date(arrst[0]));
                t[i].st = dd;
                t[i].stMonth = monthStr(dd.getMonth());
                t[i].stMonthNum = dd.getMonth();
                t[i].stDay = dayStr(dd.getDay());
                t[i].stDayNum = dd.getDay();
                t[i].stWeek = weekNum(dd);
            } else {
                t[i].st = '';
                t[i].stMonth = '';
                t[i].stDay = '';
                t[i].stWeek = '';
            };
        };
        // Initializing the return object
        let r = {};
        r.arrMonthCT = [];
        r.arrMonthCTData = {};
        r.arrMonthCTData.arr0 = [];
        r.arrMonthCTData.arr1 = [];
        r.arrMonthCTData.arrLabels = [];
        r.arrMonthST = [];
        r.arrMonthSTData = {};
        r.arrMonthSTData.arr0 = [];
        r.arrMonthSTData.arr1 = [];
        r.arrMonthSTData.arrLabels = [];
        // grouping by month
        let tt = t.sort(function (a, b) { return a.ct - b.ct });
        let counter = 0;
        let total = 0;
        for (let i = 0; i < c; i++) {
            let obj = {};
            obj.total = 0;
            obj.counter = 0;
            obj.month = '';
            if (tt[i].paid !== '') {
                if (i !== c - 1) {
                    if (tt[i].ctMonth === tt[i + 1].ctMonth) {
                        //aggregating here
                        counter += 1;
                        total += Number(tt[i].paid);
                        //console.log(tt[i].ctMonth + ' - ' + tt[i]['closed timestamp'] + ' - ' + tt[i].paid + ' - ' + total + ' - ' + counter);
                    }
                    else {
                        //aggregating here
                        counter += 1;
                        total += Number(tt[i].paid);
                        //console.log(tt[i].ctMonth + ' - ' + tt[i]['closed timestamp'] + ' - ' + tt[i].paid + ' - ' + total + ' - ' + counter);
                        //adding here
                        obj.total = total;
                        obj.counter = counter;
                        obj.month = tt[i].ctMonth;
                        r.arrMonthCT.push(obj);
                        r.arrMonthCTData.arr0.push(counter);
                        r.arrMonthCTData.arr1.push(total);
                        r.arrMonthCTData.arrLabels.push(tt[i].ctMonth);
                        //reseting here
                        counter = 0;
                        total = 0;
                    };
                } else {
                    //aggregating here
                    counter += 1;
                    total += Number(tt[i].paid);
                    //adding here
                    obj.total = total;
                    obj.counter = counter;
                    obj.month = tt[i].ctMonth;
                    r.arrMonthCT.push(obj);
                    r.arrMonthCTData.arr0.push(counter);
                    r.arrMonthCTData.arr1.push(total);
                    r.arrMonthCTData.arrLabels.push(tt[i].ctMonth);
                }
            } else {
               //console.log(tt[i].ctMonth);
            };
        };
        tt = t.sort(function (a, b) { return a.st - b.st });
        counter = 0;
        let closed = 0;
        for (let i = 0; i < c; i++) {
            let obj = {};
            obj.closed = 0;
            obj.counter = 0;
            obj.month = '';
            if (i !== c - 1) {
                if (tt[i].stMonth === tt[i + 1].stMonth) {
                    //aggregating here
                    counter += 1;
                    if (tt[i]['open/closed status'] === 'Closed') {
                        closed += 1;
                    };
                }
                else {
                    //aggregating here
                    counter += 1;
                    if (tt[i]['open/closed status'] === 'Closed') {
                        closed += 1;
                    };
                    //adding here
                    obj.closed = closed;
                    obj.counter = counter;
                    obj.month = tt[i].stMonth;
                    r.arrMonthST.push(obj);
                    r.arrMonthSTData.arr0.push(counter);
                    r.arrMonthSTData.arr1.push(closed);
                    r.arrMonthSTData.arrLabels.push(tt[i].stMonth);
                    //reseting here
                    counter = 0;
                    closed = 0;
                };
            } else {
                //aggregating here
                counter += 1;
                if (tt[i]['open/closed status'] === 'Closed') {
                    closed += 1;
                };
                //adding here
                obj.closed = closed;
                obj.counter = counter;
                obj.month = tt[i].stMonth;
                r.arrMonthST.push(obj);
                r.arrMonthSTData.arr0.push(counter);
                r.arrMonthSTData.arr1.push(closed);
                r.arrMonthSTData.arrLabels.push(tt[i].stMonth);
            }
        };

        //for (let i = 0; i < c; i++) {
        //    let obj = {};
        //    obj.total = 0;
        //    obj.counter = 0;
        //    obj.Week = '';
        //    if (tt[i].paid !== '') {
        //        if (i !== c - 1) {
        //            if (tt[i].ctWeek === tt[i + 1].ctWeek) {
        //                //aggregating here
        //                counter += 1;
        //                total += Number(tt[i].paid);
        //                //console.log(tt[i].ctWeek + ' - ' + tt[i]['closed timestamp'] + ' - ' + tt[i].paid + ' - ' + total + ' - ' + counter);
        //            }
        //            else {
        //                //aggregating here
        //                counter += 1;
        //                total += Number(tt[i].paid);
        //                //console.log(tt[i].ctWeek + ' - ' + tt[i]['closed timestamp'] + ' - ' + tt[i].paid + ' - ' + total + ' - ' + counter);
        //                //adding here
        //                obj.total = total;
        //                obj.counter = counter;
        //                obj.Week = tt[i].ctWeek;
        //                r.arrWeekCT.push(obj);
        //                //reseting here
        //                counter = 0;
        //                total = 0;
        //            };
        //        } else {
        //            //aggregating here
        //            counter += 1;
        //            total += Number(tt[i].paid);
        //            //adding here
        //            obj.total = total;
        //            obj.counter = counter;
        //            obj.Week = tt[i].ctWeek;
        //            r.arrWeekCT.push(obj);
        //        }
        //    } else {
        //        //console.log(tt[i].ctWeek);
        //    };
        //};
        //counter = 0;
        //total = 0;
        //tt = t.sort(function (a, b) { return a.ctDayNum - b.ctDayNum });
        //for (let i = 0; i < c; i++) {
        //    let obj = {};
        //    obj.total = 0;
        //    obj.counter = 0;
        //    obj.Day = '';
        //    if (tt[i].paid !== '') {
        //        if (i !== c - 1) {
        //            if (tt[i].ctDay === tt[i + 1].ctDay) {
        //                //aggregating here
        //                counter += 1;
        //                total += Number(tt[i].paid);
        //                //console.log(tt[i].ctDay + ' - ' + tt[i]['closed timestamp'] + ' - ' + tt[i].paid + ' - ' + total + ' - ' + counter);
        //            }
        //            else {
        //                //aggregating here
        //                counter += 1;
        //                total += Number(tt[i].paid);
        //                //console.log(tt[i].ctDay + ' - ' + tt[i]['closed timestamp'] + ' - ' + tt[i].paid + ' - ' + total + ' - ' + counter);
        //                //adding here
        //                obj.total = total;
        //                obj.counter = counter;
        //                obj.Day = tt[i].ctDay;
        //                r.arrDayCT.push(obj);
        //                //reseting here
        //                counter = 0;
        //                total = 0;
        //            };
        //        } else {
        //            //aggregating here
        //            counter += 1;
        //            total += Number(tt[i].paid);
        //            //adding here
        //            obj.total = total;
        //            obj.counter = counter;
        //            obj.Day = tt[i].ctDay;
        //            r.arrDayCT.push(obj);
        //        }
        //    } else {
        //        //console.log(tt[i].ctDay);
        //    };
        //};
        return r;
    };
});




