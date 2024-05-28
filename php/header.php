<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Header</title>
    <link rel="stylesheet" href="./css/main.css">
</head>

<style>
    header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 5em;
        background-color: #8338c9;
        display: flex;
        justify-content: space-between;
    }

    header ~ * {
        margin-top: 1em;
    }

    header .logoContainer {
        width: 12.5em;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    header .logoContainer a {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1em;
        text-decoration: none;
    }

    header .logoContainer>a * {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: "Minecraft", Fallback, sans-serif;
        color: black;
        font-size: 1.3em;
    }

    header .logoContainer img {
        width: 3em;
        height: 3em;
        object-fit: contain;
    }

    header .middleContainer {
        width: 50%;

        display: flex;
        justify-content: space-around;
        align-items: center;

        font-family: "Minecraft", Fallback, sans-serif;
    }

    header .middleContainer a {
        color: white;
        padding: 0.7em;
    }

    header .middleContainer a:hover {
        color: white;
        padding: 0.7em;
        border-radius: 0.5em;
        background-color: rgba(255,255,255,0.35);
    }
    
    header .sessionContainer {
        width: 10em;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    header .sessionContainer a {
        width: 80%;
        height: 80%;
        padding: 0.2em;
        border-radius: 0.5em;
        
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5em;

        color: black;
    }

    header .sessionContainer a:hover {
        background-color: rgba(255,255,255,0.5);
    }


    header nav .mainContent button {
        font-size: 10px;
    }

    header .sessionContainer article {
        width: 1.5em;
        height: 1.5em;
        padding: 0.5em;
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    header .sessionContainer article img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    header .sessionContainer p {
        font-size: 0.7em;
        margin: 0;
        font-family: "Minecraft", Fallback, sans-serif;
        padding: 0.2em;

    }
</style>

<body>
    <header>
        <section class="logoContainer">
            <a href="/chips-combo/index.php">
                <img src="./assets/icons/1.png" alt="Logo">
            </a>
        </section>
        <section class="middleContainer">
            <a href="./play.php">News</a>
            <a href="./play.php">Play</a>
        </section>
        <section class="sessionContainer">
            
        </section>
    </header>

    <script type="module">
        const sessionContainer = document.querySelector("header .sessionContainer");

        import { readSessions } from "./js/classes/Session.js";
        import { readPlayerById } from "./js/classes/Player.js";

        async function getSession() {
            const sessions = await readSessions();
            const token = getSessionToken();
            for (let session of sessions) {
                if (session.se_token === token) {
                    return session;
                }
            }
            return null;
        }

        function getSessionToken() {
            const cookies = document.cookie.split(";");
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split("=");
                if (name === "sessionToken") {
                    return value;
                }
            }
            return null;
        }

        getSession().then((session) => {
            if (session) {
                readPlayerById(session.se_playerId).then((player) => {
                    const profileIcon = document.createElement("img");
                    const imageContainer = document.createElement("article");
                    const nameContainer = document.createElement("p");
                    const anchor = document.createElement("a");

                    const icon = player.pl_iconId;
                    const name = player.pl_name;
                    const tag = player.pl_tag;

                    profileIcon.src = `./assets/icons/${icon}.png`;
                    profileIcon.alt = "Profile Image";

                    anchor.href = "./logout.php";

                    nameContainer.textContent = `${name}#${tag}`;

                    imageContainer.appendChild(profileIcon);
                    anchor.appendChild(imageContainer);
                    anchor.appendChild(nameContainer);

                    sessionContainer.appendChild(anchor)
                })
            } else {
                const profileButton = document.createElement("button");
                profileButton.textContent = "Sign in"

                profileButton.addEventListener("click", () => {
                    window.location.href = "./signIn.php"
                })

                sessionContainer.appendChild(profileButton)
            }
        }).catch((error) => {
            console.error("Error al obtener la sesión:", error);
        });
    </script>
</body>

</html>