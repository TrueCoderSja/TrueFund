const API_BASE_URL = "http://10.3.2.8:3000/";

export async function handleSignUpRequest(userData) {
    const { id, username, email, phone, password, address, dob, aadhar } = userData;
    try {
        const response = await fetch(API_BASE_URL + 'auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (error) {
        Alert.alert("Network Error", "Please try again later.");
        console.error('SignUp Error:', error);
        return {success: false};
    }
};

export async function handleVerifyOTPRequest(email, otp) {
    try {
        const response = await fetch(API_BASE_URL + 'auth/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            console.log('Email verified:', data.message);
            return { success: true };
        } else {
            console.warn('Verification failed:', data.message);
            return { succes: false };
        }
    } catch (error) {
        console.error('Error verifying email:', error);
        return { success: false };
    }
};

export async function finalize(userid) {
    try {
        const response = await fetch(API_BASE_URL + "auth/finalize-registration", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                userid
            })
        });


        const data = await response.json();

        if (response.ok) {
            const setCookieHeader = response.headers.get('Set-Cookie');
            console.log('Email verified:', data.message);
            console.log(setCookieHeader);
            if (setCookieHeader) {
                const match = setCookieHeader.match(/sessionToken=([^;]+)/);
                if (match) {
                    const sessionToken = match[1];
                    console.log('Session Token:', sessionToken);
                    return {success: true, sessionToken};
                }
                return { success: false};
            }
            return { success: false };
        } else {
            console.warn('Verification failed:', data.message);
            return { succes: false };
        }
    } catch (err) {
        console.error(err);
        return { success: false };
    }
}

export async function loginUser(identifier, password) {
    try {
        const response = await fetch(API_BASE_URL + "auth/login", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                identifier, password
            })
        });


        const data = await response.json();

        if (response.ok) {
            const setCookieHeader = response.headers.get('Set-Cookie');
            console.log(setCookieHeader);
            if (setCookieHeader) {
                const match = setCookieHeader.match(/sessionToken=([^;]+)/);
                if (match) {
                    const sessionToken = match[1];
                    console.log('Session Token:', sessionToken);
                    return {success: true, sessionToken, ...data};
                }
                return { success: false};
            }
            return { success: false };
        } else {
            console.warn('Verification failed:', data.message);
            return { success: false };
        }
    } catch (err) {
        console.error(err);
        return { success: false };
    }
}