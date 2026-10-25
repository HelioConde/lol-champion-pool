<div align="center">
  <h1>🎯 LoL Champion Pool</h1>
  <p><strong>Monte um pool de até cinco campeões com base no seu histórico recente de League of Legends.</strong></p>
  <p><img alt="Status" src="https://img.shields.io/badge/status-MVP%20em%20valida%C3%A7%C3%A3o-64748b"> <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-Web-F7DF1E?logo=javascript&logoColor=black"></p>
</div>

## Como funciona

Pesquise por **Riot ID** e região para examinar campeões jogados, frequência, funções e desempenho observado. Depois escolha um grupo de até **cinco campeões** que você quer desenvolver.

| Métrica | Uso |
| --- | --- |
| Partidas e vitórias | Volume e resultados recentes |
| KDA médio | Indicador descritivo da amostra |
| Dano/minuto | Contexto adicional de desempenho |
| Funções | Top, Jungle, Mid, ADC e Support |
| Sinal pessoal 0–100 | Pontuação relativa baseada em volume, KDA e resultado |
| Pool manual | Até cinco campeões, salvo no navegador |

**O sinal pessoal não é uma tier list** e não prevê vitória. A comparação não considera todos os fatores de uma partida, como matchup, patch, composição e adversários.

## Dados e privacidade

A aplicação consulta o endpoint `public-lol-profile` por meio do backend gamer. O backend pode trabalhar com **até 100 partidas recentes**, com foco nas modalidades previstas, mas o tamanho real da amostra varia. A chave Riot permanece no servidor.

O pool salvo e as buscas recentes usam `localStorage`; limpar o navegador pode apagar essas escolhas.

## Executar localmente

```bash
git clone https://github.com/HelioConde/lol-champion-pool.git
cd lol-champion-pool
python -m http.server 8000
```

Abra `http://localhost:8000`. Para verificações automatizadas:

```bash
npm install
npm run check
npm run test:e2e
```

Os testes dependem de Playwright configurado. A execução do frontend não garante disponibilidade do backend Riot.

**Estado:** MVP implementado e em validação. Experimentos de IA, rankings globais ou novas funções devem vir depois de QA e feedback.

Projeto independente, não oficial, não afiliado à Riot Games. Criado por [Hélio Conde](https://github.com/HelioConde).
