#!/usr/bin/env bash
# refresh_market_data.sh — aggiorna la base dati Bloomberg del motore.
#
# Da eseguire SULL'HOST che serve l'engine (es. il Mac mini). Fa:
#   1) git pull (codice aggiornato)
#   2) ETL Excel Bloomberg -> engine/data/market/prices.csv (gitignored)
#   3) verifica che i prezzi ci siano
# Il RESTART del servizio è manuale (dipende da come lanci l'engine — vedi in fondo).
#
# Uso (dalla root del repo o da engine/):
#   bash engine/scripts/refresh_market_data.sh /percorso/di/solo_valori.xlsx
#
# Variabili opzionali:
#   PY=/percorso/al/venv/bin/python   # interprete da usare (default: engine/.venv/bin/python)
set -euo pipefail

XLSX="${1:?Uso: bash engine/scripts/refresh_market_data.sh /path/solo_valori.xlsx}"

# Posizionati nella cartella 'engine' (lo script sta in engine/scripts/).
ENGINE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ENGINE_DIR"
[ -d src/aa_engine ] || { echo "ERRORE: 'engine/src/aa_engine' non trovato in $ENGINE_DIR"; exit 1; }

# 1) codice aggiornato (default Bloomberg + schemi corretti)
git pull --ff-only || echo "(!) git pull non ff — verifica lo stato del branch"

# 2) interprete
PY="${PY:-.venv/bin/python}"
[ -x "$PY" ] || PY="python3"

# 3) ETL: Excel -> data/market/{prices,vol_indices,...}.csv
"$PY" -m aa_engine.data.bloomberg_import "$XLSX"

# 4) verifica
if [ -f data/market/prices.csv ]; then
  echo "OK: data/market/prices.csv creato."
else
  echo "ERRORE: data/market/prices.csv non creato."; exit 1
fi

cat <<'EOF'

==============================================================
 Dati pronti. Ora RIAVVIA il motore, poi verifica con:
   curl http://localhost:8000/api/v1/data/universe
   -> deve dire  "source":"bloomberg"  con ticker reali (SPY, LQD, ...)
   (se dice "sample" con EQ_DM/... l'engine non è stato riavviato
    o non vede data/market/prices.csv)

 RESTART (scegli in base a come lanci l'engine):
   • uvicorn a mano:
       pkill -f 'uvicorn aa_engine' || true
       .venv/bin/python -m uvicorn aa_engine.api.main:app --host 0.0.0.0 --port 8000
   • launchd:   launchctl kickstart -k gui/$(id -u)/<label-servizio>
   • pm2:       pm2 restart <nome-app>
   • docker:    docker compose restart <servizio>
==============================================================
EOF
