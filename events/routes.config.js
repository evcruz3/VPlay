const EventsController = require('./controllers/events.controller');
const TeamsController = require('./controllers/teams.controller');
const SchedulesController = require('./controllers/schedules.controller');
const ReservationsController = require('./controllers/reservations.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const EventPermissionMiddleware = require('./middlewares/events.permission.middleware');
const EventValidationMiddleware = require('./middlewares/events.validation.middleware');
const ReservationValidationMiddleware = require('./middlewares/reservations.validation.middleware');
const TeamValidationMiddleware = require('./middlewares/teams.validation.middleware');
const TeamsPermissionMiddleware = require('./middlewares/teams.permission.middleware')
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;
const EVENT_MANAGER = config.permissionLevels.EVENT_MANAGER

exports.routesConfig = function (app) {
    
    app.post('/events', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        EventsController.insert
    ]);


    app.get('/events', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        EventsController.find
    ]);
    app.get('/events/:eventId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        EventsController.getById
    ]);
    app.get('/events/:eventId/cancel', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        EventPermissionMiddleware.onlyHostOrAdminCanDoThisAction,
        EventsController.cancelEvent
    ]);

    app.patch('/events/:eventId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        EventPermissionMiddleware.onlyHostOrAdminCanDoThisAction,
        EventsController.patchById
    ]);
    app.delete('/events/:eventId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        EventsController.removeById
    ]);

    app.get('/events/hostedBy/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        EventsController.find
    ]);

    // Reservations
    // TODO: Make sure reservation group has at most seven members only
    app.post('/events/:eventId/reservations', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        EventValidationMiddleware.eventStatusIs('open'),
        ReservationValidationMiddleware.UserHasNotReservedYet,
        ReservationsController.insert
    ]);

    app.get('/events/:eventId/reservations', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        ReservationsController.list
    ]);

    app.get('/events/:eventId/teams', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        TeamsPermissionMiddleware.onlyHostAdminOrTeamMemberCanDoThisAction,
        TeamsController.listEventTeams
    ]);

    app.put('/events/:eventId/teams', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(EVENT_MANAGER),
        EventValidationMiddleware.eventStatusIs('locked'),
        TeamValidationMiddleware.TeamsFollowEventRules,
        TeamValidationMiddleware.allEventTeamsPositionsAreFilled,
        SchedulesController.deleteEventSchedule,
        TeamsController.deleteEventTeams,
        TeamsController.createEventTeams
    ])
    
    // TODO: check if each team object id exists
    app.put('/events/:eventId/schedule', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(EVENT_MANAGER),
        EventValidationMiddleware.eventStatusIs('locked'),
        TeamValidationMiddleware.allEventTeamsIsInScheduleAndViceVersa,
        SchedulesController.deleteEventSchedule,
        SchedulesController.createEventSchedule
    ]);

    app.get('/events/:eventId/schedule', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        TeamsPermissionMiddleware.onlyHostAdminOrTeamMemberCanDoThisAction,
        SchedulesController.list
    ]);
};
