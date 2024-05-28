<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <script src="./js/pages/signIn.js" type="module" defer></script>

    <link rel="stylesheet" href="./css/main.css">
    <link rel="stylesheet" href="./css/signIn/signIn.css">
</head>

<body>
    <main class="signInContainer pattern">
        <h1>Sign in!</h1>
        <a class="back" href="./index.php">Back</a>

        <form action="./sql/session/handleSignIn.php" class="ubuntu-medium" method="post">
            <section class="inputsContainer">
                <div class="inputs">

                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" class="ubuntu-light" required>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" class="ubuntu-light" required>
                </div>
                <div class="imageContainer">
                </div>
            </section>
            <p>‎</p>
            <input type="submit" value="Sign In">
            <a href="./signUp.php">You don't have an account?</a>
    </main>
</body>

</html>