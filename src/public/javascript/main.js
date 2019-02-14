document.addEventListener('DOMContentLoaded', () => {
    
    const button = document.querySelector('#btn-search');
    const term = document.querySelector('#term');
    
    button.onclick = async (e) => {
        e.preventDefault();

        document.getElementById('dloader').style.display = 'inline-block';
        document.getElementById('content').style.opacity = '0.2';

        let searchFor = document.querySelector('input[name=chooseOption1]:checked').value;
        let whichBase = document.querySelector('input[name=chooseOption2]:checked').value;

        let search = {
            term: term.value,
            searchFor: searchFor,
            whichBase: whichBase
        };

        term.value = '';

        let result = await _findInLattes(search);
        _contentRender(result);

    }

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

const _contentRender = (resultObj) => {
    const reciver = document.getElementById('content');
    const content = `
        <h5>Resultados</h5>
        <hr>
        <ul class="list-unstyled">
        ${ resultObj.persons.map((person, index) => 
            `<li class="mb-2">
                <div class="card">
                    <div class="card-header d-flex 
                    justify-content-between align-itens-center">
                        <span>
                            <strong>${ person.name }</strong> 
                            <small class="ml-2">${ person.country }</small>
                        </span>
                        <span><strong>#${ index+1 }</strong></span>
                        
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                        ${ person.resume.map((line, index) => index > 0 ? `
                            <li>${ line }</li>
                        ` : '' ).join('') }
                        </ul>
                        <a href="${ person.link }" class="btn btn-outline-secondary btn-sm mt-2" target="_blank">Currículo</a>
                    </div>
                </div>
            </li>`
        ).join('') }
        </ul>`;

    reciver.innerHTML = content;

    document.getElementById('content').style.opacity = '1';
    document.getElementById('dloader').style.display = 'none';
}