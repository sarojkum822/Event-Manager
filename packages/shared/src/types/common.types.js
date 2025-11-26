"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCategory = exports.VendorStatus = exports.PaymentStatus = exports.BookingStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "customer";
    UserRole["VENDOR"] = "vendor";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["COMPLETED"] = "completed";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PARTIAL"] = "partial";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var VendorStatus;
(function (VendorStatus) {
    VendorStatus["PENDING"] = "pending";
    VendorStatus["VERIFIED"] = "verified";
    VendorStatus["REJECTED"] = "rejected";
    VendorStatus["SUSPENDED"] = "suspended";
})(VendorStatus || (exports.VendorStatus = VendorStatus = {}));
var EventCategory;
(function (EventCategory) {
    EventCategory["WEDDING"] = "wedding";
    EventCategory["BIRTHDAY"] = "birthday";
    EventCategory["CORPORATE"] = "corporate";
    EventCategory["ANNIVERSARY"] = "anniversary";
    EventCategory["ENGAGEMENT"] = "engagement";
    EventCategory["BABY_SHOWER"] = "baby_shower";
    EventCategory["OTHER"] = "other";
})(EventCategory || (exports.EventCategory = EventCategory = {}));
