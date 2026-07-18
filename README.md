# Dz20.06 — Inteligência de mercado cripto

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
- Carteira simulada persistente com saldo inicial configurável de 1.000 USDT, saldo atual e resultado acumulado.
- Consolidação automática de lucros e perdas manuais ou do robô no mesmo livro-caixa.
- Indicadores separados de lucros do dia, perdas do dia, resultado líquido e desempenho por estratégia.
- Paper trades completos com filtro manual/robô, taxa de acerto, melhor estratégia, preços, capital e resultado líquido.
- Alertas de preço por ativo e condição, além de um feed persistente de entradas, saídas, metas e stops.
- Login de perfil pelo Google Identity Services, com nome, e-mail, foto e opção de desconectar.
- Painel de configurações com idiomas português/inglês e moeda padrão USD, EUR ou BRL.
- Conversão de preços, gráfico, metas, carteira, resultados e alertas pela API pública Frankfurter, com fallback local.
- Persistência local no navegador para carteira, histórico e alertas, sem conta ou backend.
- Modo Boost agressivo em 5 minutos, com confiança mínima reduzida, reentrada rápida e encerramento automático ao alcançar +0,20% de lucro líquido após taxas e slippage.
- Barra de progresso da operação automática: entrada em 50%, avanço verde até o alvo e zona vermelha abaixo de 50% na direção do stop.
- Marcadores históricos apenas para entradas com resultado entre +0,4% e +1%.
- Séries, volatilidade, eixo temporal, indicadores e marcadores próprios para cada timeframe.
- Ponto de preço atual pulsante, registro de saída e trailing stop.
- Alertas flutuantes de proximidade e atingimento da meta com duração de três segundos.
- Trava 0×0 no modo Boost: stop, reversão, tempo ou pedido manual não realizam resultado negativo; a posição fica aberta e a projeção é recalculada até o breakeven ou alvo.
- Layout mobile com menu recolhível.

## Próxima etapa para produção

Adicionar WebSocket para atualizações a cada negociação, sincronizar carteira e alertas entre dispositivos por um backend e executar o motor de indicadores/backtests no servidor. A interface atual consome somente endpoints públicos da Binance e não solicita chave de API.

> Esta demonstração usa dados públicos com fallback simulado e não constitui recomendação financeira.

## Carteira e paper trading

A carteira começa com **1.000 USDT simulados**. Ao encerrar qualquer operação, o resultado líquido — após taxas e slippage — é lançado uma única vez no histórico e somado ao saldo. O capital de uma operação não pode ultrapassar o saldo disponível.

Os dados ficam salvos apenas no `localStorage` do navegador. O botão **Reiniciar simulação** permite escolher outro saldo inicial e apagar o histórico financeiro local. Nenhuma ordem real, depósito ou saque é executado.

## Ativar o login Google

1. No Google Cloud Console, crie um **OAuth Client ID** do tipo **Web application**.
2. Adicione `https://incentivojovem.github.io` em **Authorized JavaScript origins**.
3. Abra o site, entre em **Configurações → Conta Google**, cole o Client ID terminado em `.apps.googleusercontent.com` e clique em **Salvar**.

O Client ID é público e pode ficar no navegador. Para autenticação de produção, permissões ou dados privados, valide o token do Google também em um backend seguro.

## Observação sobre a trava Boost

A trava 0×0 funciona somente nesta simulação: ela impede que o sistema registre uma saída negativa. Isso não elimina risco de mercado, não garante recuperação e pode deixar a posição e o capital presos por tempo indeterminado. Em negociação real, a ausência de stop pode ampliar perdas não realizadas, liquidação e risco operacional.
