/*
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

/*
* Created by LightWayUp on September 24th 2018
*/

var shouldAlert = true; // If audio does not play, alert isn't cancelled
const audioElement = document.getElementById("autoplay");
const string = "Your internet browser doesn't seem to support or allow audio autoplay.\nOnly half of the dankness for you, sorry :(!";

/*
* If audio plays, cancel the alert.
* This is triggered by the "ontimeupdate" event.
*/
function cancelAlert() {
    shouldAlert = false; // Cancel the alert
    removeAttrForAudioElement(); // Stop listening to events
}

/*
* This is triggered by the "oncanplaythrough" event.
* Once the entire audio track can play, countdown timer of 0.5 second is set.
* If autoplay is available, audio should start playing in less than 0.5 second,
* triggering the cancelAlert function.
* If autoplay is unavailable, shouldAlert stays true, and alert dialog is shown.
*/
function prepareAlert() {
    setTimeout(function() { // Audio track is fully loaded, wait for 0.5 second for it to play
        if (shouldAlert) { // After the countdown, it's still not playing
            window.alert(string); // Show the alert
            removeAttrForAudioElement(); // Stop listening to events
        }
    }, 500);
}

function removeAttrForAudioElement() {
    audioElement.removeAttribute("oncanplaythrough");
    audioElement.removeAttribute("ontimeupdate");
}
