// Deferred import so Module Federation's async shared-scope negotiation
// (react/react-dom/etc.) completes before any shared module is evaluated -
// the standard "eager consumption" workaround for federated entry points.
import('./bootstrap');
