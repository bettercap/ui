import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class ClipboardService {
    constructor() { }

    // taken from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript/30810322
    copy(text : string) {
        var textArea = document.createElement("textarea");
        var range = document.createRange();

        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = '0';
        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';

        textArea.value = text;
        textArea.readOnly = false;
        textArea.contentEditable = 'true';

        document.body.appendChild(textArea);

        textArea.select();

        range.selectNodeContents(textArea);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(range);

        textArea.setSelectionRange(0, 999999);

        try {
            var ok = document.execCommand('copy');
            if( !ok ) {
                console.log('Copying text command failed');
            }
        } catch (err) {
            console.log('Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

}

