(function () {

  const sanitize = (body) => {
    for (let element in body)
        body[element] = xss(body[element]);
    return body;
    }

})();
