#!/bin/bash

# Bucle infinito para ejecutar el comando cada segundo
while true; do
    /opt/lampp/bin/php /opt/lampp/htdocs/chips-combo/sql/game/handleQueues.php
    sleep 1  # Pausa de 1 segundo
done
