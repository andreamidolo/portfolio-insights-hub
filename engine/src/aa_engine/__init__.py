"""aa_engine — Motore interno di asset allocation quantitativa .

Architettura a quattro stadi:
    1. signals       — segnali e security selection
    2. optimization  — ottimizzazione di portafoglio (40+ modelli)
    3. backtest      — walk-forward, cross-validation, simulazioni
    4. risk          — risk management stratificato (PRIMO MATTONE)

Vedi docs/ per specifiche e roadmap.
"""

__version__ = "0.1.0"
