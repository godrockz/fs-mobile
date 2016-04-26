/**
 * providing a datamodel for favorites and current program views
 * <p/>
 * Created by Benjamin Jacob on 26.04.16.
 * <p/>
 */
'use strict';
angular.module('fsMobile').service('CalendarGrid', function(){

    /**
     * time function:
     * if the test is between start and end. (inclusive match)
     * wheras moment.isBetween is exclusive
     * @param test - a moment
     * @param start - a moment
     * @param end - a moment
     */
    function isBetween(test, start, end) {
        return (test.isAfter(start) ) && (test.isBefore(end) );//|| test.isSame(end) /|| test.isSame(start)
    }

    /**
     *
     * @param height -
     * @param removeEmptyRows - remove rows without events
     * @param additionalSteps - add amount of steps to end of the list (allow scroll)
     * @param onRemovalKeepStepsBetween keep amount steps after an event (only if removeEmptySteps is set tot true)
     * @param renderAllTimes default:false, if true every step gets its time information rendered
     * @param showFullGrid - show gridlines on whole screen, default true
     * @param maxDaysToRender - max days to watch when render. this avoids lot of recursion
     * @constructor
     */
    function CalendarGrid(height, removeEmptyRows, additionalSteps, onRemovalKeepStepsBetween, renderAllTimes,
                          useAbsoluteRendering, showFullGrid, maxDaysToRender) {


        this.useAbsoluteRendering = useAbsoluteRendering === undefined ? true : useAbsoluteRendering;
        this.showFullGrid = showFullGrid === undefined ? true : showFullGrid;
        this.events = [];
        this.firstTime = moment("2099-12-31");
        this.lastTime = moment(0);
        this.locations = {};
        this.entryHeight = height || 100; // px
        this.entryWidth = 90; //percentage
        this.removeEmptyRows = removeEmptyRows === undefined ? true : removeEmptyRows;
        this.additionalSteps = additionalSteps || 0;
        this.onRemovalKeepStepsBetween = onRemovalKeepStepsBetween || 0;
        this.showAllTimes = renderAllTimes === undefined ? false : renderAllTimes;
        this.locationCount = 0;
        this.maxDaysToRender = maxDaysToRender || 10;
        this.largeTimeSpan = false;
    }

    /**
     * time function:
     * if the test is between start and end. (inclusive match)
     * wheras moment.isBetween is exclusive
     * @param test - a moment
     * @param start - a moment
     * @param end - a moment
     */
    CalendarGrid.prototype.isBetween = isBetween;

    CalendarGrid.prototype.addEvent = function (event) {
        // add to list of events
        // update minStart max End
        // add location if not yet exists
        this.locations[event.location.id] = event.location;
        this.locationCount = Object.keys(this.locations).length;
        this.entryWidth = 99 / (this.locationCount + 1 );// +1 to mind the time column
        
        var start = event._mstart || moment(event.start), end = event._mend || moment(event.end);

        if (this.firstTime.isAfter(start)) {
            this.firstTime = start;
        }
        if (this.lastTime.isBefore(end)) {
            this.lastTime = end;
        }
        this.events.push(event);

    };


    CalendarGrid.prototype.addWorkshopEvent = function (event) {
        // all ws events should be displayed @ same location so wrap it.
        var newEvent = angular.copy(event, {});
        newEvent.location = {id: 'workshop', originalLocation: event.location};
        this.addEvent(newEvent);
    };

    CalendarGrid.prototype.getEventsFor = function (startTime, endTime) {
        var result = [];
        // TODO: optimize, remind already added events and do not iterate them each time
        angular.forEach(this.events, function (event) {
            var start = event._mstart || moment(event.start),
                end = event._mend || moment(event.end);
            event._mstart = start;
            event._mend = end;

            if (isBetween(startTime, start, end) || isBetween(endTime, start, end) ||
                isBetween(start, startTime, endTime) || isBetween(end, startTime, endTime)) {
                result.push(event);
            }
        });
        return result;
    };

    CalendarGrid.prototype.getTimeLine = function (stepSizeMin) {
        var startTT = new Date().getTime();
        var me = this,
            step = parseInt(stepSizeMin, 10) || 15,
            currentTime = this.firstTime,
            result = [],
            cnt = (this.maxDaysToRender * 24 * 60 / stepSizeMin) + 10 ,// +10 some extra time for event prefix / suffix slots
            endTime = this.additionalSteps ? moment(this.lastTime).add(this.additionalSteps * stepSizeMin, 'MINUTE') : this.lastTime,
            keeptStepCnt = 0,
            addedEvents = {};

        var initDuration = 0;

        while (currentTime.isBefore(endTime) && cnt >= 0) {
            var sss = new Date().getTime(), nextTime = moment(currentTime).add(step, 'MINUTE'),

                eventsInCurrentTimeSlice = this.getEventsFor(currentTime, nextTime),
            // prepend n-steps before an event. this way an entry will always display full hour before starting.
                keepStepsTimeSliceEnd = moment(currentTime).add(1, 'HOUR').set('MINUTE', 0),
                upcomingEventsInKeepSteps = this.getEventsFor(currentTime, keepStepsTimeSliceEnd),

                isAdditionalTime = currentTime.isAfter(this.lastTime);
            initDuration += new Date().getTime()-sss;
            cnt--; // avoid endless loops

            // check if the row should be removed because it hs not entries
            if (upcomingEventsInKeepSteps.length <= 0 && eventsInCurrentTimeSlice.length <= 0 && this.removeEmptyRows) {

                if (keeptStepCnt >= this.onRemovalKeepStepsBetween && !isAdditionalTime) {
                    // do not add current time slice
                    currentTime = nextTime;
                    continue;
                }
                keeptStepCnt++;

            }
            if (this.removeEmptyRows && upcomingEventsInKeepSteps.length > 0 && eventsInCurrentTimeSlice.length <= 0) {
                // reset keept step cnt
                keeptStepCnt = 0;
            }
            var locations = {};
            /* jshint -W083 */
            angular.forEach(this.locations, function (loc) {
                locations[loc.id] = {
                    location: loc,
                    events: []
                };
            });

            /* jshint -W083 */
            angular.forEach(eventsInCurrentTimeSlice, function (event) {

                var location = locations[event.location.id];

                if (!location) {
                    throw 'no locationContainer found';
                }

                if (!addedEvents[event.id]) {
                    // this is the first event getting added
                    var durationInMinutes = moment.duration(event._mend.diff(event._mstart)).asMinutes();
                    var renderHeight = Math.ceil(durationInMinutes / stepSizeMin) * me.entryHeight;
                    if (location.renderHeight === undefined || location.renderHeight < renderHeight) {
                        location.renderHeight = renderHeight;
                    }
                }

                location.events.push(event);
                addedEvents[event.id] = event;
            });


            result.push({
                time: currentTime.toDate(),
                isFullHour: currentTime.minute() === 0,
                locations: locations
            });

            currentTime = nextTime;
        }
        if(cnt<=0){
            this.largeTimeSpan = true;
        }
        // create grid starting @ start

        var endTT = new Date().getTime();
        console.log('duration ',endTT - startTT,'durationForLoopInit', initDuration);
        return result;
    };

    return CalendarGrid;
});
