<?php


function reverseStringSkippingNumbers($input) {
    $chars = str_split($input);
    
    $nonNumericChars = [];
    
    for ($i = count($chars) - 1; $i >= 0; $i--) {
        if (!ctype_digit($chars[$i])) {
            $nonNumericChars[] = $chars[$i];
        }
    }
    
    $nonNumericIndex = 0;
    
    $result = '';
    foreach ($chars as $char) {
        if (ctype_digit($char)) {
            $result .= $char;
        } else {
            $result .= $nonNumericChars[$nonNumericIndex];
            $nonNumericIndex++;
        }
    }
    
    return $result;
}


$input = "pte2024";
$output = reverseStringSkippingNumbers($input);
echo $output;

?>
