const EventsController = require('./controllers/events.controller');
const ReservationsController = require('./controllers/reservations.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const EventPermissionMiddleware = require('./middlewares/events.permission.middleware');
const EventValidationMiddleware = require('./middlewares/events.validation.middleware');
const ReservationValidationMiddleware = require('./middlewares/reservations.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

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

    // TODO: Make sure reservation group has at most seven members only
    app.post('/events/:eventId/reservations', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        EventValidationMiddleware.eventIsOpen,
        ReservationValidationMiddleware.UserHasNotReservedYet,
        ReservationsController.insert
    ]);
};
