const FINANCE_STORAGE_KEY='vela-paper-finance-v1';

function financeId(prefix='item'){
  if(globalThis.crypto?.randomUUID)return`${prefix}-${crypto.randomUUID()}`;
  return`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
}

function localDayKey(timestamp=Date.now()){
  const date=new Date(timestamp),pad=value=>String(value).padStart(2,'0');
  return`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
}

function usdt(value,digits=2){
  return`${Number(value||0).toLocaleString('pt-BR',{minimumFractionDigits:digits,maximumFractionDigits:digits})} USDT`;
}

function signedUsdt(value){
  const number=Number(value)||0;
  return`${number>0?'+':number<0?'−':''}${Math.abs(number).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})} USDT`;
}

function restoreFinanceState(){
  let saved=null;
  try{saved=JSON.parse(localStorage.getItem(FINANCE_STORAGE_KEY)||'null')}catch(error){saved=null}
  const initial=Number(saved?.initialBalance);
  const initialBalance=Number.isFinite(initial)&&initial>=10?initial:1000;
  const trades=Array.isArray(saved?.trades)?saved.trades.filter(trade=>trade&&Number.isFinite(Number(trade.value))).slice(0,500):[];
  const alerts=Array.isArray(saved?.alerts)?saved.alerts.filter(alert=>alert&&Number.isFinite(Number(alert.target))).slice(0,100):[];
  const notifications=Array.isArray(saved?.notifications)?saved.notifications.filter(Boolean).slice(0,100):[];
  const result=trades.reduce((sum,trade)=>sum+Number(trade.value||0),0);
  state.portfolio={initialBalance,balance:Math.max(0,initialBalance+result),trades,alerts,notifications};
}

function saveFinanceState(){
  try{
    localStorage.setItem(FINANCE_STORAGE_KEY,JSON.stringify({
      initialBalance:state.portfolio.initialBalance,
      trades:state.portfolio.trades.slice(0,500),
      alerts:state.portfolio.alerts.slice(0,100),
      notifications:state.portfolio.notifications.slice(0,100)
    }));
  }catch(error){/* O modo privado pode bloquear o armazenamento; a sessão continua em memória. */}
}

function recalculateWallet(){
  const result=state.portfolio.trades.reduce((sum,trade)=>sum+Number(trade.value||0),0);
  state.portfolio.balance=Math.max(0,state.portfolio.initialBalance+result);
  return state.portfolio.balance;
}

function walletStats(){
  const today=localDayKey(),trades=state.portfolio.trades;
  const todayTrades=trades.filter(trade=>localDayKey(trade.closedAt)===today);
  const profits=todayTrades.filter(trade=>trade.value>0).reduce((sum,trade)=>sum+trade.value,0);
  const losses=Math.abs(todayTrades.filter(trade=>trade.value<0).reduce((sum,trade)=>sum+trade.value,0));
  const net=trades.reduce((sum,trade)=>sum+Number(trade.value||0),0);
  const wins=trades.filter(trade=>trade.value>0).length;
  return{profits,losses,net,wins,total:trades.length,winRate:trades.length?wins/trades.length*100:0};
}

function strategyStats(){
  const groups=new Map();
  state.portfolio.trades.forEach(trade=>{
    const key=trade.strategy||'Sem estratégia';
    const item=groups.get(key)||{name:key,total:0,wins:0,result:0};
    item.total+=1;item.result+=Number(trade.value||0);if(trade.value>0)item.wins+=1;groups.set(key,item);
  });
  const configured=Object.values(strategies).map(strategy=>strategy.label);
  configured.forEach(name=>{if(!groups.has(name))groups.set(name,{name,total:0,wins:0,result:0})});
  return[...groups.values()].sort((a,b)=>b.result-a.result);
}

function pushNotification(title,text,kind='success'){
  state.portfolio.notifications.unshift({id:financeId('notice'),title:String(title),text:String(text),kind,createdAt:Date.now()});
  state.portfolio.notifications=state.portfolio.notifications.slice(0,100);
}

function addNotification(title,text,kind='success'){
  pushNotification(title,text,kind);saveFinanceState();renderAlerts();
}

function settleTrade(position,exitPrice,reason){
  const entry=Number(position.entry),exit=Number(exitPrice),investment=Math.min(Number(position.investment)||0,state.portfolio.balance),fees=Math.max(0,Number(position.fees)||0);
  if(!Number.isFinite(entry)||entry<=0||!Number.isFinite(exit)||exit<=0||investment<=0)throw new Error('Dados financeiros inválidos para encerrar a operação.');
  const gross=(exit/entry-1)*100,calculatedNet=gross-fees*100;
  const value=Math.max(-investment,investment*calculatedNet/100),net=value/investment*100,closedAt=Date.now();
  const record={
    id:financeId('trade'),symbol:position.symbol||state.asset,marketSymbol:position.marketSymbol||state.marketSymbol,
    owner:position.owner==='robot'?'robot':'manual',strategy:position.strategy||'Manual',entry,exit,investment,fees,
    gross,net,value,score:Number(position.score)||0,reason:String(reason||'Saída registrada'),openedAt:Number(position.openedAt)||closedAt,closedAt,
    time:new Date(closedAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
    date:new Date(closedAt).toLocaleDateString('pt-BR')
  };
  state.portfolio.trades.unshift(record);state.portfolio.trades=state.portfolio.trades.slice(0,500);recalculateWallet();
  pushNotification(value>=0?'Operação encerrada com lucro':'Operação encerrada com perda',`${record.symbol}/USDT · ${signedUsdt(value)} · ${record.strategy}`,value>=0?'success':'loss');
  saveFinanceState();renderFinance();return record;
}

function tradeRow(trade){
  const resultClass=trade.value>=0?'profit':'loss',owner=trade.owner==='robot'?'Robô':'Manual';
  return`<div class="finance-row"><span><strong>${escapeHtml(trade.symbol)}/USDT · ${owner}</strong><small>${escapeHtml(trade.date||'')} ${escapeHtml(trade.time||'')}</small></span><span><strong>${escapeHtml(trade.strategy||'Manual')}</strong><small>${escapeHtml(trade.reason||'Saída')}</small></span><span><strong>${formatPrice(Number(trade.entry))} → ${formatPrice(Number(trade.exit))}</strong><small>Capital ${usdt(trade.investment)}</small></span><b class="${resultClass}">${signedUsdt(trade.value)}<small>${trade.net>=0?'+':''}${Number(trade.net).toFixed(2).replace('.',',')}%</small></b></div>`;
}

function emptyFinance(title,text){
  return`<div class="finance-empty"><span>◎</span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(text)}</small></div>`;
}

function renderWallet(){
  const stats=walletStats(),initial=state.portfolio.initialBalance,balance=recalculateWallet(),returnPct=initial?(balance/initial-1)*100:0;
  $('#walletBalance').textContent=usdt(balance);$('#walletInitialBalance').textContent=initial.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  $('#walletTodayProfit').textContent=`+${stats.profits.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`;$('#walletTodayLoss').textContent=`−${stats.losses.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  $('#walletNetResult').textContent=signedUsdt(stats.net).replace(' USDT','');$('#walletNetResult').className=stats.net>=0?'positive':'negative';
  $('#walletTradeSummary').textContent=`${stats.total} ${stats.total===1?'operação':'operações'} · ${stats.winRate.toFixed(0)}% acerto`;
  $('#walletTotalReturn').textContent=`${returnPct>=0?'+':''}${returnPct.toFixed(2).replace('.',',')}% desde o início`;
  $('#walletNavBalance').textContent=balance.toLocaleString('pt-BR',{maximumFractionDigits:0});$('#sidebarBalance').textContent=usdt(balance);
  $('#walletStrategies').innerHTML=strategyStats().slice(0,4).map(item=>`<div class="strategy-stat"><span><small>${escapeHtml(item.name)}</small><i></i></span><strong class="${item.result>=0?'positive':'negative'}">${signedUsdt(item.result)}</strong><b>${item.total} operações · ${item.total?Math.round(item.wins/item.total*100):0}% acerto</b></div>`).join('');
  const recent=state.portfolio.trades.slice(0,5);$('#walletRecentTrades').innerHTML=recent.map(tradeRow).join('')||emptyFinance('Nenhum lançamento realizado','Encerre uma operação manual ou automática para atualizar a carteira.');
}

function renderPaperTrades(){
  const stats=walletStats(),filter=$('#paperModeFilter')?.value||'all',filtered=state.portfolio.trades.filter(trade=>filter==='all'||trade.owner===filter),strategiesData=strategyStats().filter(item=>item.total>0);
  $('#paperTotalTrades').textContent=stats.total;$('#paperWinRate').textContent=`${stats.winRate.toFixed(0)}%`;
  $('#paperNetResult').textContent=signedUsdt(stats.net);$('#paperNetResult').className=stats.net>=0?'positive':'negative';
  $('#paperBestStrategy').textContent=strategiesData[0]?.name||'—';$('#paperFilteredCount').textContent=`${filtered.length} ${filtered.length===1?'registro':'registros'}`;
  $('#paperTradesBadge').textContent=String(stats.total);$('#paperTradesList').innerHTML=filtered.map(tradeRow).join('')||emptyFinance('Nenhum paper trade encontrado','As operações encerradas aparecerão aqui com o resultado líquido.');
}

function renderAlerts(){
  const alerts=state.portfolio.alerts,active=alerts.filter(alert=>alert.active).length;
  $('#alertsBadge').textContent=String(active);$('#alertAsset').textContent=`${state.asset}/USDT`;
  $('#priceAlertsList').innerHTML=alerts.map(alert=>`<div class="alert-row"><span><strong>${escapeHtml(alert.symbol)}/USDT</strong><small>${alert.condition==='above'?'Atingir ou superar':'Cair até ou abaixo'}</small></span><span><b>${formatPrice(Number(alert.target))}</b><small>Criado ${new Date(alert.createdAt).toLocaleDateString('pt-BR')}</small></span><span class="alert-status ${alert.active?'':'triggered'}">${alert.active?'ATIVO':'DISPARADO'}</span><button class="delete-alert" data-alert-id="${escapeHtml(alert.id)}" aria-label="Excluir alerta">×</button></div>`).join('')||emptyFinance('Nenhum alerta configurado','Escolha uma condição e um preço-alvo para começar.');
  $$('.delete-alert[data-alert-id]').forEach(button=>button.onclick=()=>deletePriceAlert(button.dataset.alertId));
  const notices=state.portfolio.notifications.slice(0,20);$('#notificationFeed').innerHTML=notices.map(notice=>`<div class="notification-item ${notice.kind==='loss'?'loss':''}"><i>${notice.kind==='loss'?'↘':'✓'}</i><span><strong>${escapeHtml(notice.title)}</strong><small>${escapeHtml(notice.text)}</small></span><time>${new Date(notice.createdAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</time></div>`).join('')||emptyFinance('Sem atividade recente','Os eventos importantes do robô e das operações aparecerão aqui.');
}

function renderFinance(){renderWallet();renderPaperTrades();renderAlerts()}

function prepareAlertForm(){
  $('#alertAsset').textContent=`${state.asset}/USDT`;const input=$('#alertTarget');
  if(!input.value)input.value=Number(state.currentPrice).toFixed(priceDigits(state.currentPrice));
}

function createPriceAlert(event){
  event.preventDefault();const target=Number($('#alertTarget').value),condition=$('#alertCondition').value;
  if(!Number.isFinite(target)||target<=0){showToast('Preço inválido','Informe um preço-alvo maior que zero.','exit');return}
  state.portfolio.alerts.unshift({id:financeId('alert'),symbol:state.asset,marketSymbol:state.marketSymbol,condition,target,active:true,triggeredAt:null,createdAt:Date.now()});
  state.portfolio.alerts=state.portfolio.alerts.slice(0,100);saveFinanceState();renderAlerts();showToast('Alerta criado',`${state.asset}/USDT será monitorado em ${formatPrice(target)}.`);$('#alertTarget').value='';prepareAlertForm();
}

function deletePriceAlert(id){
  state.portfolio.alerts=state.portfolio.alerts.filter(alert=>alert.id!==id);saveFinanceState();renderAlerts();
}

function evaluatePriceAlerts(){
  const triggered=[];
  state.portfolio.alerts.forEach(alert=>{
    if(!alert.active||alert.marketSymbol!==state.marketSymbol)return;
    const hit=alert.condition==='above'?state.currentPrice>=alert.target:state.currentPrice<=alert.target;
    if(hit){alert.active=false;alert.triggeredAt=Date.now();triggered.push(alert)}
  });
  if(!triggered.length)return;
  triggered.forEach(alert=>pushNotification('Alerta de preço disparado',`${alert.symbol}/USDT atingiu ${formatPrice(alert.target)}.`,'success'));
  saveFinanceState();renderAlerts();const alert=triggered[0];showToast('Alerta de preço disparado',`${alert.symbol}/USDT · ${formatPrice(state.currentPrice)}.`);
}

function resetWalletSimulation(){
  if(state.order.active||state.robot.active||state.robot.starting){showToast('Operação em andamento','Encerre a operação e pare o robô antes de reiniciar a carteira.','exit');return}
  const initial=Number($('#initialBalanceInput').value);
  if(!Number.isFinite(initial)||initial<10){showToast('Saldo inicial inválido','Use um valor igual ou superior a 10 USDT.','exit');return}
  if(!confirm('Reiniciar a carteira e apagar todo o histórico de paper trades deste navegador?'))return;
  state.portfolio.initialBalance=initial;state.portfolio.balance=initial;state.portfolio.trades=[];state.portfolio.notifications=[];state.robot.trades=[];state.robot.sessionProfit=0;
  saveFinanceState();renderFinance();renderRobotUI();showToast('Simulação reiniciada',`Novo saldo inicial: ${usdt(initial)}.`);
}

function openFinanceView(view){
  const map={Carteira:'#walletModal','Paper trades':'#paperTradesModal',Alertas:'#alertsModal'},selector=map[view];if(!selector)return false;
  if(view==='Alertas')prepareAlertForm();renderFinance();const dialog=$(selector);if(typeof dialog?.showModal==='function'&&!dialog.open)dialog.showModal();return true;
}

function setupFinanceUI(){
  $('#portfolioBtn').onclick=()=>openFinanceView('Carteira');$('#notificationBtn').onclick=()=>openFinanceView('Alertas');
  $('#closeWallet').onclick=()=>$('#walletModal').close();$('#closePaperTrades').onclick=()=>$('#paperTradesModal').close();$('#closeAlerts').onclick=()=>$('#alertsModal').close();
  $('#openPaperFromWallet').onclick=()=>{$('#walletModal').close();openFinanceView('Paper trades')};
  $('#paperModeFilter').onchange=renderPaperTrades;$('#alertForm').onsubmit=createPriceAlert;$('#resetWalletBtn').onclick=resetWalletSimulation;
  $('#clearNotificationsBtn').onclick=()=>{state.portfolio.notifications=[];saveFinanceState();renderAlerts()};
}

function initializeFinance(){restoreFinanceState();$('#initialBalanceInput').value=String(state.portfolio.initialBalance);setupFinanceUI();renderFinance()}
function availablePaperBalance(){return Math.max(0,Number(state.portfolio.balance)||0)}
