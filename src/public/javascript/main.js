document.addEventListener('DOMContentLoaded', () => {

    const button = document.querySelector('#btn-search');
    const term = document.querySelector('#term');
    
    button.onclick = async (e) => {
        e.preventDefault();

        // clear div '#paginator'
        document.getElementById('paginator').innerHTML = '';

        _loader().show();
        _toTop();

        let searchFor = document.querySelector('input[name=chooseOption1]:checked').value;
        let whichBase = document.querySelector('input[name=chooseOption2]:checked').value;

        let search = {
            term: term.value,
            searchFor: searchFor,
            whichBase: whichBase,
            institution: ''
        };

        term.value = '';

        let result = await _findInLattes(search);
        _contentRender(result);

    }; 

});

const _findInLattes = (searchObj) => {
    const headers = { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ search: searchObj }) 
    };

    return fetch('/api/v1/search', headers)
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.log(err));
}

const _findByLattesId = (id) => {
    const headers = { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id: id }) 
    };

    return fetch('/api/v1/resume-detail', headers)
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.log(err));
}

const _accessNextPage = (url) => {
    const headers = { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ url: url }) 
    };

    return fetch('/api/v1/next-page', headers)
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.log(err));
}

const _contentRender = (resultObj) => {
    const reciver = document.getElementById('content');

    resultObj.pages && _paginatorRender(resultObj.pages);

    const content = `
        <h5>Resultados</h5>
        <hr>
        <ul class="list-unstyled">
        ${ resultObj.persons.map((person) => 
            `<li class="mb-2">
                <div class="card">
                    <div class="card-header d-flex 
                    justify-content-between align-itens-center">
                        <span>
                            <strong>${ person.name }</strong> 
                        </span>
                        <span>
                            <small class="ml-2">${ person.country }</small>
                        </span>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                        ${ person.resume.map((line, index) => index > 0 ? `
                            <li>${ line }</li>
                        ` : '' ).join('') }
                        </ul>
                        <a href="http://buscatextual.cnpq.br/buscatextual/preview.do?id=${ person.lattesId }" class="btn btn-outline-secondary btn-sm btn-lattes-detail mt-2" target="_blank">Preview</a>
                        <a href="http://buscatextual.cnpq.br/buscatextual/visualizacv.do?id=${ person.lattesId }" class="btn btn-outline-secondary btn-sm btn-lattes-detail mt-2 ml-2" target="_blank">Currículo</a>
                    </div>
                </div>
            </li>`
        ).join('') }
        </ul>`;

    reciver.innerHTML = content;

    const links = reciver.querySelectorAll('[data-lattes-id]');

    Array.prototype.filter.call(links, function(link) {

        link.addEventListener('click', async function (e) { 
            e.preventDefault();

            _loader().show();
            _toTop();

            let result = await _findByLattesId(link.dataset.lattesId);
            _renderResumeDetail(result);
        })
    })

    _loader().hide();
}

const _renderResumeDetail = (resumeObj) => {
    console.log(resumeObj);
}

const _paginatorRender = (pages) => {
    const reciver = document.getElementById('paginator');
    const content = `
        <ul class="d-flex justify-content-center flex-wrap list-unstyled">
            ${ pages.map((page, index) => 
                `<li>
                    <button type="button" class="btn btn-link btn-sm btn-next-page ${ index == 0 ? 'active' : '' }" data-target-url="${ page }">
                        ${ index + 1 }
                    </button>
                </li>`).join('') }
        </ul>
    `;

    reciver.innerHTML = content;

    const links = reciver.querySelectorAll('[data-target-url]');

    Array.prototype.filter.call(links, function(link) {

        link.addEventListener('click', async function (e) { 
            e.preventDefault();

            links.forEach(button => button.classList.remove('active'));

            this.classList.add('active');

            _loader().show();
            _toTop();

            let result = await _accessNextPage(link.dataset.targetUrl);
            _contentRender(result);
        })
    })
}

const _loader = () => {
    return {
        show: () => {
            document.getElementById('dloader').style.display = 'inline-block';
            document.getElementById('content').style.opacity = '0.2';
        },
        hide: () => {
            document.getElementById('content').style.opacity = '1';
            document.getElementById('dloader').style.display = 'none';
        }
    }
}

const _toTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}