/**
 * Write the scheduling function here.
 */

export const scheduleMessage = (timeInMS = 10000, callbackFunction) => {
    setTimeout(() => {
        callbackFunction();
    }, timeInMS);
}