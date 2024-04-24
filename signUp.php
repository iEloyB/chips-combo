<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <script src="./js/pages/signUp.js" type="module" defer></script>

    <link rel="stylesheet" href="./css/main.css">
    <link rel="stylesheet" href="./css/signUp/signUp.css">
</head>

<body>

    <main class="signUpContainer pattern">
        <a class="back" href="./index.php">Back</a>

        <h1>Sign up!</h1>
        <form action="./sql/session/handleSignUp.php" class="ubuntu-medium" method="post">
            <section class="inputsContainer">
                <div class="inputs">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" class="ubuntu-light" required>
                    <label for="tag">Tag:</label>
                    <input type="text" id="tag" name="tag" class="ubuntu-light" required>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" class="ubuntu-light" required>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" class="ubuntu-light" required>
                </div>
                <div class="imageContainer">
                </div>
            </section>
            <p>‎</p>
            <input type="submit" value="Sign Up">
            <a href="./signIn.php">Already have an account?</a>
        </form>
    </main>
</body>

</html>