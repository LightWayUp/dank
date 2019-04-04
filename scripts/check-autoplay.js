/**
 * @license
 * Copyright (c) 2018-2019 vanishedvan
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

"use strict";

/**
 * An Element representing the audio element in HTML DOM.
 * This is initialized in {@link #initializeAudioElement} function.
 * @type {Element}
 */
let audioElement;

/**
 * The alert message seen if the alert dialog is shown.
 * @constant {string}
 * @default
 * @readonly
 */
const MESSAGE = "Your internet browser doesn't seem to support or allow audio autoplay.\nOnly half of the dankness for you, sorry \uD83D\uDE26!";

/**
 * The repository this website is for, in "owner/repository" format.
 * @constant {string}
 * @default
 * @readonly
 */
const REPOSITORY_REPRESENTATION = getRepository().representation;

/**
 * Log a message to the console when an Error is thrown.
 * @function
 * @listens onerror
 */
window.onerror = (message, source, lineNumber, columnNumber, error) => console.log(`An error occured, please report this at https://github.com/${REPOSITORY_REPRESENTATION}/issues/new .\n\nFull details, copy and paste into issue description:\n\n${error}`);

/**
 * Attempt to play audio when the page is loaded.
 * If autoplay is disabled or unsupported, an alert dialog is shown.
 * @function
 * @listens onload
 */
window.onload = () => {
    // Load audio element
    initializeAudioElement();
    // Play audio and handle rejection
    audioElement.play().catch(showAlert);
}

/**
 * Get the "audio" element from DOM and initialize {@link #audioElement}.
 * @throws {Error} Throws an Error if the correct audio element can't be found.
 */
function initializeAudioElement() {
    // Get element with "audio" tag from DOM
    audioElement = document.querySelector("audio");
    // Check if the audio element exists
    if (!audioElement) {
        // None is found
        throw new Error("Can not find the correct element with tag name \"audio\"!");
    }
}

/**
 * Show the alert dialog. Optionally, a reason can be included.
 * @param {string|String|Error} [reason] The optional reason audio
 * can not start playing automatically.
 * @throws {TypeError} Throws a TypeError if type of reason is not string.
 */
function showAlert(reason) {
    reason = reason instanceof Error ? reason.toString() : unboxIfBoxed(reason);
    if (!(typeof reason === "string" || reason == null)) {
        throw new TypeError("Reason must be a string!");
    }
    alert(reason == null ? MESSAGE : `${MESSAGE}\n\nReason:\n${reason}`);
}

/**
 * Get the name of repository, name of owner and repository's representation.
 * @returns {object} An object containing information about name of owner,
 * name of repository, and its representation.
 */
function getRepository() {
    const location = window.location;
    const owner = location.hostname.split(/\./gi)[0];
    const repository = location.pathname.split(/\//gi)[1];
    return {
        owner: owner,
        repository: repository,
        representation: `${owner}/${repository}`
    };
}

/**
 * Unbox Number, Boolean and String objects.
 * @param {} object The object to be unboxed. If it isn't
 * an instance of Number, Boolean, or String, the original
 * object or value is returned.
 * @returns {} Value of unboxed Numbers, Booleans, or Strings.
 * The original object or value is returned if it isn't
 * an instance of Number, Boolean, or String.
 */
function unboxIfBoxed(object) {
    if (object instanceof Number || object instanceof Boolean || object instanceof String) {
        return object.valueOf();
    }
    return object;
}
