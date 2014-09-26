WIP loopback-restangular
========================

Initiative to port loopback-sdk-angular to generate
more lightweight Restangular objects

I found some issues though :

 * Restangular `.service()` mechanism has limitations
 * Cannot easily `PUT` new objects
 * Have to rewrite all LoopbackAuth to work in a 'Restangularized' way

This, and also the fact that it's better to use angular-supported $resource modlels

(But the aim was to generate a much lighter payload as a compromise)

Dev halted for the moment
