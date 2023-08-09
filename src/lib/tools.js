var getElementById = function (id) {
  return document.getElementById(id)
}

var query = function (query) {
  var eles = document.querySelectorAll(query)
  var arr = []
  for (var i = 0; i < eles.length; i++) {
    arr.push(eles[i])
  }
  return arr
}

var addClass = function (ele, className) {
  var _className = ele.className
  var regExp = new RegExp(className)
  if (!regExp.test(_className)) {
    ele.className = _className + ' ' + className
  }
}

var removeClass = function (ele, className) {
  var _className = ele.className
  var regExp = new RegExp(className)
  ele.className = _className.replace(regExp, '')
}

var hasClass = function (ele, className) {
  return (new RegExp(className)).test(ele.className)
}

var toggleClass = function (ele, className) {
  if (hasClass(ele, className)) {
    removeClass(ele, className)
  } else {
    removeClass(ele, className)
  }
}

module.exports = {
  getElementById: getElementById,
  query: query,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  toggleClass: toggleClass
}
