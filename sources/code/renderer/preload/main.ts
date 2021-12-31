import { contextBridge, ipcRenderer } from "electron";
import { randomBytes } from "crypto";
import { getAppIcon, wLog } from "../../global/global";
import desktopCapturerPicker from "../modules/capturer";
import preloadCosmetic from "../modules/cosmetic";
import l10n from "../../global/modules/l10n";

/**
 * WebCord API key used as the object name of the exposed content
 * by the Context Bridge.
 */
const contextBridgeApiKey = "__" + randomBytes(32).toString('base64') + "__";

/*
 * Cosmetic script uses that to hide the Discord's download popup on fresh
 * installations.
 */
preloadCosmetic();
contextBridge.exposeInMainWorld(
    contextBridgeApiKey,
    {
        desktopCapturerPicker: desktopCapturerPicker
    }
);

if (window.location.protocol === 'file:') {
    window.addEventListener("load", () => {
        const element = document.getElementById("logo")
        if(element && element.tagName === "IMG")
            (element as HTMLImageElement).src = getAppIcon([512,256,192]);
    });
    contextBridge.exposeInMainWorld(
        'webcord',
        {
            l10n: (new l10n()).web
        }
    );
}
ipcRenderer.send('api-exposed', contextBridgeApiKey);

wLog("Everything has been preloaded successfully!");