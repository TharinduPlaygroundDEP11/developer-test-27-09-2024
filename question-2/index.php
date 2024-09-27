<?php

function isPrime($num) {
    if ($num < 2) return false;
    for ($i = 2; $i <= sqrt($num); $i++) {
        if ($num % $i == 0) {
            return false;
        }
    }
    return true;
}

for ($i = 1; $i <= 50; $i++) {

    if ($i % 3 == 0 && $i % 5 == 0) {
        echo "FizzBuzz\n";
    }

    else if ($i % 3 == 0) {
        echo "Fizz\n";
    }

    else if ($i % 5 == 0) {
        echo "Buzz\n";
    }

    else if (isPrime($i)) {
        echo "Prime\n";
    }

    else {
        echo $i . "\n";
    }
}
?>
