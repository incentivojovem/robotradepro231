# Vela — Inteligência de mercado cripto

MVP navegável de uma plataforma de análise técnica e paper trading. A interface foi construída sem dependências externas de execução para abrir imediatamente, inclusive sem chaves de API.

## Como abrir

Abra `index.html` diretamente no navegador ou sirva a pasta com qualquer servidor estático.

## O que está implementado

- Dashboard responsivo com temas escuro e claro.
- Busca e troca de ativos.
- Candles gerados de forma determinística e atualização simulada em tempo real.
- EMA 9, 21 e 50, volume e níveis de entrada, alvo e stop.
- Projeção futura com mediana e bandas de probabilidade.
- Troca de tempos gráficos e tooltip OHLCV.
- Score de entrada, contexto e probabilidade histórica.
- Simulador de operação com cálculo de alvo líquido incluindo taxas e slippage.
- Estratégias aplicáveis para scalping, intraday e swing trade.
- Marcadores históricos apenas para entradas com resultado entre +0,4% e +1%.
- Séries, volatilidade, eixo temporal, indicadores e marcadores próprios para cada timeframe.
- Ponto de preço atual pulsante, registro de saída e trailing stop.
- Alertas flutuantes de proximidade e atingimento da meta com duração de três segundos.
- Layout mobile com menu recolhível.

## Próxima etapa para produção

Substituir o gerador local por REST + WebSocket da Binance, criar o backend para manter chaves da CoinGecko/CoinMarketCap, persistir paper trades e alertas, e executar o motor de indicadores/backtests no servidor. A interface já separa visualmente dados de mercado, análise e operação para receber essas integrações.

> Esta demonstração usa dados simulados e não constitui recomendação financeira.
