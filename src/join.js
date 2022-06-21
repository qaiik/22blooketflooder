var encoder = async (b, c) => {
        let a = window.crypto.getRandomValues(new Uint8Array(12));
        return window.btoa(
            Array.from(a)
                .map((a) => String.fromCharCode(a))
                .join("") +
                Array.from(
                    new Uint8Array(
                        await window.crypto.subtle.encrypt(
                            { name: "AES-GCM", iv: a },
                            await window.crypto.subtle.importKey("raw", await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(c)), { name: "AES-GCM" }, !1, ["encrypt"]),
                            new TextEncoder().encode(JSON.stringify(b))
                        )
                    )
                )
                    .map((a) => String.fromCharCode(a))
                    .join("")
        );
    },
    getValues = () =>
        new Promise((b, c) => {
            try {
                let a = window.webpackJsonp
                    .map((a) => Object.keys(a[1]).map((b) => a[1][b]))
                    .reduce((a, b) => [...a, ...b], [])
                    .find((a) => /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(a.toString()) && /\(new TextEncoder\)\.encode\(\"(.+?)\"\)/.test(a.toString()))
                    .toString();
                b({ blooketBuild: a.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)[0], secret: a.match(/\(new TextEncoder\)\.encode\(\"(.+?)\"\)/)[1] });
            } catch {
                c("Could not fetch auth details");
            }
        });

(async ()=>{Object.assign(window, await getValues())})();
async function join(id,name,blook) {
    fetch("https://fb.blooket.com/c/firebase/join", {
        headers: {
            "X-Blooket-Build": window.blooketBuild,
            "Content-Type": "text/plain",
            Accept: "application/json, text/plain, */*",
        },
        mode: "cors",
        referrerPolicy: "no-referrer",
        credentials: "include",
        method: "put",
        body: await encoder({
                id: id.toString(),
                name: name,
            },
            window.secret
        ),
    }).then((async function() {
        fetch(`https://fb.blooket.com/c/firebase/games/${id}/v`, {
            headers: {
                "X-Blooket-Build": window.blooketBuild,
                "Content-Type": "text/plain",
                Accept: "application/json, text/plain, */*",
            },
            mode: "cors",
            referrerPolicy: "no-referrer",
            method: "put",
            credentials: "include",
            body: await encoder({
                    path: `c/${name}`,
                    value: {
                        b: blook
                    },
                },
                window.secret
            ),
        });
    }))
}
