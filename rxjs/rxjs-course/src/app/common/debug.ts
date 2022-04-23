import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJSLoggingLevel {
    TRACE,
    DEBUG,
    INFO,
    ERROR
}

let rxjsGlobalLoggingLevel = RxJSLoggingLevel.DEBUG;

export function setRxJsGlobalLoggingLevel(level:RxJSLoggingLevel){
    rxjsGlobalLoggingLevel = level;
}

/**
 * DEBUG opperator
 * @param level 
 * @param message 
 * @returns 
 */
export const debug = (level: number, message:string) => 
    (source: Observable<any>) => source
        .pipe(
            tap(val => {
                if(level >= rxjsGlobalLoggingLevel) {
                    console.log(message + ': ', val);
                }
            })
        );