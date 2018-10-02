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
 * If audio starts playing automatically, {@link #cancelAlert} is called,
 * setting this value to "false".
 * 
 * @default true
 * @type {boolean}
 */
var shouldAlert = true;

/**
 * A boolean value to determine if {@link #prepareAlert} has been called.
 * The mentioned method is triggered by the "oncanplaythrough" event from audio element.
 * As the event seems to fire multiple times, this value allows for checking if the
 * method was previously called. Upon method call, this is set to "true".
 * 
 * @default false
 * @type {boolean}
 */
var isPrepareAlertCalled = false;

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
 * Cancel the alert by setting {@link #shouldAlert} to "false",
 * after being triggered by the "ontimeupdate" event.
 * This also calls {@link #removeAttrForAudioElement} to remove attributes
 * for listening to events from the audio element.
 * @listens ontimeupdate
 */
function cancelAlert() {
    shouldAlert = false;
    removeAttrForAudioElement();
}

/**
 * Get the "audio" element from DOM and initialize {@link #audioElement}.
 */
function initializeAudioElement() {
    // Get all elements with "audio" tag from DOM as an array
    const audioElements = document.getElementsByTagName("audio");
    // Check if there are any such element
    if (audioElements.length === 0) {
        // None is found as array doesn't contain anything
        console.log("Can not find element with tag name \"audio\"!");
    } else {
        // Initialize the audioElement object
        // Index is 0 as there should be only one audio element
        audioElement = audioElements[0];
    }
}

/**
 * Start the timeout timer. This is triggered by the "oncanplaythrough" event.
 * If no audio is playing after the 1 second timeout, the alert dialog is shown,
 * notifying the site visitor that autoplay for audio is unavailable.
 * 
 * Once the entire audio track can play through without buffering,
 * the "oncanplaythrough" event is fired. This function is then called.
 * As the event seems to fire multiple times, a check is first performed
 * to see if this was previously called, by using {@link #isPrepareAlertCalled}.
 * If not, it initializes {@link #audioElement} with {@link #initializeAudioElement}.
 * Then, it starts a timeout of 1000 milliseconds. Upon timeout, it checks
 * {@link #shouldAlert} to determine if alert dialog should be shown.
 * This also calls {@link #removeAttrForAudioElement} to remove attributes
 * for listening to events from the audio element.
 * @listens oncanplaythrough
 */
function prepareAlert() {
    // Check if this function is called before
    if (!isPrepareAlertCalled) {
        // It had never been called, now set isPrepareAlertCalled to true
        isPrepareAlertCalled = true;
        // Initialize audioElement
        initializeAudioElement();
        // Set the 1000 milliseconds timeout as audio track is fully loaded
        setTimeout(function() {
            // Check if audio is already playing
            if (shouldAlert) {
                // No audio is playing, show the alert dialog
                alert(MESSAGE);
                // Stop listening to events
                removeAttrForAudioElement();
            }
        }, 1000);
    }
}

/**
 * Remove event listeners for both "oncanplaythrough" and "ontimeupdate" events
 * from the audio element to free up system resource.
 * If {@link #audioElement} is never initialized successfully,
 * this function does nothing.
 */
function removeAttrForAudioElement() {
    if (typeof audioElement !== "undefined") {
        audioElement.removeAttribute("oncanplaythrough");
        audioElement.removeAttribute("ontimeupdate");
    }
}
