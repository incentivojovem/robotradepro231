# Dz20.06 — Inteligência de mercado cripto

MVP navegável de uma plataforma de análise técnica e paper trading. A interface foi construída sem dependências externas de execução para abrir imediatamente, inclusive sem chaves de API.

## Acessar no navegador

- **Site:** [https://dz20-06.github.io/RobotradeDz20-06/](https://dz20-06.github.io/RobotradeDz20-06/)
- **Repositório:** [https://github.com/Dz20-06/RobotradeDz20-06](https://github.com/Dz20-06/RobotradeDz20-06)

Se o endereço do site ainda exibir erro 404, publique a pasta raiz da branch `main` em **Settings → Pages → Build and deployment → Deploy from a branch**, selecionando `main` e `/ (root)`. Aguarde a conclusão da publicação indicada pelo GitHub.

## Como abrir

Use o link do site acima. Para testes locais, abra `index.html` diretamente no navegador ou sirva a pasta com qualquer servidor estático.

## O que está implementado

- Dashboard responsivo com temas escuro e claro.
- Menu lateral recolhível no desktop, com modo compacto exibindo somente os ícones e preferência preservada no navegador.
- Catálogo de mercados Spot/USDT da Binance com busca, preço, variação e volume em 24 horas.
- Busca global por qualquer símbolo disponível na API e troca do ativo exibido no gráfico.
- Candles e preço atual da Binance Spot carregados automaticamente ao abrir a página.
- Atualização em tempo real por WebSocket (`aggTrade` e `bookTicker`), com reconexão e recuperação pela API REST.
- Proteção contra cotação vencida: entradas, saídas automáticas, DCA e alertas ficam pausados se o preço passar de 20 segundos sem atualização.
- Simulação de compra pelo melhor preço vendedor (`ask`) e venda pelo melhor preço comprador (`bid`).
- EMA 9, 21 e 50, MAPI adaptativa, volume e níveis de entrada, alvo e stop.
- MAPI configurável com Efficiency Ratio, correção de atraso, freio de volatilidade, projeção amortecida e faixas estatísticas de 68%/95%; a linha e seus complementos podem ser exibidos ou ocultados.
- Mapa de Tendência por preço e volume (PVT), com divergências de alta/baixa fortes, médias, fracas e ocultas marcadas no candle de confirmação.
- Cruzamentos baixistas de EMAs: identifica no fechamento o candle em que a EMA 9 cruza de cima para baixo a EMA 21, classifica a confirmação com preço/EMA 50 e marca o ponto exato no gráfico sem usar candles futuros.
- Canais visuais de alta e baixa calculados por pares de pivôs, com suporte, resistência paralela e faixa translúcida.
- Projeção futura com mediana e bandas de probabilidade.
- Troca de tempos gráficos e tooltip OHLCV, incluindo a opção **Mês** com os 30 candles diários mais recentes.
- Zoom temporal no estilo TradingView por roda do mouse, botões ou gesto de pinça; arrasto horizontal para navegar no histórico, duplo clique para redefinir e botão **Agora** para retornar ao preço atual.
- Reescala automática do eixo lateral conforme máximas, mínimas, indicadores e posições da janela visível, sem alterar o histórico usado pelos sinais do robô.
- Em tela cheia, resumo fixo acima da área de desenho com moeda/tempo, MAPI, tendência, projeção e modo operacional do robô, posicionado abaixo da barra de progresso quando existe uma operação.
- Gráfico principal ocupando toda a largura da visão geral, com o card de análise inteligente reposicionado abaixo dele.
- Card de cenários de preço em 1, 7 e 30 dias para o ativo selecionado, calculado com 120 candles diários da Binance, tendência robusta, volatilidade e faixa estatística de 68%.
- Score de entrada, contexto e probabilidade histórica.
- Simulador de operação com cálculo de alvo líquido incluindo taxas e slippage.
- Estratégias aplicáveis para scalping, intraday e swing trade.
- Robô Trade de paper trading com análise automática de médias, tendência, momentum e volume, entradas por confiança mínima e saídas por meta líquida, stop ou reversão.
- Modo de entrada selecionável: operação imediata após validar o sinal ou confirmação manual de cada nova seta verde antes de liberar a entrada automática.
- DCA inteligente em ciclos contínuos: divide o capital em 5 ou 10 parcelas iguais, amplia o espaçamento das compras conforme a volatilidade, recalcula preço médio/alvo após cada execução e vende o ciclo ao superar o lucro líquido mínimo sobre o capital usado.
- Meta líquida configurável no Boost, mantendo +0,20% como padrão.
- Página dedicada do Robô Trade em tela inteira, com status e métricas no topo, controles/posição à esquerda e histórico da sessão à direita em telas grandes.
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
- Modo **Boost Dinâmico** separado do Boost original: combina tendência das EMAs, MAPI/ER, projeção de inclinação, cruzamento altista 9/21, pullback, rompimento e volume. Exige três dos quatro regimes e ao menos um gatilho; usa score 52, ou 48 somente em alinhamento forte.
- Leitura do Boost Dinâmico dentro da vela aberta, confirmada por pelo menos três atualizações e 1,5 segundo de persistência. O modo limita a uma entrada por candle e mantém intervalo de cinco segundos depois de cada ação.
- Barra de progresso da operação automática baseada no preço comprador (`bid`), com uma casa decimal, entrada/0×0 em 50%, avanço verde até o alvo e zona vermelha abaixo de 50%.
- Estado visual **PAUSADO** quando a cotação estiver vencida e breve confirmação em 100% antes do fechamento automático.
- Marcadores históricos de entrada e saída calculados conforme a estratégia selecionada no painel do robô. A simulação percorre somente candles já disponíveis em cada ponto, inclui custos e aplica espaçamento mínimo de três candles no Boost/Boost Dinâmico ou cinco candles nos demais modos para reduzir a poluição visual.
- Séries, volatilidade, eixo temporal, indicadores e marcadores próprios para cada timeframe.
- Ponto de preço atual pulsante, registro de saída e trailing stop.
- Alertas flutuantes de proximidade e atingimento da meta com duração de três segundos.
- Trava 0×0 no modo Boost: stop, reversão, tempo ou pedido manual não realizam resultado negativo; a posição fica aberta e a projeção é recalculada até o breakeven ou alvo.
- Layout mobile com menu recolhível.

## Integridade dos preços

O site não cria cotações locais nem substitui uma falha da Binance por movimento aleatório. Ao perder a conexão, a interface informa que o mercado está pausado e impede novas decisões até receber novamente um preço válido de `BTCUSDT` (ou do mercado Spot/USDT selecionado). A fonte e o estado da conexão aparecem no cabeçalho.

Os candles avançam conforme o intervalo selecionado e recebem negociações reais do stream da Binance. Para evitar resultados otimistas, as entradas usam o `ask` e as saídas usam o `bid`, antes da aplicação das taxas e do slippage configurados.

## Próxima etapa para produção

Sincronizar carteira, posições abertas e alertas entre dispositivos por um backend e executar o motor de indicadores/backtests no servidor. A interface atual consome somente dados públicos da Binance e não solicita chave de API.

> Esta demonstração usa dados públicos da Binance Spot e não constitui recomendação financeira. Se a fonte ficar indisponível, as operações são pausadas; não existe fallback de preço simulado.

## Carteira e paper trading

A carteira começa com **1.000 USDT simulados**. Ao encerrar qualquer operação, o resultado líquido — após taxas e slippage — é lançado uma única vez no histórico e somado ao saldo. O capital de uma operação não pode ultrapassar o saldo disponível.

Os dados ficam salvos apenas no `localStorage` do navegador. O botão **Reiniciar simulação** permite escolher outro saldo inicial e apagar o histórico financeiro local. Nenhuma ordem real, depósito ou saque é executado.

## Ativar o login Google

1. No Google Cloud Console, crie um **OAuth Client ID** do tipo **Web application**.
2. Adicione `https://dz20-06.github.io` em **Authorized JavaScript origins**.
3. Abra o site, entre em **Configurações → Conta Google**, cole o Client ID terminado em `.apps.googleusercontent.com` e clique em **Salvar**.

O Client ID é público e pode ficar no navegador. Para autenticação de produção, permissões ou dados privados, valide o token do Google também em um backend seguro.

## Observação sobre a trava Boost

A trava 0×0 funciona somente nesta simulação: ela impede que o sistema registre uma saída negativa. Isso não elimina risco de mercado, não garante recuperação e pode deixar a posição e o capital presos por tempo indeterminado. Em negociação real, a ausência de stop pode ampliar perdas não realizadas, liquidação e risco operacional.

O mesmo alerta vale para a proteção 0×0 do DCA. O modo “24h” depende da página aberta e conectada; este projeto não possui servidor executando o robô quando o navegador é fechado. As parcelas DCA ficam reservadas dentro do capital total configurado e não usam multiplicador martingale.

O Boost Dinâmico também usa a trava 0×0. Ele avalia a vela em formação, mas só autoriza uma entrada depois que o alinhamento permanece válido por 1,5 segundo em pelo menos três atualizações. Mesmo assim, indicadores intravela podem mudar antes do fechamento; por isso o modo é experimental e deve ser validado em paper trading antes de qualquer integração com ordens reais.

## Indicador MAPI

Abra **Indicadores** na barra do gráfico para configurar a Média Adaptativa Preditiva Inteligente. O período do ER controla quanto histórico entra na leitura de eficiência; a correção de atraso aproxima a média do preço durante tendências limpas; o freio reduz essa correção quando a volatilidade está elevada; e o horizonte define quantos candles entram na projeção. O painel permite escolher separadamente as cores de subida e queda, e o botão **MAPI** permite ocultar ou exibir a linha rapidamente.

O cálculo usa 320 candles internos da Binance, mesmo quando o gráfico mostra somente os 92 mais recentes — ou 30 no modo **Mês** — para manter o aquecimento e o percentil de volatilidade. No tooltip, **ER** próximo de 1 indica movimento direcional mais eficiente; valores baixos indicam maior ruído.

A opção **Usar no sinal do robô** vem desligada por padrão. Quando ativada, cruzamento preço/MAPI, inclinação da média e ER passam a complementar a pontuação existente. Essa alteração fica bloqueada durante uma sessão ativa do robô para não mudar a regra de decisão no meio de uma operação. Projeção e faixas são estimativas, não promessa de preço ou lucro.

## Mapa de Tendência por preço e volume

O botão **Tendência**, ao lado da MAPI, abre a configuração do mapeamento. O motor calcula o **PVT (Price Volume Trend)** a partir da variação do fechamento ponderada pelo volume real de cada candle e compara o indicador com pivôs confirmados do preço.

São reconhecidos oito padrões: divergências de alta fortes, médias, fracas e ocultas; e divergências de baixa nas mesmas quatro categorias. A linha pontilhada conecta os dois pivôs analisados, enquanto o círculo e a seta aparecem no segundo pivô — o ponto em que o padrão passa a existir. O tooltip identifica o padrão e o PVT ao posicionar o cursor sobre esse candle.

Os canais de alta usam mínimas ascendentes como suporte e projetam uma resistência paralela. Os canais de baixa usam máximas descendentes como resistência e projetam o suporte. Janela do pivô, quantidade de sinais, tolerância de preço, zona neutra do PVT, rótulos e canais podem ser configurados.

O pivô só pode ser confirmado depois da quantidade de candles definida na janela; portanto, o marcador não é antecipado nem redesenhado como se já fosse conhecido no candle original. Nesta versão, o Mapa de Tendência é somente visual e não altera automaticamente a pontuação ou as operações do robô.

## Cruzamentos baixistas de EMAs

O botão **Cruzamentos**, ao lado da MAPI, exibe ou oculta os pontos em que a EMA 9 passa de cima para baixo da EMA 21. Esse evento é conhecido como cruzamento baixista de médias móveis ou, mais precisamente neste gráfico, cruzamento baixista de EMAs. O termo **Death Cross** não é usado porque normalmente se refere ao par de médias 50/200.

O marcador é criado somente depois do fechamento do candle do cruzamento. Ele recebe confirmação mais forte quando o preço já está abaixo da EMA 21 e a estrutura da EMA 50 também indica enfraquecimento. O algoritmo não exige uma queda posterior para validar o ponto, evitando viés retrospectivo. A função é visual e não abre, fecha ou altera operações automaticamente.

## Como o DCA inteligente funciona

O ciclo começa somente depois de um sinal válido. A primeira parcela usa `capital total ÷ número de entradas`. As próximas compras são executadas abaixo da última compra, com distância mínima calculada pela amplitude média dos 24 candles recentes (limitada entre 0,35% e 2,5%) e ampliada em 22% a cada nova parcela. Assim, duas parcelas não são registradas no mesmo preço e uma queda rápida não consome todo o capital de uma vez.

Depois de cada compra, o preço médio é recalculado por `capital acumulado ÷ quantidade acumulada`. O alvo deixa de ser um preço fixo original e passa a acompanhar esse novo preço médio, incluindo taxas, slippage e o lucro líquido mínimo configurado. O ciclo vende tudo quando o resultado líquido sobre o capital efetivamente executado supera o mínimo; por padrão, +0,20%.
