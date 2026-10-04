const form = document.getElementById("signupForm");
const button = document.getElementById("signupButton");
const status = document.getElementById("statusMessage");
const results = document.getElementById("resultsSection");
const information = document.getElementById("informationSection");

if (typeof JSEncrypt === "undefined") {

    status.textContent =
        "JSEncrypt library was not loaded. Please check your internet connection.";

    status.className = "error";
}

function getFormData() {

    const name =
        document.getElementById("fullName").value.trim();
    const birthday =
        document.getElementById("birthDate").value;
    const year =
        document.getElementById("yearLevel").value;
    const gender =
        document.getElementById("gender").value;
    const username =
        document.getElementById("username").value.trim();
    const password =
        document.getElementById("password").value;

    return (
        "Name: " + name +
        " | Birthday: " + birthday +
        " | Year: " + year +
        " | Gender: " + gender +
        " | Username: " + username +
        " | Password: " + password
    );
}

function createRSA(size) {

    return new Promise(function(resolve, reject) {

        try {

            const rsa = new JSEncrypt({
                default_key_size: size
            });

            rsa.getKey(function() {
                resolve(rsa);
            });

        } catch (error) {

            reject(error);
        }

    });
}

function encryptData(text, rsa, blockSize) {

    let encrypted = [];

    for (
        let i = 0;
        i < text.length;
        i += blockSize
    ) {

        const part =
            text.substring(i, i + blockSize);

        const result =
            rsa.encrypt(part);

        if (!result) {
            throw new Error("RSA encryption failed.");
        }

        encrypted.push(result);
    }

    return encrypted.join("\n\n");
}

function decryptData(text, rsa) {

    const blocks =
        text.split("\n\n");

    let decrypted = "";

    for (const block of blocks) {

        const result =
            rsa.decrypt(block.trim());

        if (result === false) {
            throw new Error("RSA decryption failed.");
        }

        decrypted += result;
    }

    return decrypted;
}

function showInformation() {

    document.getElementById("infoFullName").textContent =
        document.getElementById("fullName").value;
    document.getElementById("infoBirthDate").textContent =
        document.getElementById("birthDate").value;
    document.getElementById("infoYearLevel").textContent =
        document.getElementById("yearLevel").value;
    document.getElementById("infoGender").textContent =
        document.getElementById("gender").value;
    document.getElementById("infoUsername").textContent =
        document.getElementById("username").value;
}

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }


    button.disabled = true;

    results.hidden = true;
    information.hidden = true;


    try {
        const data = getFormData();
        status.className = "loading";

        status.textContent =
            "Generating 1024-bit RSA key... Please wait.";


        const rsa1024 =
            await createRSA(1024);


        status.textContent =
            "Encrypting data using 1024-bit RSA...";
            const encrypted1024 =
            encryptData(
                data,
                rsa1024,
                80
            );


        const decrypted1024 =
            decryptData(
                encrypted1024,
                rsa1024
            );

        status.textContent =
            "Generating 3072-bit RSA key... Please wait.";


        const rsa3072 =
            await createRSA(3072);


        status.textContent =
            "Encrypting data using 3072-bit RSA...";


        const encrypted3072 =
            encryptData(
                data,
                rsa3072,
                250
            );


        const decrypted3072 =
            decryptData(
                encrypted3072,
                rsa3072
            );

        document.getElementById(
            "encrypted1024"
        ).value = encrypted1024;


        document.getElementById(
            "decrypted1024"
        ).value = decrypted1024;

        document.getElementById(
            "encrypted3072"
        ).value = encrypted3072;


        document.getElementById(
            "decrypted3072"
        ).value = decrypted3072;

        showInformation();


        results.hidden = false;

        information.hidden = false;

        status.className = "success";

        status.textContent =
            "✓ Enrollment successful!";


    } catch (error) {

        console.error(error);

        status.className = "error";

        status.textContent =
            "✕ Error: " + error.message;

    } finally {

        button.disabled = false;
    }

})
