import https from 'follow-redirects/https.js';

const sendOTP = async (userPhoneNumber) => {
    try {
        const apiKey = process.env.INFOBID_API_KEY;
        const url = process.env.INFOBID_URL;

        const options = {
            method: 'POST',
            hostname: url,
            path: '/sms/2/text/advanced',
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            maxRedirects: 50
        };

        const code = Math.floor(100000 + Math.random() * 900000);

        const postData = JSON.stringify({
            "messages": [
                {
                    "destinations": [{ "to": userPhoneNumber }],
                    "from": "447491163443",
                    "text": `Your verification code is: ${code}`
                }
            ]
        });

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                const chunks = [];

                res.on("data", (chunk) => {
                    chunks.push(chunk);
                });

                res.on("end", () => {
                    const body = Buffer.concat(chunks).toString();
                    resolve({ data: body, code: code });
                });
            });

            req.on("error", (error) => {
                reject(error);
            });

            req.write(postData);
            req.end();
        });
    } catch (error) {
        console.error("Error in sendOTP:", error);
        return { error: "Failed to send OTP" };
    }
};

const verifyOTP = (code, sessionCode) => {
    try {
        if (!code || !sessionCode) {
            throw new Error("code and session code is required")
        }

        if (parseInt(code) !== parseInt(sessionCode)) {
            throw new Error("Invalid verification code.");
        }
        return true;
    } catch (error) {
        console.error("Error in sendOTP:", error);
        return { error: "Failed to send OTP" };
    }
}

export { sendOTP, verifyOTP }
