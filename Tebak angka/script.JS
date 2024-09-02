let randomNumber = Math.floor(Math.random() * 100) + 1;

function checkGuess() {
    const userGuess = parseInt(document.getElementById('guess').value);
    const resultElement = document.getElementById('result');

    if (isNaN(userGuess)) {
        resultElement.textContent = 'Tolong masukkan angka yang valid!';
    } else if (userGuess < 1 || userGuess > 100) {
        resultElement.textContent = 'Angka harus antara 1 dan 100!';
    } else if (userGuess === randomNumber) {
        resultElement.textContent = 'Selamat! Tebakan Anda benar!';
        document.getElementById('restart-btn').style.display = 'inline-block'; // Show restart button
    } else if (userGuess < randomNumber) {
        resultElement.textContent = 'Terlalu rendah! Coba lagi.';
    } else {
        resultElement.textContent = 'Terlalu tinggi! Coba lagi.';
    }
}

function restartGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    document.getElementById('guess').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('restart-btn').style.display = 'none'; // Hide restart button
}
