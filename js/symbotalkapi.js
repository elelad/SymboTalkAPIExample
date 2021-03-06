
console.log(jQuery);
var c = {};
c.data = [];
c.lang = "en";
c.limit = 10;
c.repo = "all";

c.searchUrl = "https://symbotalkapiv1.azurewebsites.net/search/";
c.symbolUrl = "https://symbotalkapiv1.azurewebsites.net/symbols/";
//c.searchUrl = "localhost:1337/search/";

$(document).ready((() => {
    if (localStorage.getItem('sAPIlang')) c.lang = localStorage.getItem('sAPIlang');
    if (localStorage.getItem('sAPIrepo')) c.repo = localStorage.getItem('sAPIrepo');
    if (localStorage.getItem('sAPIlimit')) c.limit = +localStorage.getItem('sAPIlimit');
    $('#langSelect').val(c.lang);
    $('#symbolsSelect').val(c.repo);
    $('#limitSelect').val(c.limit);

    $.ajax({
        url: 'https://symbotalkapiv1.azurewebsites.net/search/?name=a',
        success: () => console.log('db on')
    })

}));

$("#query").on('keyup', function (e) {
    if (e.keyCode == 13) {
        c.search();
        // Do something
    }
});

$('#langSelect').on('change', () => {
    c.lang = $('#langSelect').val();
    localStorage.setItem('sAPIlang', c.lang);
});

$('#symbolsSelect').on('change', () => {
    c.repo = $('#symbolsSelect').val();
    localStorage.setItem('sAPIrepo', c.repo);
});


$('#limitSelect').on('change', () => {
    c.limit = $('#limitSelect').val();
    localStorage.setItem('sAPIlimit', c.limit);
});





c.search = function () {
    //$('#sResults').html()
    $('#loading').show();
    //let html = "<span class='center'><i class='fas fa-spinner fa-lg fa-pulse'></i></span>";
    //$('#sResults').html(html);
    let q = $('#query').val();
    let lang = $('#langSelect').val();
    console.log(lang);
    let repo = $('#symbolsSelect').val();
    console.log(repo);
    let limit = $('#limitSelect').val();
    console.log(limit);
    let url = c.searchUrl + '?name=' + q + '&repo=' + repo + '&lang=' + lang + '&limit=' + limit;
    console.log(url);
    $.ajax({
        url: url,
        success: c.dataToHtml,
        error: c.errorHendler
    })

}

c.errorHendler = function (respons) {
    console.log(respons);
    var html = "";
    if (respons.status == 400) {
        html = "<span class='center'>" + respons.responseText + "</span>";
    } else {
        html = "<span class='center'>An error has occurred, please try agein later...</span>"
    }
    $('#sResults').html(html);
    $('#loading').hide();
}

c.dataToHtml = function (data) {
    console.log(data);
    c.data = data;
    var html = "";
    if (data == "no query") {
        html = "<span class='center'>Please search something...</span>"
    } else if (data == 'no result') {
        html = "<span class='center'>No  result...</span>"
    } else if (data.error) {
        html = "<span class='center'>An error has occurred, please try agein later...</span>"
    }
    else {
        for (let i = 0; i < data.length; i++) {
            //console.log("for i: " + i);
            //console.log(data[i].translations[0].tName);
            let id = data[i].id;
            let name = (data[i].translations) ? (data[i].translations[0].tName) : data[i].name;
            html += `
            <li class="list-group-item d-flex flex-row p-0 pr-3">
                <div class="p-1">
                    <img alt="symbol" src="${data[i].image_url}" class="symbolThomb shadow-sm rounded" />
                </div>
                <div class="flex-grow-1 pt-2 pl-3">
                    <h5>${name}</h5>
                    <h6>From: ${data[i].repo_key}</h6>
                    <p>License: ${data[i].license}</p>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-outline-danger" type="button" onClick="c.more(${data[i].id})">More</button>
                </div>
            </li>
        `
        }/*  */
    }
    $('#sResults').html(html);
    $('#loading').hide();
}

c.toLang = function (iso) {
    switch (iso) {
        case 'en':
            return 'English'
            break;
        case 'es':
            return 'Spanish'
            break;
        case 'fr':
            return 'French'
            break;
        case 'de':
            return 'German'
            break;
        case 'pt':
            return 'Portuguese'
            break;
        case 'ru':
            return 'Russian'
            break;
        case 'iw':
            return 'Hebrew'
            break;
        case 'ja':
            return 'Japanese'
            break;
        case 'sv':
            return 'Swedish'
            break;
        case 'nl':
            return 'Dutch'
            break;
        case 'da':
            return 'Danish'
            break;
        case 'hu':
            return 'Hungarian'
            break;
        case 'pl':
            return 'Polish'
            break;
        case 'cs':
            return 'Czech'
            break;
        case 'no':
            return 'Norwegian'
            break;
        case 'ko':
            return 'Korean'
            break;
        case 'th':
            return 'Thai'
            break;
        case 'tr':
            return 'Turkish'
            break;
        case 'ar':
            return 'Arabic'
            break;
        case 'fi':
            return 'Finnish'
            break;
        case 'ro':
            return 'Romanian'
            break;
        case 'el':
            return 'Greek'
            break;
        case 'sk':
            return 'Slovak'
            break;
        case 'zh':
            return 'Chinese'
            break;
        default:
            return iso;
            break
    }

}

c.idToHtml = function (data) {
    console.log(data);
    $('#moreModalTitle').html(data.name);
    $('#moreModalImage').attr("src", data.image_url);
    $('#moreModalFrom').html('From: ' + data.repo_key);
    $('#moreModalLicense').html('License: ' + `<a href="${data.license_url}" target="blank">${data.license}</a>`);
    $('#moreModalAuthor').html('Author: ' + `<a href="${data.author_url}" target="blank">${data.author}</a>`);
    let list1 = "";
    let list2 = "";
    for (let i = 0; i < data.translations.length; i++) {
        lang = c.toLang(data.translations[i].tLang);
        if (i < 12) {
            list1 += `<li class="list-group-item"><strong>${lang}</strong>:  ${data.translations[i].tName}</li>`
        } else {
            list2 += `<li class="list-group-item"><strong>${lang}</strong>:  ${data.translations[i].tName}</li>`
        }

    }
    $('#moreModalTranslations1').html(list1);
    $('#moreModalTranslations2').html(list2);
    $('#moreModal').modal({ show: true });
    $('#loading').hide();
}

c.more = function (id) {
    console.log(id);
    $('#loading').show();
    $.ajax({
        url: c.symbolUrl + id,
        success: c.idToHtml
    })

}