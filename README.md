# LoL Champion Pool

Produto League of Legends do **Ideias IA Lab** para montar um pool pessoal a partir do histórico recente real do jogador.

## Estado atual

MVP funcional iniciado em 07/10/2026.

## O que já funciona

- busca por Riot ID + servidor;
- backend gamer compartilhado via `public-lol-profile`;
- até 100 partidas recentes consultadas pelo backend;
- recorte focado em Summoner's Rift (Ranked/Normal);
- agregação por campeão;
- função principal e funções observadas;
- partidas, vitórias, win rate, KDA médio e dano/min;
- sinal pessoal 0–100 baseado em volume recente + KDA + resultado da própria amostra;
- filtros por Top, Jungle, Mid, ADC e Support;
- ordenação por sinal, partidas e KDA;
- pool manual de até 5 campeões salvo por perfil;
- cobertura de funções do pool salvo;
- buscas recentes em localStorage;
- deep link com Riot ID + servidor;
- PT-BR principal + inglês;
- mobile;
- páginas Sobre, Privacidade e Termos;
- SEO básico;
- espaço preparado para anúncios;
- Static QA.

## Interpretação

O sinal pessoal **não é tier list** e **não prevê vitória futura**.

Ele só ordena familiaridade observável na amostra recente combinando:

- volume de partidas;
- KDA;
- resultado recente.

Matchup, patch, composição, adversários e preferência continuam fora desse número.

## Backend

Fonte:

`https://bieihhaobdztjyoweewa.supabase.co/functions/v1/public-lol-profile`

A chave Riot permanece server-side.

## QA

Execute:

`npm run check`

## Deploy

O workflow **Deploy GitHub Pages** está preparado.

Caso o Pages ainda não esteja habilitado:

1. Settings → Pages
2. Build and deployment
3. Source → GitHub Actions

## Gate antes de expandir

- [x] proposta de valor clara;
- [x] dados Riot reais;
- [x] agregação por campeão;
- [x] filtro por função;
- [x] pool salvo;
- [x] PT-BR/EN;
- [x] mobile;
- [x] páginas institucionais;
- [x] QA estático;
- [ ] GitHub Pages confirmado;
- [ ] Browser E2E;
- [ ] validar com 3+ Riot IDs/regiões;
- [ ] validar contas com pouco histórico;
- [ ] validar Top/Jungle/Mid/ADC/Support separadamente;
- [ ] revisar 404/429/timeout;
- [ ] revisar desktop/mobile publicado.

## V2 — somente após validação

- comparação entre pool atual e patch anterior;
- integração com mastery histórica;
- recomendação de pool complementar por função;
- cards compartilháveis;
- histórico persistente do pool;
- comparação entre dois pools;
- filtros por fila e patch.

## Compliance

Produto independente e não endossado pela Riot Games.

League of Legends e Riot Games são marcas de seus respectivos titulares.

Planejamento geral:

https://github.com/HelioConde/ideias-ia-lab
