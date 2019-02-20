const setBaseUrl = (options) => {
    const findTerms = options.term.trim().split(' ').join('+');
    const searchFor = options.searchFor == 2 ? 'buscaAssunto=true' : 'buscaNome=true';
    const whichBase = options.whichBase == 2 ? 'buscarDoutores=true&buscarDemais=true' : 'buscarDoutores=true&buscarDemais=false';
    const insttName = options.institution ? options.institution.trim().split(' ').join('+') : '';

    return `http://buscatextual.cnpq.br/buscatextual/busca.do?metodo=buscar&acao=&modoIndAdhoc=null&buscaAvancada=0&filtros.${ searchFor }&textoBusca=${ findTerms }&${ whichBase }&buscarBrasileiros=true&buscarEstrangeiros=true&paisNascimento=0&buscarDoutoresAvancada=true&buscarBrasileirosAvancada=true&buscarEstrangeirosAvancada=true&paisNascimentoAvancada=0&filtro4=true&filtro8=true&filtros.atualizacaoCurriculo=48&quantidadeRegistros=10&filtros.visualizaEnderecoCV=true&filtros.visualizaFormacaoAcadTitCV=true&filtros.visualizaAtuacaoProfCV=true&filtros.visualizaAreasAtuacaoCV=true&filtros.visualizaPremiosTitulosCV=true&filtros.visualizaArtigosCV=true&filtros.visualizaOrientacoesConcluidasCV=true&filtros.radioPeriodoProducao=1&filtros.modalidadeBolsa=0&filtros.nivelFormacao=0&filtros.paisFormacao=0&filtros.regiaoFormacao=0&filtros.ufFormacao=0&filtros.buscaAtuacao=true&filtros.codigoGrandeAreaAtuacao=0&filtros.codigoAreaAtuacao=0&filtros.codigoSubareaAtuacao=0&filtros.codigoEspecialidadeAtuacao=0&filtros.idioma=0&filtros.grandeAreaProducao=0&filtros.areaProducao=0&filtros.setorProducao=0&filtros.naturezaAtividade=0&filtros.paisAtividade=BRA&filtros.regiaoAtividade=NE&filtros.ufAtividade=PB&filtros.nomeInstAtividade=${ insttName }`;
}

module.exports = setBaseUrl;
