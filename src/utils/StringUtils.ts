import { inspect } from "util";

export function getCodeBlock(txt: string) {
    const match = /^```(\S*)\n?([^]*)\n?```$/.exec(txt);
    if(!match) 
        return { lang: null, code: txt };
        
    if (match[1] && !match[2]) 
        return { lang: null, code: match[1] };

    return { lang: match[1], code: match[2] };
}

export function clean(text: any, safe: boolean = true): string {
    if (typeof text !== "string")
        text = inspect(text, { depth: 2 });

    text = text
        .replaceAll("`", `\`${String.fromCharCode(8203)}`)
        .replaceAll("@", `@${String.fromCharCode(8203)}`);

    if (safe) {
        const safeReplace = (token: any) => token === undefined || token === "" ? "" : (!token ? token : "<redacted>");

        let parsed = process.env;
        for (const env of Object.keys(parsed))
            text = text.replaceAll(new RegExp(`\\b${parsed[env]}\\b`, "g"), safeReplace(parsed[env]));
    }

    return text;
}