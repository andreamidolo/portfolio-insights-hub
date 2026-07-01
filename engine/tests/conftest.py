"""Configurazione pytest condivisa.

La suite valida la logica del motore sul **backbone sintetico deterministico**,
non sui dati Bloomberg (licenziati, assenti in CI). Disattiviamo la base Bloomberg
**all'import di conftest** (prima di qualsiasi fixture/collection), così anche i
fixture module-scoped che chiamano ``run_allocation`` ricadono sul backbone
campione — locale identico a CI, a prescindere dai file in ``engine/data/market/``.
"""

from __future__ import annotations

import os

# Impostato a import-time: precede i fixture module-scoped (es. test_pipeline).
os.environ.setdefault("AA_DISABLE_MARKET_BASE", "1")
