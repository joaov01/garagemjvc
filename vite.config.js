import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        artigosHub: resolve(__dirname, 'artigos/index.html'),
        artigo1: resolve(__dirname, 'artigos/peliculas-nano-ceramica-carbono-profissional.html'),
        artigo2: resolve(__dirname, 'artigos/pelicula-antivandalismo-ps4-ps8-ps12-ps16.html'),
        artigo3: resolve(__dirname, 'artigos/melhor-loja-insulfilm-acessorios-zona-sul-sp.html'),
        artigo4: resolve(__dirname, 'artigos/o-que-e-ppf-diferenca-across-pro-max.html'),
        artigo5: resolve(__dirname, 'artigos/som-automotivo-sq-linha-nakamichi-garagem-jvc.html'),
        artigo6: resolve(__dirname, 'artigos/multimidia-carplay-android-auto-camera-de-re.html'),
        fundador: resolve(__dirname, 'artigos/joao-vitor-carmo.html'),
        artigoComparativo: resolve(__dirname, 'artigos/across-ultravision-hd-vs-window-blue-r5wf-solense-3m-garware.html'),
        melhorLojaSabara: resolve(__dirname, 'artigos/melhor-loja-peliculas-solares-antivandalismo-sabara-sp.html'),
      },
    },
  },
});
