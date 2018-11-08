/**
 * @license
 * Copyright (c) 2018 VanishedApps
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @author LightWayUp
 */

/**
 * A boolean value to determine if alert dialog should be shown.
 * Only used when the fallback method {@link #prepareAlert} is called.
 * If audio starts playing automatically, {@link #cancelAlert} is called,
 * setting this value to "false".
 * 
 * @default true
 * @type {boolean}
 */
var shouldAlert = true;

/**
 * An Element representing the audio element in HTML DOM.
 * This is initialized in {@link #initializeAudioElement} function.
 * @type {Element}
 */
var audioElement;

/**
 * The alert message seen if the alert dialog is shown.
 * @constant
 * @type {string}
 * @default
 */
const MESSAGE = "Your internet browser doesn't seem to support or allow audio autoplay.\nOnly half of the dankness for you, sorry \uD83D\uDE26!";

/**
 * Log a message to the console when an Error is thrown.
 * @function
 * @kind function
 * @type {function}
 * @listens onerror
 */
window.onerror = (message, source, lineNumber, columnNumber, error) => console.log(`An error occured, please report this at https://github.com/VanishedApps/dank/issues/new .\n\nFull details, copy and paste into issue description:\n\n${error.stack}`);

/**
 * Cancel the alert by setting {@link #shouldAlert} to "false",
 * after being triggered by the "ontimeupdate" event.
 * @listens ontimeupdate
 */
function cancelAlert() {
    shouldAlert = false;
}

/**
 * Attempt to play audio when the page is loaded.
 * If autoplay is disabled or unsupported, an alert dialog is shown.
 * 
 * If calling function "play()" does not return a Promise,
 * fallback method {@link #prepareAlert} is used.
 * @listens onload
 */
function playAudio() {
    // Load audio element
    initializeAudioElement();
    const promise = audioElement.play();
    // Check if browser returns a Promise
    if (promise !== undefined) {
        // Check if audio can start playing, if not then show the alert dialog
        promise.catch(reason => showAlert(reason.toString()));
    } else {
        // Browser does not return a Promise, use hacky fallback method
        // to determine if audio is playing
        prepareAlert();
    }
}

/**
 * Get the "audio" element from DOM and initialize {@link #audioElement}.
 * @throws {Error} Throws an Error if the correct audio element can't be found.
 */
function initializeAudioElement() {
    // Get all elements with "audio" tag from DOM as an array
    const audioElements = document.getElementsByTagName("audio");
    // Check if there is exactly 1 audio element
    if (audioElements.length !== 1) {
        // None or more than one are found
        throw new Error("Can not find the correct element with tag name \"audio\"!");
    }
    // Initialize the audioElement object
    // Index is 0 as there is only one audio element
    audioElement = audioElements[0];
}

/**
 * Start the timeout timer. This is a fallback method for browsers that
 * does not return a Promise when "play()" is called.
 * If no audio is playing after the 1 second timeout, the alert dialog is shown,
 * notifying the site visitor that autoplay for audio is unavailable.
 * 
 * It starts a timeout of 1000 milliseconds. Upon timeout, it checks
 * {@link #shouldAlert} to determine if alert dialog should be shown.
 * This also calls {@link #removeAttrForAudioElement} to remove the attribute
 * for listening to "ontimeupdate" event from the audio element.
 * @listens oncanplaythrough
 */
function prepareAlert() {
    setTimeout(() => {
        // Check if audio is already playing
        if (shouldAlert) {
            // No audio is playing, show the alert dialog
            showAlert();
        }
        // Stop listening to event
        removeAttrForAudioElement();
    }, 1000);
}

/**
 * Show the alert dialog. Optionally, a reason can be included.
 * @param {string} reason The reason audio can not start playing automatically.
 * @throws {TypeError} Throws a TypeError if type of reason is not string.
 */
function showAlert(reason) {
    if (typeof reason !== "string") {
        throw new TypeError("Reason must be a string!");
    }
    var alertMessage = MESSAGE;
    if (reason !== undefined && reason !== null) {
        alertMessage += `\n\nReason:\n${reason}`;
    }
    alert(alertMessage);
}

/**
 * Remove event listeners for "ontimeupdate" event
 * from the audio element to free up system resource.
 * If {@link #audioElement} is never initialized successfully,
 * this function does nothing.
 */
function removeAttrForAudioElement() {
    if (audioElement !== undefined) {
        audioElement.removeAttribute("ontimeupdate");
    }
}
