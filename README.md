# Vela — Inteligência de mercado cripto

MVP navegável de uma plataforma de análise técnica e paper trading. A interface foi construída sem dependências externas de execução para abrir imediatamente, inclusive sem chaves de API.

## Como abrir

Abra `index.html` diretamente no navegador ou sirva a pasta com qualquer servidor estático.

## O que está implementado

- Dashboard responsivo com temas escuro e claro.
- Catálogo de mercados Spot/USDT da Binance com busca, preço, variação e volume em 24 horas.
- Busca global por qualquer símbolo disponível na API e troca do ativo exibido no gráfico.
- Candles e preço atual da Binance, com fallback automático para dados simulados quando a API não estiver acessível.
- EMA 9, 21 e 50, volume e níveis de entrada, alvo e stop.
- Projeção futura com mediana e bandas de probabilidade.
- Troca de tempos gráficos e tooltip OHLCV.
- Score de entrada, contexto e probabilidade histórica.
- Simulador de operação com cálculo de alvo líquido incluindo taxas e slippage.
- Estratégias aplicáveis para scalping, intraday e swing trade.
- Robô Trade de paper trading com análise automática de médias, tendência, momentum e volume, entradas por confiança mínima e saídas por meta líquida, stop ou reversão.
- Controle de capital por operação, limite por sessão, resultado acumulado e histórico das operações automáticas.
- Modo Boost agressivo em 5 minutos, com confiança mínima reduzida, reentrada rápida e encerramento automático ao alcançar +0,20% de lucro líquido após taxas e slippage.
- Barra de progresso da operação automática: entrada em 50%, avanço verde até o alvo e zona vermelha abaixo de 50% na direção do stop.
- Marcadores históricos apenas para entradas com resultado entre +0,4% e +1%.
- Séries, volatilidade, eixo temporal, indicadores e marcadores próprios para cada timeframe.
- Ponto de preço atual pulsante, registro de saída e trailing stop.
- Alertas flutuantes de proximidade e atingimento da meta com duração de três segundos.
- Layout mobile com menu recolhível.

## Próxima etapa para produção

Adicionar WebSocket para atualizações a cada negociação, persistir paper trades e alertas e executar o motor de indicadores/backtests no servidor. A interface consome somente endpoints públicos da Binance e não solicita chave de API.

> Esta demonstração usa dados públicos com fallback simulado e não constitui recomendação financeira.
